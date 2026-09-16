import { useTranslations } from 'next-intl';
import { CalendarClock, ChevronDown, FileCheck2 } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

interface Step {
  index: string;
  title: string;
  duration: string;
  text: string;
  deliverable: string;
  bullets: string[];
}

export function HowItWorks() {
  const t = useTranslations('process');
  const steps = t.raw('steps') as Step[];

  return (
    <section id="tertip" className="scroll-mt-24 bg-surface py-14 md:py-20">
      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-4 text-h2">{t('title')}</h2>
            <p className="mt-3 max-w-[58ch] text-body-lg text-muted">{t('subtitle')}</p>
          </div>
        </Reveal>

        <ol className="mt-8 grid items-start gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.index}>
              <Reveal delay={0.05 * i} className="card flex flex-col rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="tnum grid h-9 w-9 place-items-center rounded-full bg-brand font-display text-body-sm font-extrabold text-brand-ink shadow-brand">
                    {step.index}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-micro font-bold uppercase tracking-[0.04em] text-brand">
                    <CalendarClock className="h-3 w-3" aria-hidden />
                    <span className="sr-only">{t('durationLabel')}: </span>
                    {step.duration}
                  </span>
                </div>

                <h3 className="mt-4 text-h4 leading-snug">{step.title}</h3>

                <p className="mt-3 flex items-start gap-2 text-body-sm font-semibold">
                  <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                  <span>
                    <span className="sr-only">{t('deliverableLabel')}: </span>
                    {step.deliverable}
                  </span>
                </p>

                <details className="group mt-4 border-t border-line/10 pt-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-body-sm font-bold text-brand [&::-webkit-details-marker]:hidden">
                    {t('moreLabel')}
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="mt-2 text-body-sm leading-relaxed text-muted">{step.text}</p>
                  <ul className="mt-3 space-y-1">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-body-sm text-muted">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </details>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
