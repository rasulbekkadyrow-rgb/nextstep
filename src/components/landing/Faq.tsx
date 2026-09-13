'use client';

import { useState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FAQ — AKKORDEON
 * ------------------------------------------------------------------
 * Elýeterlilik (a11y) talaplary doly berjaý edilýär:
 *  · Her sözbaşy hakyky `<button>` — klawiatura bilen işleýär.
 *  · `aria-expanded` we `aria-controls` baglanyşygy bar.
 *  · Beýiklik `height: auto` bilen animasiýa edilýär (kesilme ýok).
 *
 * UX kararlary: birbada diňe bir jogap açyk bolýar. Bu ulanyjynyň
 * ünsüni dargatmaýar we sahypanyň uzynlygyny çaklap bolýan edýär.
 */
export function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items') as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="w-full">
      <p className="eyebrow">{t('eyebrow')}</p>
      <h2 className="mt-5 text-h3 md:text-h2">{t('title')}</h2>
      <p className="mt-4 max-w-[52ch] text-body text-muted">{t('subtitle')}</p>

      <div className="mt-9 divide-y divide-line/10 border-y border-line/10">
        {items.map((item, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;

          return (
            <div key={i}>
              <h3>
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-brand"
                >
                  <span className="text-body-lg font-semibold tracking-tight">{item.q}</span>

                  {/* Plýus → krest öwrülişi: ýumşak 45° aýlanma */}
                  <span
                    aria-hidden
                    className={cn(
                      'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-400 ease-out-expo',
                      isOpen
                        ? 'rotate-45 border-brand bg-brand text-brand-ink'
                        : 'border-line/15 text-muted group-hover:border-brand/50 group-hover:text-brand',
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[64ch] pb-6 pr-10 text-body leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
