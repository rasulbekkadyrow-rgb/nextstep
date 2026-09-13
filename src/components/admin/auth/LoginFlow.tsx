'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, Mail, ShieldCheck, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeInput } from './CodeInput';

/**
 * GIRIŞ AKYMY — IKI ÄDIM
 * ==================================================================
 * Ädim 1: e-poçta salgysy.  Ädim 2: poçtadan gelen 6 sanly kod.
 *
 * NÄME ÜÇIN PAROL ÝOK
 *  · Iki (soňra has köp) dolandyryjy bar. Parol bolanda ol hökman
 *    paýlaşylýar, depderçä ýazylýar we hiç haçan çalşyrylmaýar.
 *  · Parolsyz ulgamda rugsat e-poçta gutusyna baglanýar: işgär
 *    goşulanda salgysy sanawa ýazylýar, gidende — aýrylýar. Başga
 *    hiç zat etmeli däl.
 *  · Alyjy tarapynda çäklendirme ýok: Gmail, iCloud, Outlook,
 *    Yandex — hemmesi işleýär, iPhone-da hem, Android-da hem.
 *
 * INTERFEÝS KARARLARY
 *  · Iki ädim bir kartanyň içinde çalyşýar, täze sahypa geçilmeýär —
 *    kontekst ýitmeýär, «yza» düwmesi gerek bolmaýar.
 *  · Geçiş ugurly: öňe — çepe, yza — saga. Bu adamyň kellesinde
 *    «akymyň nirededigini» saklaýar.
 *  · Alty san dolan badyna barlag AWTOMATIK başlaýar. Goşmaça
 *    düwmä basmak artykmaç ädim — ýöne düwme ýene-de bar, sebäbi
 *    awtomatik hereket şowsuz bolsa ýol ýapyk galmaly däl.
 *  · Ýalňyşlyk ýazgysy meýdanyň ASTYNDA, sebäbi göz kody ýazandan
 *    soň şol ýere düşýär.
 */

type Step = 'email' | 'code';
type Status = 'idle' | 'sending' | 'verifying' | 'done';

/** «wepa.gurbanow@gmail.com» → «w•••••w@gmail.com» */
function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  if (name.length <= 2) return `${name[0]}•••@${domain}`;
  return `${name[0]}${'•'.repeat(Math.min(name.length - 2, 5))}${name[name.length - 1]}@${domain}`;
}

export function LoginFlow({ locale, back }: { locale: string; back?: string }) {
  const t = useTranslations('admin.login');
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [notice, setNotice] = useState<'console' | 'setup' | null>(null);

  /* Yzygiderli sekunt hasaby — «gaýtadan ibermek» düwmesi üçin */
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  /* Şol bir kod bilen iki gezek soralmagynyň öňüni almak */
  const verifying = useRef(false);

  const requestCode = useCallback(
    async (resend = false) => {
      setError(null);
      setStatus('sending');

      try {
        const response = await fetch('/api/admin/auth/kod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), locale }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (data.error === 'cooldown' && typeof data.retryAfter === 'number') {
            /* «Entek garaş» — bu ÝALŇYŞLYK däl: kod eýýäm iberilipdi we
               10 minut hereket edýär. Şonuň üçin adam kod ekranyna
               geçirilýär, sanaýjy bolsa haçan täzesini soramalydygyny
               görkezýär. Ýogsam sahypany täzeländen soň öz kodyny
               girizip bilmän galardy. */
            setResendIn(data.retryAfter);
            setStep('code');
            setStatus('idle');
            return;
          }
          setError(
            data.error === 'too_many' || data.error === 'too_many_requests'
              ? 'tooMany'
              : data.error === 'mail_failed'
                ? 'mailFailed'
                : data.error === 'storage'
                  ? 'storage'
                  : 'invalidEmail',
          );
          setStatus('idle');
          return;
        }

        setResendIn(typeof data.resendAfter === 'number' ? data.resendAfter : 60);
        setNotice(data.setup ? 'setup' : data.driver === 'console' ? 'console' : null);
        if (resend) setCode('');
        setStep('code');
        setStatus('idle');
      } catch {
        setError('network');
        setStatus('idle');
      }
    },
    [email, locale],
  );

  const verify = useCallback(
    async (value: string) => {
      if (verifying.current || value.length !== 6) return;
      verifying.current = true;

      setError(null);
      setStatus('verifying');

      try {
        const response = await fetch('/api/admin/auth/barla', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), code: value, locale, back }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const map: Record<string, string> = {
            invalid: 'invalidCode',
            not_found: 'invalidCode',
            expired: 'expired',
            locked: 'locked',
            not_allowed: 'notAllowed',
            too_many_requests: 'tooMany',
          };
          setError(map[data.error] ?? 'invalidCode');
          setStatus('idle');
          setCode('');
          verifying.current = false;
          return;
        }

        setStatus('done');
        /* `refresh` hökman: serwer komponentleri täze kuki bilen
           gaýtadan hasaplanmaly, ýogsam panel köne ýagdaýy görkezýär. */
        router.replace(data.redirect ?? `/${locale}/admin/satuw`);
        router.refresh();
      } catch {
        setError('network');
        setStatus('idle');
        verifying.current = false;
      }
    },
    [back, email, locale, router],
  );

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const busy = status === 'sending' || status === 'verifying' || status === 'done';

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {step === 'email' ? (
          /* ================= ÄDIM 1 — E-POÇTA ================= */
          <motion.form
            key="email"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={(event) => {
              event.preventDefault();
              if (emailValid && !busy) void requestCode();
            }}
            noValidate
          >
            <h1 className="text-h3 leading-tight">{t('title')}</h1>
            <p className="mt-2.5 text-body-sm text-muted">{t('subtitle')}</p>

            <label htmlFor="admin-email" className="mt-8 block text-label font-semibold uppercase text-faint">
              {t('emailLabel')}
            </label>

            <div className="relative mt-2.5">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-faint"
                aria-hidden
              />
              <input
                id="admin-email"
                type="email"
                inputMode="email"
                dir="ltr"
                autoComplete="username email"
                autoFocus
                spellCheck={false}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                placeholder={t('emailPlaceholder')}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'admin-login-error' : undefined}
                className={cn(
                  'w-full rounded-2xl border bg-surface/70 py-4 pl-11 pr-4 text-body-sm text-ink placeholder:text-faint',
                  'transition-all duration-300 ease-out-expo focus:outline-none focus:ring-4',
                  error
                    ? 'border-warn/55 focus:border-warn focus:ring-warn/15'
                    : 'border-line/14 focus:border-brand focus:ring-brand/15',
                )}
              />
            </div>

            <ErrorLine id="admin-login-error" message={error ? t(`errors.${error}`) : null} />

            <SubmitButton disabled={!emailValid || busy} busy={status === 'sending'} label={t('continue')} />

            <p className="mt-5 flex items-start gap-2.5 text-body-sm leading-relaxed text-faint">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand/70" aria-hidden />
              {t('passwordless')}
            </p>
          </motion.form>
        ) : (
          /* ================= ÄDIM 2 — KOD ================= */
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-h3 leading-tight">{t('codeTitle')}</h1>
            <p className="mt-2.5 text-body-sm text-muted">
              {t('codeSubtitle')}{' '}
              <span dir="ltr" className="font-semibold text-ink">
                {maskEmail(email.trim())}
              </span>
            </p>

            <div className="mt-7">
              <CodeInput
                label={t('codeLabel')}
                value={code}
                invalid={Boolean(error)}
                disabled={busy}
                onChange={(next) => {
                  setCode(next);
                  if (error) setError(null);
                }}
                onComplete={(full) => void verify(full)}
              />
            </div>

            <ErrorLine id="admin-login-error" message={error ? t(`errors.${error}`) : null} />

            {notice && (
              <p className="mt-4 rounded-2xl border border-warn/30 bg-warn/[0.07] p-3.5 text-body-sm leading-relaxed text-muted">
                <span className="font-semibold text-warn">{t(`notices.${notice}Title`)}. </span>
                {t(`notices.${notice}Text`)}
              </p>
            )}

            <SubmitButton
              type="button"
              onClick={() => void verify(code)}
              disabled={code.length !== 6 || busy}
              busy={status === 'verifying' || status === 'done'}
              done={status === 'done'}
              label={t('verify')}
            />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-body-sm">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError(null);
                  setNotice(null);
                }}
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {t('changeEmail')}
              </button>

              <button
                type="button"
                disabled={resendIn > 0 || busy}
                onClick={() => void requestCode(true)}
                className={cn(
                  'font-semibold transition-colors',
                  resendIn > 0 || busy ? 'cursor-not-allowed text-faint' : 'text-brand hover:text-brand-deep',
                )}
              >
                {resendIn > 0 ? t('resendIn', { seconds: resendIn }) : t('resend')}
              </button>
            </div>

            <div className="mt-7 border-t border-line/10 pt-5">
              <p className="text-body-sm font-semibold">{t('noMailTitle')}</p>
              <p className="mt-1.5 text-body-sm leading-relaxed text-muted">{t('noMailText')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Kiçi kömekçi bölekler ---------------- */

function ErrorLine({ id, message }: { id: string; message: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-2 overflow-hidden pt-3 text-body-sm text-warn"
        >
          <TriangleAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden />
          <span>{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function SubmitButton({
  disabled,
  busy,
  done,
  label,
  type = 'submit',
  onClick,
}: {
  disabled: boolean;
  busy: boolean;
  done?: boolean;
  label: string;
  type?: 'submit' | 'button';
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative mt-7 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full brand-gradient',
        'px-7 py-4 text-body-sm font-semibold text-brand-ink shadow-brand',
        'transition-all duration-300 ease-out-expo hover:brightness-110 active:scale-[0.985]',
        'disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none',
      )}
    >
      {/* Üstünden geçýän ýalpyldy — diňe işjeň ýagdaýda */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full group-disabled:hidden"
      />
      {done ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : null}
      <span>{label}</span>
      {!busy && !done && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
      )}
    </button>
  );
}
