import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { AdminShell, KpiCard, type NavItem } from '@/components/admin/AdminShell';
import { KanbanBoard } from '@/components/admin/sales/KanbanBoard';
import { TelegramWidget } from '@/components/admin/sales/TelegramWidget';
import { MOCK_LEADS, TELEGRAM_DEFAULTS } from '@/lib/mock-data';
import { documentProgress } from '@/lib/types';
import { getCurrentAdmin, toTeamMember } from '@/lib/auth/current';

/**
 * ADMIN 1 — TALYP ÝÜZTUTMALARYNYŇ DOLANDYRYJYSY
 * ==================================================================
 * Bu paneliň eýesiniň günlük wezipesi: gelen ýüztutma tiz jogap
 * bermek we talyby kabul hatyna çenli ýöretmek. Şonuň üçin ekranyň
 * gurluşy şeýle:
 *
 *   1. Ýokarda — dört esasy görkeziji (gyssagly ýagdaýa baha bermek).
 *   2. Ortada — Kanban tagtasy (günüň esasy iş meýdany).
 *   3. Sagda — Telegram integrasiýasy.
 *
 * «Resminamasy ýetmeýän» görkezijisi bilkastlaýyn öňe çykaryldy:
 * bu işde iň ýygy gijikdiriji sebäp — ýygnalmadyk resminama.
 */
export default async function SalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  /* Aradaky gatlak goly barlady; bu ýerde ikinji barlag: adam henizem
     sanawdamy we işjeňmi. Kuki 7 gün ýaşaýar — şol wagtyň içinde
     rugsat yzyna alnan bolmagy mümkin. */
  const current = await getCurrentAdmin();
  if (!current) redirect(`/${locale}/admin/giris?yzyna=/${locale}/admin/satuw`);

  const t = await getTranslations('admin.sales');
  const tTeam = await getTranslations('admin.team');

  /* Görkezijiler — önümçilikde maglumat gorundan hasaplanýar */
  const newToday = MOCK_LEADS.filter((l) => l.stage === 'new').length;
  const inProgress = MOCK_LEADS.filter((l) =>
    ['consulted', 'documents', 'applied'].includes(l.stage)).length;
  const acceptedMonth = MOCK_LEADS.filter((l) =>
    ['accepted', 'enrolled'].includes(l.stage)).length;
  const docsPending = MOCK_LEADS.filter((l) =>
    ['documents', 'consulted'].includes(l.stage) && documentProgress(l.documents) < 100).length;

  const nav: NavItem[] = [
    { href: `/${locale}/admin/satuw`, label: t('nav.board'), icon: 'board', badge: newToday },
    { href: `/${locale}/admin/satuw/yuztutmalar`, label: t('nav.leads'), icon: 'leads' },
    { href: `/${locale}/admin/satuw/mohletler`, label: t('nav.calendar'), icon: 'calendar' },
    { href: `/${locale}/admin/satuw/telegram`, label: t('nav.telegram'), icon: 'telegram' },
    { href: `/${locale}/admin/satuw/sazlamalar`, label: t('nav.settings'), icon: 'settings' },
    /* «Topar» diňe eýä görünýär — dolandyryjy goşmak iň güýçli hereket */
    ...(current.user.role === 'owner'
      ? ([{ href: `/${locale}/admin/topar`, label: tTeam('title'), icon: 'team' }] as NavItem[])
      : []),
  ];

  return (
    <AdminShell
      nav={nav}
      title={t('title')}
      subtitle={t('subtitle')}
      user={toTeamMember(current.user)}
      accent="brand"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={t('kpi.newToday')} value={String(newToday)} delta={25} />
        <KpiCard label={t('kpi.inProgress')} value={String(inProgress)} delta={8.3} />
        <KpiCard label={t('kpi.acceptedMonth')} value={String(acceptedMonth)} delta={16.7} accent="ok" />
        <KpiCard label={t('kpi.docsPending')} value={String(docsPending)} delta={-12.5} accent="gold" />
      </div>

      <div className="mt-8 grid gap-6 2xl:grid-cols-12">
        <div className="min-w-0 2xl:col-span-9">
          <KanbanBoard initialLeads={MOCK_LEADS} />
        </div>
        <div className="2xl:col-span-3">
          <TelegramWidget settings={TELEGRAM_DEFAULTS} />
        </div>
      </div>
    </AdminShell>
  );
}
