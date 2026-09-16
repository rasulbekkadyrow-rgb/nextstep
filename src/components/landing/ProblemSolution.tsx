import { useTranslations } from 'next-intl';
import { Compass, FileX2, CalendarClock, ShieldCheck, TriangleAlert, Check, ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const ICONS = {
  compass: Compass,                 // ugur saýlamak
  'file-x': FileX2,                 // resminamanyň yzyna gaýtarylmagy
  'calendar-clock': CalendarClock,  // möhletler
  shield: ShieldCheck,              // araçylara ynam
} as const;

interface Item {
  icon: keyof typeof ICONS;
  before: { title: string; text: string };
  after: { title: string; text: string };
}

export function ProblemSolution() {
  const t = useTranslations('problem');
  const items = t.raw('items') as Item[];

  return (
    <section id="kynçylyk" className="on-deep scroll-mt-24 py-14 md:py-20">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">{t('eyebrow')}</p>
            <h2 className="mt-4 text-h2">{t('title')}</h2>
            <p className="mx-auto mt-3 max-w-[58ch] text-body-lg text-deep-muted">
              {t('subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Compass;

            return (
              <Reveal key={i} delay={0.06 * i}>
                <article
                  className={
                    'h-full rounded-2xl border border-white/[0.07] bg-deep-soft/70 p-5'
                  }
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-azure/15 text-azure">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>

                  <p className="mt-4 inline-flex items-center gap-1.5 text-label font-extrabold uppercase tracking-[0.12em] text-ok">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    {t('switchAfter')}
                  </p>
                  <h3 className="mt-2 text-h4 leading-snug">{item.after.title}</h3>
                  <p className="mt-2 text-body-sm leading-relaxed text-deep-muted">
                    {item.after.text}
                  </p>

                  <details className="group mt-4 border-t border-white/[0.08] pt-3">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 text-label font-bold uppercase tracking-[0.08em] text-deep-muted/80 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                      <TriangleAlert className="h-3.5 w-3.5" aria-hidden />
                      {t('switchBefore')}
                      <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="mt-2 text-body-sm leading-relaxed text-deep-muted/75">
                      {item.before.text}
                    </p>
                  </details>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
