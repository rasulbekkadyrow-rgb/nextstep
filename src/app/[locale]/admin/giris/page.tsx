import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, BarChart3, Info, KanbanSquare } from 'lucide-react';
import { isLocale, locales } from '@/lib/i18n';
import { Logo } from '@/components/shared/Logo';

/**
 * ADMIN — GIRIŞ SAHYPASY
 * ==================================================================
 * Aradaky gatlak (`middleware.ts`) giriş edilmedik ulanyjyny şu ýere
 * ugrukdyrýar. Öň bu sahypa ÝOKDY: gönükdirme boş ýere barýardy we
 * üstesine goragçy giriş sahypasynyň özüni hem tutup, çäksiz aýlaw
 * döredýärdi (`ERR_TOO_MANY_REDIRECTS`).
 *
 * ⚠️ GÖRKEZME GIRIŞ — HAKYKY BARLAG ÝOK.
 * Bu ýerde parol soralmaýar: diňe rol saýlanýar we gutapjyga (cookie)
 * ýazylýar. Aradaky gatlakdaky düşündirişe laýyklykda, önümçilige
 * çykmazdan ozal ol NextAuth / Supabase Auth ýaly hakyky ulgama
 * çalşyrylmalydyr. Şerti üýtgetmek gerek däl — diňe çeşmesini.
 *
 * AÇYK GÖNÜKDIRME (open redirect) HOWPY
 * `yzyna` parametri URL-den gelýär, ýagny oňa islendik zat
 * ýazylyp bilner — şol sanda daşarky saýt. Şonuň üçin ol göni
 * ulanylmaýar: diňe `/{dil}/admin/...` görnüşindäki içerki ýol kabul
 * edilýär, galan ýagdaýda ulanyjy öz adaty paneline iberilýär.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** `yzyna` diňe içerki admin ýoly bolsa kabul edilýär. */
function safeTarget(raw: unknown, locale: string, role: 'sales' | 'analytics') {
  const fallback = `/${locale}/admin/${role === 'analytics' ? 'analitika' : 'satuw'}`;
  if (typeof raw !== 'string') return fallback;
  if (!/^\/(tm|ru|tr)\/admin\/(satuw|analitika)$/.test(raw)) return fallback;
  return raw;
}

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const sp = await searchParams;
  const t = await getTranslations('admin.login');

  async function signIn(formData: FormData) {
    'use server';
    const role = formData.get('role') === 'analytics' ? 'analytics' : 'sales';
    const loc = String(formData.get('locale') ?? 'tm');
    const target = safeTarget(formData.get('back'), loc, role);

    const jar = await cookies();
    const opts = { path: '/', sameSite: 'lax' as const, maxAge: 60 * 60 * 8 };
    jar.set('ns_session', 'demo', opts);
    jar.set('ns_role', role, opts);

    redirect(target);
  }

  const panels = [
    { role: 'sales', icon: KanbanSquare, title: t('sales'), note: t('salesNote') },
    { role: 'analytics', icon: BarChart3, title: t('analytics'), note: t('analyticsNote') },
  ] as const;

  return (
    <main className="grain relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[52rem] -translate-x-1/2 blur-3xl"
        style={{
          background:
            'radial-gradient(52% 50% at 50% 38%, rgb(var(--c-brand) / 0.26), rgb(var(--c-azure) / 0.16) 56%, transparent 78%)',
        }}
      />

      <div className="lg lg-solid relative w-full max-w-lg rounded-4xl p-8 shadow-lift sm:p-10">
        <Logo size="lg" />

        <h1 className="mt-8 text-h3 leading-tight">{t('title')}</h1>
        <p className="mt-2.5 text-body-sm text-muted">{t('subtitle')}</p>

        <div className="mt-8 space-y-3">
          {panels.map(({ role, icon: Icon, title, note }) => (
            <form key={role} action={signIn}>
              <input type="hidden" name="role" value={role} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="back" value={typeof sp.yzyna === 'string' ? sp.yzyna : ''} />
              <button
                type="submit"
                className="group flex w-full items-center gap-4 rounded-3xl border border-line/12 bg-base/60 px-5 py-4 text-left transition-all duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-brand/25 bg-brand/[0.08] text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-body font-bold tracking-tight">{title}</span>
                  <span className="mt-0.5 block text-body-sm text-muted">{note}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand" aria-hidden />
              </button>
            </form>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-warn/30 bg-warn/[0.07] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden />
          <p className="text-body-sm leading-relaxed text-muted">
            <span className="font-semibold text-warn">{t('demoTitle')}. </span>
            {t('demoText')}
          </p>
        </div>

        <Link
          href={`/${locale}`}
          className="mt-7 inline-flex items-center gap-2 text-body-sm text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('back')}
        </Link>
      </div>
    </main>
  );
}
