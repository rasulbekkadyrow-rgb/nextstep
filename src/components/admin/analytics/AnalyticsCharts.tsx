'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import { TRAFFIC_30D, SOURCE_SHARES, FUNNEL, DEVICE_SHARES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

/**
 * SELJERME GRAFIKLERI
 * ==================================================================
 * Reňk ulgamy: her grafikde iň köp 2–3 reňk ulanylýar. Sebäbi
 * reňkleriň köpelmegi maglumaty däl-de, «bezegi» görkezýär.
 *
 *  · Benewşe (brand) — myhmanlar (esasy akym)
 *  · Ýaşyl (ok)    — arzalar (maksat hereketi)
 *  · Çal (faint)     — kömekçi çyzyklar we tor
 *
 * Grafikler `ResponsiveContainer` içinde — telefonda hem dogry
 * ölçelýär. Tooltip bolsa taslamanyň öz stilinde ýazyldy, sebäbi
 * Recharts-yň standart görnüşi dizaýn ulgamyna gabat gelenok.
 */

const AXIS_STYLE = { fontSize: 11, fill: 'rgb(var(--c-faint))' };

export function TrafficChart() {
  const t = useTranslations('admin.analytics.charts');
  const [range, setRange] = useState<7 | 14 | 30>(30);
  const data = TRAFFIC_30D.slice(-range);

  return (
    <section className="rounded-2xl border border-line/10 bg-surface/50 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-h4">{t('trafficTitle')}</h2>
          <p className="mt-1 text-body-sm text-muted">{t('trafficSubtitle')}</p>
        </div>

        {/* Döwür saýlawy */}
        <div className="flex gap-1 rounded-full border border-line/10 bg-base/60 p-1">
          {([7, 14, 30] as const).map((value) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={cn(
                'tnum rounded-full px-3.5 py-1.5 text-body-sm font-semibold transition-colors duration-200',
                range === value ? 'bg-brand text-brand-ink' : 'text-muted hover:text-ink',
              )}
            >
              {value}g
            </button>
          ))}
        </div>
      </header>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="grad-visitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity={0.36} />
                <stop offset="100%" stopColor="rgb(var(--c-brand))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-leads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--c-ok))" stopOpacity={0.32} />
                <stop offset="100%" stopColor="rgb(var(--c-ok))" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgb(var(--c-line))" strokeOpacity={0.07} vertical={false} />
            <XAxis
              dataKey="date" tick={AXIS_STYLE} tickLine={false} axisLine={false} minTickGap={28}
              tickFormatter={(value: string) => value.slice(5).replace('-', '.')}
            />
            <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgb(var(--c-brand))', strokeOpacity: 0.3 }} />

            <Area type="monotone" dataKey="visitors" stroke="rgb(var(--c-brand))" strokeWidth={2} fill="url(#grad-visitors)" />
            <Area type="monotone" dataKey="leads" stroke="rgb(var(--c-ok))" strokeWidth={2} fill="url(#grad-leads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Öwrülme tapgyrlary — her ädimde näçe adamyň galýandygy */
export function ConversionFunnel() {
  const t = useTranslations('admin.analytics');
  const max = FUNNEL[0].count;

  return (
    <section className="rounded-2xl border border-line/10 bg-surface/50 p-6">
      <h2 className="text-h4">{t('charts.funnelTitle')}</h2>

      <ol className="mt-6 space-y-3">
        {FUNNEL.map((stage, i) => {
          const share = (stage.count / max) * 100;
          /* Öňki tapgyrdan näçe göterim geçdi — iň gymmatly san */
          const stepRate = i === 0 ? 100 : (stage.count / FUNNEL[i - 1].count) * 100;

          return (
            <li key={stage.key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-body-sm">{t(`funnelStages.${stage.key}`)}</span>
                <span className="flex items-baseline gap-2">
                  <span className="tnum text-body-sm font-semibold">
                    {stage.count.toLocaleString('ru-RU')}
                  </span>
                  {i > 0 && (
                    <span
                      className={cn(
                        'tnum text-micro font-bold',
                        stepRate < 30 ? 'text-brand' : stepRate < 60 ? 'text-warn' : 'text-ok',
                      )}
                    >
                      {stepRate.toFixed(1).replace('.', ',')}%
                    </span>
                  )}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-line/[0.07]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${share}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-brand to-ok"
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Gatnawyň çeşmeleri — halka diagrammasy */
export function SourcesChart() {
  const t = useTranslations('admin.analytics.charts');
  const tSources = useTranslations('admin.sales.sources');

  const COLORS = [
    'rgb(var(--c-brand))', 'rgb(var(--c-ok))', 'rgb(var(--c-gold))',
    'rgb(var(--c-brand) / 0.55)', 'rgb(var(--c-ok) / 0.5)',
  ];

  const labelFor = (key: string) =>
    key === 'organic' ? 'Google / organiki' : key === 'direct' ? 'Göni giriş' : tSources(key);

  return (
    <section className="rounded-2xl border border-line/10 bg-surface/50 p-6">
      <h2 className="text-h4">{t('sourcesTitle')}</h2>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <div className="h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SOURCE_SHARES}
                dataKey="value"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                stroke="none"
              >
                {SOURCE_SHARES.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip suffix="%" />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex-1 space-y-2.5">
          {SOURCE_SHARES.map((item, i) => (
            <li key={item.key} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: COLORS[i % COLORS.length] }}
                aria-hidden
              />
              <span className="flex-1 truncate text-body-sm text-muted">{labelFor(item.key)}</span>
              <span className="tnum text-body-sm font-semibold">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Enjamlar boýunça paýlanyş — mobil ileri tutulmagyny tassyklaýar */
export function DevicesChart() {
  const t = useTranslations('admin.analytics');

  return (
    <section className="rounded-2xl border border-line/10 bg-surface/50 p-6">
      <h2 className="text-h4">{t('charts.devicesTitle')}</h2>
      <div className="mt-5 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={DEVICE_SHARES.map((d) => ({ ...d, name: t(`devices.${d.key}`) }))}
            layout="vertical"
            margin={{ left: -12, right: 12 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={AXIS_STYLE} tickLine={false} axisLine={false} width={110} />
            <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ fill: 'rgb(var(--c-line) / 0.05)' }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
              {DEVICE_SHARES.map((_, i) => (
                <Cell key={i} fill={i === 0 ? 'rgb(var(--c-brand))' : 'rgb(var(--c-brand) / 0.4)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Taslamanyň öz stilindäki maglumat penjiresi */
function CustomTooltip({
  active, payload, label, suffix = '',
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-line/12 bg-elevated/95 px-3.5 py-2.5 shadow-lift backdrop-blur-xl">
      {label && <p className="mb-1.5 text-micro font-semibold text-faint">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2 text-body-sm">
          <span className="h-2 w-2 rounded-sm" style={{ background: entry.color }} aria-hidden />
          <span className="tnum font-semibold">
            {entry.value.toLocaleString('ru-RU')}{suffix}
          </span>
        </p>
      ))}
    </div>
  );
}
