'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ContactLinks } from '@/components/shared/ContactLinks';
import { HeroBackdrop } from './HeroBackdrop';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ banner }: { banner?: { src: string; mobile?: string } }) {
  const t = useTranslations('hero');
  const assurances = t.raw('assurances') as string[];
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section className="relative isolate overflow-hidden bg-deep pb-24 pt-24 text-white md:pb-32 md:pt-32">
      {banner ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-20"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <picture>
            {banner.mobile && <source media="(max-width: 767px)" srcSet={banner.mobile} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.src}
              alt=""
              loading="eager"
              fetchPriority="high"
              /* şapka sagda, tekst çepde */
              className="h-full w-full object-cover object-[75%_center]"
            />
          </picture>
        </motion.div>
      ) : (
        <div aria-hidden className="absolute inset-0 -z-20 opacity-30">
          <HeroBackdrop className="h-full w-full" />
        </div>
      )}

      {banner && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 hidden lg:block"
            style={{
              background:
                'linear-gradient(100deg, rgb(var(--c-deep) / 0.95) 0%, rgb(var(--c-deep) / 0.86) 34%, rgb(var(--c-deep) / 0.40) 60%, rgb(var(--c-deep) / 0.12) 100%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 lg:hidden"
            style={{
              background:
                'linear-gradient(to bottom, rgb(var(--c-deep) / 0.78), rgb(var(--c-deep) / 0.70) 50%, rgb(var(--c-deep) / 0.92))',
            }}
          />
        </>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgb(var(--c-brand) / 0.45), transparent)' }}
      />
      <div className="container relative">
        <div className="max-w-2xl lg:max-w-[36rem]">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C792]" />
            </span>
            <span className="text-label font-bold uppercase tracking-[0.1em] text-white/90">
              {t('badge')}
            </span>
          </motion.p>

          <h1 className="mt-7 text-h1 text-white">
            {[
              { text: t('titleLead'), accent: false },
              { text: t('titleAccent'), accent: true },
              { text: t('titleTail'), accent: false },
            ].map((part, i) => (
              <motion.span
                key={i}
                initial={reduceMotion ? false : { opacity: 0, y: 24, filter: 'blur(7px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.11, ease: EASE }}
                className={
                  part.accent
                    ? 'mr-[0.26em] inline-block text-[#C4A1FF]'
                    : 'mr-[0.26em] inline-block'
                }
              >
                {part.text}
              </motion.span>
            ))}
          </h1>

          <motion.p {...rise(0.44)} className="mt-6 max-w-[52ch] text-body text-white/80 md:text-body-lg">
            {t('subtitle')}
          </motion.p>

          <motion.div {...rise(0.56)} className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button
              href="#arza"
              size="lg"
              className="shadow-brand-lg"
              icon={<ArrowRight className="h-[1.1rem] w-[1.1rem]" />}
            >
              {t('ctaPrimary')}
            </Button>
            <a
              href="#uniwersitetler"
              className="inline-flex items-center rounded-full border border-white/25 px-7 py-4 text-body font-bold text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
            >
              {t('ctaSecondary')}
            </a>
          </motion.div>

          <motion.ul
            {...rise(0.66)}
            className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6"
          >
            {assurances.map((line) => (
              <li key={line} className="flex items-center gap-2 text-body-sm font-semibold text-white/85">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#34C792]/20 text-[#5BE0AE]">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
                {line}
              </li>
            ))}
          </motion.ul>

          <div className="mt-8">
            <ContactLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
