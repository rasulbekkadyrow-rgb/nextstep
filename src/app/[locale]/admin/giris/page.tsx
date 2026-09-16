import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { isLocale, locales } from '@/lib/i18n';
import { Logo } from '@/components/shared/Logo';
import { AuroraField } from '@/components/ui/AuroraField';
import { LoginFlow } from '@/components/admin/auth/LoginFlow';
import { getCurrentAdmin } from '@/lib/auth/current';

/**
 * ADMIN — GIRIŞ SAHYPASY
 * ==================================================================
 * Öňki görnüşi GÖRKEZME idi: parol soralmaýardy, diňe rol saýlanýardy
 * we ol gutapjyga ýazylýardy. Ýagny brauzeriň gurallaryny açyp bilýän
 * islendik adam panele girip bilerdi. Indi ol doly çalşyryldy:
 *
 *   e-poçta → poçta gelen 6 sanly kod → gol çekilen seans kukisi
 *
 * SAHYPANYŇ GURLUŞY
 * · Fonda `AuroraField` — diňe bezeg däl: aýna material (`.lg`) diňe
 *   aşagynda hereket bar bolanda görünýär. Tegiz fonda karta ýönekeý
 *   ak gutujyga öwrülýär.
 * · Ähli logika `LoginFlow` müşderi komponentinde. Bu sahypanyň özi
 *   serwerde işleýär we diňe bir zady barlaýar: eýýäm giren adamy
 *   giriş sahypasynda saklamak manysyz — ol öz paneline ugradylýar.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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

  const current = await getCurrentAdmin();
  if (current) {
    redirect(`/${locale}/admin/${current.user.role === 'analytics' ? 'analitika' : 'satuw'}`);
  }

  const sp = await searchParams;
  const t = await getTranslations('admin.login');

  /* `yzyna` URL-den gelýär — oňa daşarky salgy hem ýazylyp bilner.
     Şonuň üçin diňe içerki admin ýoly geçirilýär (ikinji barlag
     serwerde, `barla` ýolunda hem bar). */
  const rawBack = typeof sp.yzyna === 'string' ? sp.yzyna : '';
  const back = /^\/(tm|ru|tr)\/admin\/(satuw|analitika|topar)$/.test(rawBack) ? rawBack : undefined;

  return (
    <main className="grain relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
      <AuroraField intensity="soft" className="absolute inset-0" />

      <div className="lg relative w-full max-w-[27rem] rounded-4xl p-8 shadow-lift sm:p-10">
        <Logo size="lg" />

        <div className="mt-8">
          <LoginFlow locale={locale} back={back} />
        </div>

        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center gap-2 text-body-sm text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('back')}
        </Link>
      </div>
    </main>
  );
}
