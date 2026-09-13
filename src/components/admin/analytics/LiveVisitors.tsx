'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { localeMeta, locales } from '@/lib/i18n';
import { LANG_SHARES } from '@/lib/mock-data';

/**
 * HAKYKY WAGTDAKY MYHMANLAR
 * ==================================================================
 * Bu widget saýtda şu pursatda näçe adamyň bardygyny görkezýär.
 *
 * ÖNÜMÇILIKDE: maglumat `Server-Sent Events` (SSE) arkaly gelmeli —
 * `new EventSource('/api/analytics/live')`. SSE saýlandy, WebSocket
 * däl, sebäbi maglumat diňe bir tarapa akýar (serwerden brauzere)
 * we SSE awtomatik gaýtadan birikmegi özi dolandyrýar.
 *
 * AŞAKDAKY KOD: görkezme (demo) görnüşi — her 4 sekuntda sany ýeňil
 * üýtgedýär, şeýlelikde interfeýsiň janly işleýşini synap bolýar.
 */
export function LiveVisitors() {
  const t = useTranslations('admin.analytics.charts');
  const [count, setCount] = useState(23);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    /* --- Önümçilikde şu blok SSE bilen çalşylýar ---
       const stream = new EventSource('/api/analytics/live');
       stream.onmessage = (e) => setCount(JSON.parse(e.data).visitors);
       return () => stream.close();
    */
    const timer = setInterval(() => {
      setCount((prev) => Math.max(8, prev + Math.round((Math.random() - 0.45) * 5)));
      setPulse((p) => p + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-line/10 bg-surface/50 p-6">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-ok" />
        </span>
        <h2 className="text-body-sm font-semibold uppercase tracking-[0.1em] text-muted">
          {t('liveTitle')}
        </h2>
      </div>

      {/* San üýtgände ýokardan aşak süýşüp çalyşýar */}
      <div className="mt-5 flex items-baseline gap-2">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="tnum font-display text-5xl font-extrabold tracking-tight"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span className="text-body-sm text-muted">{t('liveUnit')}</span>
      </div>

      {/* Soňky pursatlaryň ritmi — ýönekeý sparkline */}
      <div className="mt-6 flex h-12 items-end gap-1">
        {Array.from({ length: 24 }, (_, i) => {
          const height = 25 + ((Math.sin((i + pulse) / 2.2) + 1) / 2) * 70;
          return (
            <motion.span
              key={i}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex-1 rounded-sm bg-brand/35"
            />
          );
        })}
      </div>

      {/* Dil boýunça paýlanyş — üç dilli saýt üçin esasy görkeziji */}
      <div className="mt-auto pt-6">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-faint">
          {t('langTitle')}
        </p>
        <ul className="mt-3 space-y-2">
          {LANG_SHARES.map((item) => {
            const locale = locales.find((l) => l === item.key);
            return (
              <li key={item.key} className="flex items-center gap-2.5">
                <span aria-hidden>{locale ? localeMeta[locale].flag : '🌐'}</span>
                <span className="w-8 text-body-sm text-muted">
                  {locale ? localeMeta[locale].short : item.key}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-brand"
                  />
                </div>
                <span className="tnum w-9 text-right text-body-sm font-semibold">{item.value}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
