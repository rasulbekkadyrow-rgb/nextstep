'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { UniversityMarquee } from './UniversityMarquee';
import { UniversityLogo } from './UniversityLogo';
import { UNIVERSITIES } from '@/lib/universities';
import { cn } from '@/lib/utils';

interface Uni { name: string; short: string; note: string }

/**
 * UNIWERSITETLER BÖLÜMI
 * ==================================================================
 * Bu bölüm hyzmatyň iň anyk we barlanýan bölegi: müşderi haýsy
 * uniwersitetler barada gürrüň gidýändigini görýär.
 *
 * LOGOTIPLER
 * Hakyky logo `public/universities/<slug>.png` faýly bar bolsa
 * görkezilýär, ýok bolsa onuň ýerine bitewi stildäki monogram
 * (BAU, IGU…) galýar — şol bir `UniversityLogo` komponenti ikisini
 * hem çözýär. Faýllary goşmagyň tertibi şol papkadaky README-de.
 *
 * ⚠️ Logotipler hukuk taýdan goralan nyşanlardyr — olary goýmazdan
 * öň uniwersitetden rugsat alynmalydyr.
 */
export function Universities() {
  const t = useTranslations('universities');
  const items = t.raw('items') as Uni[];
  const [active, setActive] = useState<number | null>(null);

  /* Kartalar terjime faýlyndan gelýär, logo bolsa `lib/universities`-den —
     ikisi gysgaltma (BAU, IGU…) boýunça baglanyşdyrylýar. */
  const entries = new Map(UNIVERSITIES.map((u) => [u.short, u]));

  return (
    <section id="uniwersitetler" className="relative scroll-mt-24 py-24 md:py-28">
      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 text-h2">{t('title')}</h2>
            <p className="mt-5 max-w-[58ch] text-body-lg text-muted">{t('subtitle')}</p>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line/12 bg-surface px-3.5 py-1.5 text-body-sm text-muted shadow-soft">
              <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden />
              <span className="sr-only">{t('cityLabel')}: </span>
              {t('city')}
            </p>
          </div>
        </Reveal>

        {/* ---- Animasiýaly lenta: ähli uniwersitetler ---- */}
        <Reveal delay={0.08}>
          <div className="mt-12">
            <UniversityMarquee />
          </div>
        </Reveal>

        {/* ---- Arza taýýarlaýan uniwersitetlerimiz, jikme-jik ---- */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((uni, i) => (
            <Reveal key={uni.short} delay={0.05 * i}>
              <article
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  'lg lg-press group relative h-full overflow-hidden rounded-3xl p-6',
                  'transition-transform duration-500 ease-out-expo',
                  active === i && '-translate-y-1',
                )}
              >
                {/* Logo — faýl ýok bolsa monogram */}
                <div className="flex items-start justify-between gap-4">
                  {entries.get(uni.short) ? (
                    <UniversityLogo uni={entries.get(uni.short)!} size={56} />
                  ) : (
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line/12 bg-base font-display text-body-sm font-extrabold tracking-[0.06em] text-muted">
                      {uni.short}
                    </span>
                  )}

                  <span className="font-mono text-micro uppercase tracking-[0.12em] text-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-5 text-h4 leading-tight">{uni.name}</h3>
                <p className="mt-2.5 text-body-sm leading-relaxed text-muted">{uni.note}</p>

                {/* Aşakdaky çyzyk hover-de çepden saga ýaýraýar */}
                <motion.span
                  aria-hidden
                  className="absolute inset-x-6 bottom-0 h-px origin-left bg-brand"
                  initial={false}
                  animate={{ scaleX: active === i ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
