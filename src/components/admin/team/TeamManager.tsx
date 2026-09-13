'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Check,
  KanbanSquare,
  Loader2,
  Lock,
  Mail,
  Pause,
  Play,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/lib/auth/admins';
import type { AdminRole } from '@/lib/auth/session';

/**
 * TOPARY DOLANDYRMAK
 * ==================================================================
 * Bu ekranyň ýeke-täk wezipesi: **täze işgäri goşmak bir hereket
 * bolmaly**. E-poçta ýazylýar, rol saýlanýar — şobada ol adam öz
 * salgysyna gelýän kod bilen girip bilýär. Parol döretmek, ony
 * ibermek, çalyşdyrmak ýaly ädimler ýok.
 *
 * KARARLAR
 *  · Rol gapdalynda gysgaça DÜŞÜNDIRIŞ bar. «Satuw / Seljerme» diýen
 *    sözler özbaşdak ýeterlik däl — kimiň nämä eli ýetýändigi anyk
 *    ýazylmaly, ýogsam ýalňyş rol berilýär.
 *  · Pozmagyň deregine ilki «wagtlaýyn ýapmak» teklip edilýär:
 *    işgär rugsatly dynç alyşda bolup biler, taryhy bolsa galmaly.
 *  · Eýäniň özüni pozmagy we soňky eýäni ýapmagy serwerde-de
 *    gadagan — ýogsam ulgama girip bolmaýan ýagdaý döreýär.
 *  · `ADMIN_EMAILS` gurşaw üýtgeýjisinden gelen ýazgylarda gulp
 *    nyşany bar: olar diňe serweriň sazlamasyndan üýtgeýär. Bu —
 *    ätiýaçlyk açar.
 */

const ROLE_ICON: Record<AdminRole, React.ElementType> = {
  sales: KanbanSquare,
  analytics: BarChart3,
  owner: ShieldCheck,
};

export function TeamManager({ initial, currentId }: { initial: AdminUser[]; currentId: string }) {
  const t = useTranslations('admin.team');

  const [admins, setAdmins] = useState<AdminUser[]>(initial);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<AdminRole>('sales');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  const reload = async () => {
    const response = await fetch('/api/admin/topar');
    if (response.ok) setAdmins((await response.json()).admins);
  };

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const response = await fetch('/api/admin/topar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined, role }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error === 'already_exists' ? 'exists' : 'invalid');
        return;
      }

      setAdded(email.trim());
      setEmail('');
      setName('');
      await reload();
      setTimeout(() => setAdded(null), 4000);
    } catch {
      setError('network');
    } finally {
      setBusy(false);
    }
  };

  const patch = async (id: string, body: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/topar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error === 'last_owner' ? 'lastOwner' : data.error === 'self_change' ? 'self' : 'invalid');
      return;
    }
    setError(null);
    await reload();
  };

  const remove = async (id: string) => {
    if (!window.confirm(t('confirmRemove'))) return;

    const response = await fetch(`/api/admin/topar/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error === 'protected' ? 'protected' : data.error === 'last_owner' ? 'lastOwner' : 'invalid');
      return;
    }
    setError(null);
    await reload();
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      {/* ================= SANAW ================= */}
      <section className="rounded-2xl border border-line/10 bg-surface/50 p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-h4">{t('listTitle')}</h2>
            <p className="mt-1 text-body-sm text-muted">{t('listSubtitle')}</p>
          </div>
          <span className="tnum shrink-0 rounded-full border border-line/12 px-2.5 py-1 text-micro font-semibold text-muted">
            {admins.length}
          </span>
        </header>

        <ul className="mt-6 space-y-2.5">
          {admins.map((admin) => {
            const Icon = ROLE_ICON[admin.role];
            const isSelf = admin.id === currentId;

            return (
              <motion.li
                key={admin.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'rounded-2xl border p-4 transition-colors duration-300',
                  admin.active ? 'border-line/10 bg-base/50' : 'border-line/10 bg-base/20 opacity-70',
                )}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-body-sm font-bold text-white"
                    style={{ background: `rgb(${avatarColor(admin.email)})` }}
                    aria-hidden
                  >
                    {initials(admin.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-body-sm font-semibold">
                      {admin.name}
                      {isSelf && <span className="text-micro font-medium text-faint">· {t('you')}</span>}
                      {admin.protected && (
                        <Lock className="h-3 w-3 shrink-0 text-faint" aria-label={t('protectedHint')} />
                      )}
                    </p>
                    <p dir="ltr" className="truncate text-micro text-faint">
                      {admin.email}
                    </p>
                  </div>

                  {/* Rol — göni sanawda üýtgedilýär, aýratyn ekran açylmaýar */}
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <select
                      value={admin.role}
                      disabled={isSelf}
                      onChange={(event) => void patch(admin.id, { role: event.target.value })}
                      aria-label={t('roleLabel')}
                      className="rounded-xl border border-line/12 bg-surface/70 px-3 py-2 text-body-sm text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/12 disabled:opacity-55"
                    >
                      <option value="sales">{t('roles.sales')}</option>
                      <option value="analytics">{t('roles.analytics')}</option>
                      <option value="owner">{t('roles.owner')}</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => void patch(admin.id, { active: !admin.active })}
                      title={admin.active ? t('pause') : t('resume')}
                      aria-label={admin.active ? t('pause') : t('resume')}
                      className="grid h-9 w-9 place-items-center rounded-xl text-muted transition-colors hover:bg-line/[0.06] hover:text-ink disabled:opacity-35"
                    >
                      {admin.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      disabled={isSelf || admin.protected}
                      onClick={() => void remove(admin.id)}
                      title={t('remove')}
                      aria-label={t('remove')}
                      className="grid h-9 w-9 place-items-center rounded-xl text-muted transition-colors hover:bg-warn/10 hover:text-warn disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-micro text-faint">
                  {admin.lastLoginAt
                    ? t('lastLogin', { date: formatDate(admin.lastLoginAt) })
                    : t('neverLoggedIn')}
                </p>
              </motion.li>
            );
          })}
        </ul>

        <AnimatePresence>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-start gap-2 overflow-hidden text-body-sm text-warn"
            >
              <TriangleAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden />
              {t(`errors.${error}`)}
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* ================= GOŞMAK ================= */}
      <section className="h-fit rounded-2xl border border-brand/20 bg-brand/[0.04] p-6">
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand">
            <UserPlus className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-h4">{t('addTitle')}</h2>
            <p className="mt-1 text-body-sm text-muted">{t('addSubtitle')}</p>
          </div>
        </div>

        <form onSubmit={add} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="new-email" className="block text-label font-semibold uppercase text-faint">
              {t('emailLabel')}
            </label>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
              <input
                id="new-email"
                type="email"
                dir="ltr"
                inputMode="email"
                autoComplete="off"
                spellCheck={false}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                placeholder="mekan@gmail.com"
                className="w-full rounded-xl border border-line/12 bg-surface/70 py-3 pl-10 pr-3.5 text-body-sm placeholder:text-faint focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="new-name" className="block text-label font-semibold uppercase text-faint">
              {t('nameLabel')}
            </label>
            <input
              id="new-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('namePlaceholder')}
              className="mt-2 w-full rounded-xl border border-line/12 bg-surface/70 px-3.5 py-3 text-body-sm placeholder:text-faint focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/12"
            />
          </div>

          <fieldset>
            <legend className="text-label font-semibold uppercase text-faint">{t('roleLabel')}</legend>
            <div className="mt-2 space-y-2">
              {(['sales', 'analytics', 'owner'] as const).map((value) => {
                const Icon = ROLE_ICON[value];
                const active = role === value;
                return (
                  <label
                    key={value}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all duration-300 ease-out-expo',
                      active
                        ? 'border-brand/45 bg-brand/[0.08]'
                        : 'border-line/12 bg-surface/50 hover:border-brand/25',
                    )}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={active}
                      onChange={() => setRole(value)}
                      className="sr-only"
                    />
                    <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', active ? 'text-brand' : 'text-faint')} aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-body-sm font-semibold">{t(`roles.${value}`)}</span>
                      <span className="mt-0.5 block text-micro leading-relaxed text-muted">
                        {t(`roleNotes.${value}`)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!emailValid || busy}
            className="flex w-full items-center justify-center gap-2 rounded-full brand-gradient px-6 py-3.5 text-body-sm font-semibold text-brand-ink shadow-brand transition-all duration-300 ease-out-expo hover:brightness-110 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
            {t('addButton')}
          </button>
        </form>

        <AnimatePresence>
          {added && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-2 rounded-xl border border-ok/30 bg-ok/[0.07] p-3.5 text-body-sm text-ok"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{t('addedHint', { email: added })}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

/* ---------------- Kömekçi funksiýalar ---------------- */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Serwerdäki `avatarColorOf` bilen deň netije bermeli — şol bir algoritm */
function avatarColor(email: string): string {
  const colors = ['132 0 252', '12 168 240', '13 148 104', '176 132 58', '118 114 148'];
  let hash = 0;
  for (let i = 0; i < email.length; i += 1) hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  return colors[hash % colors.length];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ashgabat',
  });
}
