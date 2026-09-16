import { useTranslations } from 'next-intl';
import { Check, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Faq } from './Faq';
import { LeadForm } from './LeadForm';

export function FinalCta() {
  const t = useTranslations('offer');
  const includes = t.raw('includes') as string[];

  return (
    <section id="teklip" className="scroll-mt-24 py-14 md:py-20">
      <div className="container">
        <Reveal>
          <div className="paper overflow-hidden rounded-4xl">
            <div className="grid lg:grid-cols-12">
              <div className="p-6 md:p-8 lg:col-span-7">
                <p className="eyebrow">{t('eyebrow')}</p>
                <h2 className="mt-4 text-h2">{t('title')}</h2>
                <p className="mt-3 max-w-[52ch] text-body-lg text-muted">{t('subtitle')}</p>

                <p className="mt-6 text-label font-extrabold uppercase tracking-[0.14em] text-muted">
                  {t('includesLabel')}
                </p>
                <ul className="mt-3 space-y-2">
                  {includes.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ok/12 text-ok">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-body-sm text-muted">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-line/10 bg-surface p-6 md:p-8 lg:col-span-5 lg:border-l lg:border-t-0">
                <div className="rounded-2xl bg-brand-soft p-5">
                  <p className="text-label font-extrabold uppercase tracking-[0.14em] text-brand">
                    {t('priceLabel')}
                  </p>
                  <p className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-brand">
                    {t('priceValue')}
                  </p>
                  <p className="mt-3 text-body-sm leading-relaxed text-muted">{t('priceNote')}</p>
                </div>

                <div className="card mt-4 flex items-start gap-3 rounded-2xl p-5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden />
                  <div>
                    <p className="text-body font-bold">{t('guaranteeTitle')}</p>
                    <p className="mt-2 text-body-sm leading-relaxed text-muted">{t('guaranteeText')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div id="soraglar" className="mt-12 grid scroll-mt-24 gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <Faq />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            {/* top-24: fixed header-iň aşagynda galar ýaly */}
            <div className="lg:sticky lg:top-24">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
