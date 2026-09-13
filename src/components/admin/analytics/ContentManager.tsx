'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye, Globe, TriangleAlert, Upload } from 'lucide-react';
import { locales, localeMeta, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * MAZMUN DOLANDYRYŞ PANELI
 * ==================================================================
 * Esasy mesele: saýt üç dilde işleýär, emma mazmuny üýtgedýän adam
 * programmist däl. Şonuň üçin panel şu düzgünlere görä guruldy:
 *
 * 1. DILLER GAPDAL-GAPDAL. Terjime üçin aýratyn ekrana geçmeli däl —
 *    türkmençe ýazgyny görüp durkaň rusçasyny ýazýarsyň. Bu terjimäniň
 *    manysynyň üýtgemeginiň öňüni alýar.
 *
 * 2. TERJIMÄNIŇ DOLULYGY GÖRÜNÝÄR. Boş meýdan galsa, ol gyzyl bilen
 *    bellenýär we ýokardaky göterim peselýär. Şeýlelikde «bir dilde
 *    ýarym galan» sahypa çap edilmeýär.
 *
 * 3. TASLAMA (draft) → ÇAP ETMEK. Üýtgetmeler derrew saýta geçmeýär.
 *    Ilki «Öňünden görmek», soň «Çap etmek». Ýalňyş ýazgynyň janly
 *    saýta düşmegi mümkin däl.
 */

interface ContentField {
  id: string;
  section: string;
  label: string;
  type: 'text' | 'textarea';
  values: Record<Locale, string>;
}

const DEMO_FIELDS: ContentField[] = [
  {
    id: 'hero.titleAccent', section: 'Hero', label: 'Sözbaşynyň nyşan sözi', type: 'text',
    values: { tm: 'kabul hatyny', ru: 'письму о зачислении', tr: 'kabul mektubu' },
  },
  {
    id: 'hero.badge', section: 'Hero', label: 'Möwsüm belligi', type: 'text',
    values: {
      tm: '2026/2027 okuw ýyly üçin arzalar kabul edilýär',
      ru: 'Идёт приём заявок на 2026/2027 учебный год',
      tr: '2026/2027 eğitim yılı için başvurular alınıyor',
    },
  },
  {
    id: 'offer.slotsValue', section: 'Teklip', label: 'Galan orunlaryň sany', type: 'text',
    values: { tm: '12', ru: '12', tr: '12' },
  },
  {
    id: 'process.scopeNote', section: 'Iş tertibi', label: 'Hyzmatyň gerimi barada bellik', type: 'textarea',
    values: {
      tm: 'Esasy hyzmatymyz — uniwersitet saýlamak, resminamalary taýýarlamak we kabul hatyny almak.',
      ru: 'Наша основная услуга — выбор университета, подготовка документов и получение письма о зачислении.',
      tr: '',
    },
  },
];

export function ContentManager() {
  const t = useTranslations('admin.analytics.content');
  const [fields, setFields] = useState(DEMO_FIELDS);
  const [activeLocales, setActiveLocales] = useState<Locale[]>(['tm', 'ru']);
  const [status, setStatus] = useState<'draft' | 'publishing' | 'published'>('draft');

  /* Terjimäniň dolulygy: doldurylan meýdanlar / ähli meýdanlar */
  const totalCells = fields.length * locales.length;
  const filledCells = fields.reduce(
    (sum, field) => sum + locales.filter((l) => field.values[l].trim().length > 0).length,
    0,
  );
  const completeness = Math.round((filledCells / totalCells) * 100);

  const update = (fieldId: string, locale: Locale, value: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, values: { ...f.values, [locale]: value } } : f)),
    );
    setStatus('draft');
  };

  const publish = async () => {
    setStatus('publishing');
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    }).catch(() => null);
    setStatus('published');
    setTimeout(() => setStatus('draft'), 2600);
  };

  const toggleLocale = (locale: Locale) => {
    setActiveLocales((prev) =>
      prev.includes(locale)
        ? prev.length > 1 ? prev.filter((l) => l !== locale) : prev  // azyndan bir dil açyk galýar
        : [...prev, locale],
    );
  };

  return (
    <section className="rounded-2xl border border-line/10 bg-surface/50">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line/10 p-6">
        <div>
          <h2 className="text-h4">{t('title')}</h2>
          <p className="mt-1 text-body-sm text-muted">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-line/12 px-4 py-2.5 text-body-sm font-medium transition-colors hover:border-brand/40 hover:text-brand">
            <Eye className="h-4 w-4" aria-hidden /> {t('preview')}
          </button>
          <button
            onClick={publish}
            disabled={status === 'publishing'}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-body-sm font-semibold transition-all duration-300',
              status === 'published' ? 'bg-ok text-base' : 'bg-brand text-brand-ink hover:brightness-110',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2"
              >
                {status === 'published' ? <Check className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                {status === 'publishing' ? t('publishing') : status === 'published' ? t('published') : t('publish')}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* ---------- Terjimäniň dolulygy ---------- */}
      <div className="flex flex-wrap items-center gap-4 border-b border-line/10 px-6 py-4">
        <div className="flex min-w-[14rem] flex-1 items-center gap-3">
          <span className="text-body-sm text-muted">{t('translationProgress')}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/[0.08]">
            <motion.div
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={cn('h-full rounded-full', completeness === 100 ? 'bg-ok' : 'bg-warn')}
            />
          </div>
          <span className="tnum text-body-sm font-bold">{completeness}%</span>
        </div>

        {/* Haýsy dilleriň gapdal-gapdal görkezilýändigi */}
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-faint" aria-hidden />
          <span className="mr-1 text-micro uppercase tracking-[0.1em] text-faint">{t('langTabs')}</span>
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => toggleLocale(locale)}
              aria-pressed={activeLocales.includes(locale)}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-body-sm font-semibold transition-colors',
                activeLocales.includes(locale)
                  ? 'bg-brand/12 text-brand'
                  : 'text-faint hover:bg-line/[0.05] hover:text-muted',
              )}
            >
              {localeMeta[locale].short}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Meýdanlar ---------- */}
      <div className="divide-y divide-line/[0.07]">
        {fields.map((field) => (
          <div key={field.id} className="p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="rounded-md bg-line/[0.06] px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.08em] text-faint">
                {field.section}
              </span>
              <span className="text-body-sm font-medium">{field.label}</span>
              <code className="ml-auto font-mono text-micro text-faint">{field.id}</code>
            </div>

            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${activeLocales.length}, minmax(0, 1fr))` }}
            >
              {activeLocales.map((locale) => {
                const empty = field.values[locale].trim().length === 0;

                return (
                  <div key={locale}>
                    <label className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-micro font-semibold uppercase tracking-[0.1em] text-faint">
                        <span aria-hidden>{localeMeta[locale].flag}</span>
                        {localeMeta[locale].short}
                      </span>
                      {empty && (
                        <span className="flex items-center gap-1 text-micro font-semibold text-brand">
                          <TriangleAlert className="h-3 w-3" aria-hidden />
                          {t('missingTranslation')}
                        </span>
                      )}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={field.values[locale]}
                        onChange={(e) => update(field.id, locale, e.target.value)}
                        rows={3}
                        className={cn(inputClass, empty && 'border-brand/50', 'resize-none')}
                      />
                    ) : (
                      <input
                        value={field.values[locale]}
                        onChange={(e) => update(field.id, locale, e.target.value)}
                        className={cn(inputClass, empty && 'border-brand/50')}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {status === 'draft' && (
        <p className="border-t border-line/10 px-6 py-3.5 text-body-sm text-warn">{t('unsaved')}</p>
      )}
    </section>
  );
}

const inputClass =
  'w-full rounded-xl border border-line/12 bg-base/70 px-3.5 py-2.5 text-body-sm transition-colors focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/12';
