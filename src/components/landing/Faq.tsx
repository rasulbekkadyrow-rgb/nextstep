'use client';

import { useState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items') as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="w-full">
      <p className="eyebrow">{t('eyebrow')}</p>
      <h2 className="mt-5 text-h3 md:text-h2">{t('title')}</h2>
      <p className="mt-4 max-w-[52ch] text-body text-muted">{t('subtitle')}</p>

      <div className="mt-6 space-y-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;

          return (
            <div
              key={i}
              className={cn(
                'overflow-hidden rounded-2xl border transition-colors duration-300',
                isOpen ? 'border-brand/25 bg-brand-soft/50' : 'border-line/10 bg-white',
              )}
            >
              <h3>
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-start justify-between gap-6 px-5 py-4 text-left transition-colors hover:text-brand md:px-6"
                >
                  <span className="font-display text-body font-bold tracking-tight">{item.q}</span>

                  <span
                    aria-hidden
                    className={cn(
                      'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-400 ease-out-expo',
                      isOpen
                        ? 'rotate-45 bg-brand text-brand-ink'
                        : 'bg-surface text-muted group-hover:bg-brand-soft group-hover:text-brand',
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
                    <p className="max-w-[64ch] px-5 pb-6 pr-12 text-body leading-relaxed text-muted md:px-6 md:pr-14">
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
