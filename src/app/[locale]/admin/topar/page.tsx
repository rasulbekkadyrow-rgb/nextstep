import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/lib/i18n';
import { AdminShell, type NavItem } from '@/components/admin/AdminShell';
import { TeamManager } from '@/components/admin/team/TeamManager';
import { getCurrentAdmin, toTeamMember } from '@/lib/auth/current';
import { listAdmins } from '@/lib/auth/admins';

/**
 * ADMIN — TOPAR (diňe `owner` roly üçin)
 * ==================================================================
 * Bu ýerde täze dolandyryjy goşulýar. Ol şeýle sada bolmaly:
 * e-poçta + rol → şol adam şobada girip bilýär.
 *
 * IKI GATLAKLY GORAG
 *  1. `middleware.ts` — kukiniň goly we roly barlanýar (Edge).
 *  2. Şu sahypa — dolandyryjynyň sanawdaky HÄZIRKI ýagdaýy barlanýar.
 *     Kuki 7 gün ýaşaýar, adamyň roly bolsa şol wagtyň içinde
 *     üýtgän bolmagy mümkin. Şonuň üçin ikinji barlag hökman.
 */
export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const current = await getCurrentAdmin();
  if (!current) redirect(`/${locale}/admin/giris?yzyna=/${locale}/admin/topar`);
  if (current.user.role !== 'owner') redirect(`/${locale}/admin/satuw`);

  const t = await getTranslations('admin.team');
  const tSales = await getTranslations('admin.sales');
  const tAnalytics = await getTranslations('admin.analytics');

  const nav: NavItem[] = [
    { href: `/${locale}/admin/satuw`, label: tSales('title'), icon: 'board' },
    { href: `/${locale}/admin/analitika`, label: tAnalytics('title'), icon: 'analytics' },
    { href: `/${locale}/admin/topar`, label: t('title'), icon: 'team' },
  ];

  const admins = await listAdmins();

  return (
    <AdminShell
      nav={nav}
      title={t('title')}
      subtitle={t('subtitle')}
      user={toTeamMember(current.user)}
      accent="brand"
    >
      <TeamManager initial={admins} currentId={current.user.id} />
    </AdminShell>
  );
}
