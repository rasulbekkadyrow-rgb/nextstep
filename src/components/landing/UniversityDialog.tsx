'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin, BadgeCheck, ArrowRight } from 'lucide-react';
import { WhatsAppMark } from '@/components/ui/BrandIcons';
import { UniversityLogo } from './UniversityLogo';
import { CONTACTS } from '@/lib/contacts';
import type { UniversityEntry } from '@/lib/universities';
import { cn } from '@/lib/utils';

/** Portal bilen body-ä çykarylýar: Reveal-daky filter fixed-i döwýär. */
export function UniversityDialog({
  uni,
  note,
  onClose,
}: {
  uni: UniversityEntry | null;
  note?: string;
  onClose: () => void;
}) {
  const t = useTranslations('universities.detail');
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!uni) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [uni, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {uni && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="fixed inset-0"
            style={{
              backgroundColor: 'rgb(var(--c-scrim) / 0.66)',
              backdropFilter: 'blur(14px) saturate(60%)',
              WebkitBackdropFilter: 'blur(14px) saturate(60%)',
            }}
            onClick={onClose}
            aria-hidden
          />

          {/* pes ekranda penjire sygmasa skroll edilýär */}
          <div className="absolute inset-0 overflow-y-auto overscroll-contain">
            <div
              className="flex min-h-full items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="uni-dialog-title"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="paper relative w-full max-w-md overflow-hidden rounded-4xl p-7 sm:p-8"
          >

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label={t('close')}
              className="absolute right-5 top-6 grid h-9 w-9 place-items-center rounded-full border border-line/12 text-muted transition-colors hover:border-brand/40 hover:text-brand"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="relative">
              <UniversityLogo uni={uni} size={76} />

              <span
                className={cn(
                  'mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-label font-extrabold uppercase tracking-[0.1em]',
                  uni.partner ? 'bg-brand-soft text-brand' : 'bg-surface text-muted',
                )}
              >
                {uni.partner && <BadgeCheck className="h-3.5 w-3.5" aria-hidden />}
                {uni.partner ? t('partner') : t('other')}
              </span>

              <h3 id="uni-dialog-title" className="mt-4 text-h3 leading-tight">
                {uni.name}
              </h3>

              <p className="mt-3 inline-flex items-center gap-2 text-body-sm text-muted">
                <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden />
                <span className="sr-only">{t('cityLabel')}: </span>
                {uni.city}
              </p>

              <p className="mt-5 text-body-sm leading-relaxed text-muted">
                {note ?? t('generic')}
              </p>

              <div className="mt-7 flex flex-col gap-2.5">
                <a
                  href={CONTACTS.whatsapp[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand px-5 py-3.5 text-body-sm font-bold text-brand-ink shadow-brand transition-colors duration-300 hover:bg-brand-deep"
                >
                  <WhatsAppMark className="h-4 w-4" />
                  {t('ask')}
                </a>
                <a
                  href="#arza"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line/15 px-5 py-3.5 text-body-sm font-bold transition-colors hover:border-brand/40 hover:text-brand"
                >
                  {t('apply')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
