import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Filter, FileText, Briefcase, Image as ImageIcon } from 'lucide-react';
import { isLocale } from '@/lib/i18n';
import { AdminShell, KpiCard } from '@/components/admin/AdminShell';
import {
  TrafficChart, ConversionFunnel, SourcesChart, DevicesChart,
} from '@/components/admin/analytics/AnalyticsCharts';
import { ContentManager } from '@/components/admin/analytics/ContentManager';
import { LiveVisitors } from '@/components/admin/analytics/LiveVisitors';
import { TEAM, TRAFFIC_30D } from '@/lib/mock-data';

/**
 * ADMIN 2 — SELJERME WE MAZMUN DOLANDYRYJYSY
 * ==================================================================
 * Bu paneliň eýesiniň wezipesi: saýtyň nähili işleýändigini ölçemek
 * we mazmuny üç dilde-de täzeläp durmak.
 *
 * Ekranyň mantygy «umumydan jikme-jige»:
 *   1. Görkezijiler — ýagdaýa umumy baha.
 *   2. Gatnawyň dinamikasy + janly myhmanlar.
 *   3. Öwrülme tapgyrlary, çeşmeler, enjamlar — sebäbini tapmak.
 *   4. Mazmun redaktory — tapylan meselä derrew täsir etmek.
 *
 * Şu tertip «gördüm → düşündim → düzetdim» zynjyryny bir ekranda
 * ýapýar: dolandyryjy başga ulgama geçmeli bolmaýar.
 */
export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('admin.analytics');

  /* Soňky 30 günüň jemi — önümçilikde analitika API-sinden gelýär */
  const visitors = TRAFFIC_30D.reduce((sum, d) => sum + d.visitors, 0);
  const leads = TRAFFIC_30D.reduce((sum, d) => sum + d.leads, 0);
  const conversion = ((leads / visitors) * 100).toFixed(1).replace('.', ',');

  const nav = [
    { href: `/${locale}/admin/analitika`, label: t('nav.overview'), icon: LayoutDashboard },
    { href: `/${locale}/admin/analitika/gatnaw`, label: t('nav.traffic'), icon: TrendingUp },
    { href: `/${locale}/admin/analitika/tapgyrlar`, label: t('nav.funnel'), icon: Filter },
    { href: `/${locale}/admin/analitika/mazmun`, label: t('nav.content'), icon: FileText },
    { href: `/${locale}/admin/analitika/keysler`, label: t('nav.cases'), icon: Briefcase },
    { href: `/${locale}/admin/analitika/media`, label: t('nav.media'), icon: ImageIcon },
  ];

  return (
    <AdminShell
      nav={nav}
      title={t('title')}
      subtitle={t('subtitle')}
      user={TEAM[1]}
      accent="ok"
    >
      {/* ---------- Esasy görkezijiler ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={t('kpi.visitors')} value={visitors.toLocaleString('ru-RU')} delta={18.6} />
        <KpiCard label={t('kpi.leads')} value={String(leads)} delta={24.1} accent="ok" />
        <KpiCard label={t('kpi.conversion')} value={`${conversion}%`} delta={4.7} accent="ok" />
        <KpiCard label={t('kpi.avgTime')} value="2:48" delta={-3.2} accent="gold" />
      </div>

      {/* ---------- Gatnaw + janly myhmanlar ---------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <TrafficChart />
        </div>
        <div className="xl:col-span-4">
          <LiveVisitors />
        </div>
      </div>

      {/* ---------- Tapgyrlar, çeşmeler, enjamlar ---------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ConversionFunnel />
        <SourcesChart />
        <DevicesChart />
      </div>

      {/* ---------- Mazmun redaktory ---------- */}
      <div className="mt-6">
        <ContentManager />
      </div>
    </AdminShell>
  );
}
