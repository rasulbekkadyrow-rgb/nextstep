'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { CalendarClock, FileCheck2, Check } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

interface Step {
  index: string;
  title: string;
  duration: string;
  text: string;
  deliverable: string;
  bullets: string[];
}

/**
 * «BU NÄHILI IŞLEÝÄR?» BÖLÜMI — WOW effekt
 * ------------------------------------------------------------------
 * Esasy pikir: skroll edilende dik çyzyk (timeline) ýokardan aşak
 * doldurylýar we her ädim öz nobatynda «janlanýar». Ulanyjy prosesi
 * diňe okamaýar — ony fiziki taýdan geçýär.
 *
 * Tehniki çözgüt: `useScroll` bölümiň içindäki ilerlemäni 0–1
 * aralygynda berýär; şol san çyzygyň beýikligine öwrülýär.
 * `useSpring` bolsa hereketi «ýumşadýar» — skroll togtasa-da,
 * çyzyk kem-kemden ýerine baryp ýetýär.
 */
export function HowItWorks() {
  const t = useTranslations('process');
  const steps = t.raw('steps') as Step[];
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 65%', 'end 55%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const lineHeight = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <section id="tertip" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      {/* Bölümi tapawutlandyrýan ýumşak fon */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface/40" />

      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 text-h2">{t('title')}</h2>
            <p className="mt-5 max-w-[58ch] text-body-lg text-muted">{t('subtitle')}</p>
          </div>
        </Reveal>

        <div ref={trackRef} className="relative mt-16 md:mt-20">
          {/* ---- Dik çyzyk (timeline) ---- */}
          <div
            aria-hidden
            className="absolute left-[1.4rem] top-2 hidden h-[calc(100%-3rem)] w-px bg-line/12 md:block"
          >
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-brand via-brand to-ok"
            />
          </div>

          <ol className="space-y-5 md:space-y-8">
            {steps.map((step, i) => (
              <StepRow
                key={step.index}
                step={step}
                isLast={i === steps.length - 1}
                labels={{ duration: t('durationLabel'), deliverable: t('deliverableLabel') }}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepRow({
  step,
  isLast,
  labels,
}: {
  step: Step;
  isLast: boolean;
  labels: { duration: string; deliverable: string };
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px -25% 0px' });

  return (
    <li ref={ref} className="relative md:pl-20">
      {/* ---- Nokat: ädim janlananda dolýar ---- */}
      <motion.span
        aria-hidden
        initial={{ scale: 0.6, opacity: 0.4 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'absolute left-0 top-7 hidden h-11 w-11 place-items-center rounded-full border-2 md:grid',
          inView ? 'border-brand bg-brand text-brand-ink' : 'border-line/15 bg-base text-faint',
        )}
      >
        {isLast && inView ? (
          <Check className="h-5 w-5" />
        ) : (
          <span className="tnum font-display text-body-sm font-bold">{step.index}</span>
        )}
      </motion.span>

      <motion.article
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group rounded-3xl border border-line/10 bg-base/80 p-7 backdrop-blur-sm transition-all duration-500 ease-out-expo hover:border-brand/25 hover:shadow-lift md:p-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="tnum font-mono text-micro font-bold text-brand md:hidden">{step.index}</span>
          <h3 className="text-h3">{step.title}</h3>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line/12 bg-surface/70 px-3 py-1 text-micro font-semibold uppercase tracking-[0.08em] text-muted">
            <CalendarClock className="h-3 w-3" aria-hidden />
            <span className="sr-only">{labels.duration}: </span>
            {step.duration}
          </span>
        </div>

        <p className="mt-4 max-w-[62ch] text-body text-muted">{step.text}</p>

        {/* Ädimiň içindäki işler */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {step.bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-lg border border-line/10 bg-surface/60 px-3 py-1.5 text-body-sm text-muted"
            >
              {bullet}
            </li>
          ))}
        </ul>

        {/* Eliňize gowşýan netije — iň möhüm ynam nokady */}
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-brand/15 bg-brand/[0.055] p-4">
          <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand">
              {labels.deliverable}
            </p>
            <p className="mt-1 text-body-sm font-medium">{step.deliverable}</p>
          </div>
        </div>
      </motion.article>
    </li>
  );
}
