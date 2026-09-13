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

/**
 * UNIWERSITETIŇ MAGLUMAT PENJIRESI
 * ==================================================================
 * Lentadaky logonyň üstüne basylanda açylýar.
 *
 * ⚠️ NÄME ÜÇIN BU ÝERDE «FAKT» ÝOK?
 * Penjirede ýyllyk töleg, reýting ýa-da esaslandyrylan ýyly ýaly
 * sanlar GÖRKEZILMEÝÄR. Sebäbi olar hakyky, barlanan maglumat
 * bolmaly — ýasama san müşderini ýalňyş karara iterýär we markanyň
 * ynamyny ýykýar. Şonuň üçin penjire diňe barlanan zady görkezýär:
 * resmi at, şäher, hyzmatdaşlyk ýagdaýy we redaksiýa ýazgysy.
 * Galanyny ulanyjy bir basmakda göni WhatsApp-dan soraýar.
 *
 * Anyk sanlar elýeterli bolanda `note` ýerine olar goşulyp bilner —
 * gurluş taýýar.
 *
 * ⚠️ NÄME ÜÇIN PORTAL?
 * Penjire lentanyň içinden çagyrylýar, lenta bolsa `Reveal`-yň
 * içinde — ol `filter: blur()` ulanýar. CSS-de `filter` (`transform`
 * ýaly) `position: fixed` çagalary üçin TÄZE GAPDAL ÇÄK döredýär:
 * şonda `inset-0` ekrany däl-de şol gutyny tutýar. Netijede perde
 * diňe lentanyň zolagyny örtýärdi we penjire onuň daşyna çykýardy.
 * `createPortal` düwüni göni `body`-ä geçirýär — ähli şeýle çäkler
 * ýitýär.
 *
 * ELÝETERLILIK
 *  · `role="dialog"` + `aria-modal` + `aria-labelledby`.
 *  · Esc ýapýar, daşyna basmak ýapýar.
 *  · Açylanda fokus ýapmak düwmesine geçýär, ýapylanda sahypanyň
 *    skrolly dikeldilýär.
 */
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
  /* Portal diňe brauzerde bar — serwerde `document` ýok. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!uni) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    /* Penjire açykka arkadaky sahypa skroll edilmeýär */
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
          {/* Perde: arkadaky sahypa garalýar, bulaşýar we reňkden
              gaçýar — göz diňe penjiredäki mazmuna düşýär. */}
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

          {/* Aýratyn skroll gatlagy. Pes ekranda (mysal üçin gorizontal
              telefonda) penjire ekrandan uzyn bolýar — merkezleşdirilen
              guty bolsa artykmajyny ÝOKARDAN çykarýar we oňa ýetip
              bolmaýar. `min-h-full` + `overflow-y-auto` jübüti muny
              çözýär: sygýan bolsa merkezde durýar, sygmaýan bolsa
              skroll edilýär. */}
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
            className="lg lg-solid relative w-full max-w-md overflow-hidden rounded-4xl p-7 shadow-lift sm:p-8"
          >
            {/* Markanyň şöhlesi — aýnanyň aşagyndaky reňk */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand/25 blur-3xl"
            />

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label={t('close')}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-line/12 text-muted transition-colors hover:border-brand/40 hover:text-brand"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="relative">
              <UniversityLogo uni={uni} size={76} />

              <span
                className={cn(
                  'mt-6 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.1em]',
                  uni.partner
                    ? 'border-brand/30 bg-brand/10 text-brand'
                    : 'border-line/15 bg-base/60 text-muted',
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
                  className="brand-gradient inline-flex items-center justify-center gap-2.5 rounded-full px-5 py-3.5 text-body-sm font-semibold text-brand-ink transition-transform duration-300 ease-out-expo hover:scale-[1.02]"
                >
                  <WhatsAppMark className="h-4 w-4" />
                  {t('ask')}
                </a>
                <a
                  href="#arza"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line/15 px-5 py-3.5 text-body-sm font-semibold transition-colors hover:border-brand/40 hover:text-brand"
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
