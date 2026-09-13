'use client';

import { useTranslations } from 'next-intl';
import { Check, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { AuroraField } from '@/components/ui/AuroraField';
import { Faq } from './Faq';
import { LeadForm } from './LeadForm';

/**
 * JEMLEÝJI BÖLÜM — TEKLIP, SORAGLAR WE FORMA
 * ------------------------------------------------------------------
 * Bu üç element bilelikde «töwekgelçiligi ýapmak» wezipesini ýerine
 * ýetirýär:
 *  1. TEKLIP — ilkinji ädimiň tölegsizdigi görkezilýär (girişiň bahasy = 0).
 *  2. KEPILLIK — «eger peýdasyz bolsa, borçlulyk ýok» diýen ynandyryş.
 *  3. FAQ — galan şübheler ýeke-ýekeden aýrylýar.
 *  4. FORMA — şübhe ýok wagty, göni gapdalynda hereket etmäge mümkinçilik.
 *
 * Ýerleşiş kararyny esaslandyrmak: FAQ we forma bir hatarda goýuldy.
 * Ulanyjy soraga jogap tapan badyna, formany gözlemek üçin skroll
 * etmeli bolmaýar — el astynda durýar.
 */
export function FinalCta() {
  const t = useTranslations('offer');
  const includes = t.raw('includes') as string[];

  return (
    <section id="teklip" className="relative isolate scroll-mt-24 overflow-hidden py-24 md:py-32">
      <AuroraField intensity="soft" className="absolute inset-x-[-8%] -bottom-[20%] -z-10 h-[46rem]" />

      <div className="container">
        {/* ======================= TEKLIP ======================= */}
        <Reveal>
          <div className="paper overflow-hidden rounded-4xl">
            <div className="grid lg:grid-cols-12">
              {/* Çep: teklibiň mazmuny */}
              <div className="p-8 md:p-12 lg:col-span-7">
                <p className="eyebrow">{t('eyebrow')}</p>
                <h2 className="mt-5 text-h2">{t('title')}</h2>
                <p className="mt-5 max-w-[52ch] text-body-lg text-muted">{t('subtitle')}</p>

                <p className="mt-10 text-micro font-semibold uppercase tracking-[0.14em] text-muted">
                  {t('includesLabel')}
                </p>
                <ul className="mt-4 space-y-3">
                  {includes.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-body text-muted">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sag: baha we kepillik */}
              <div className="border-t border-line/10 bg-base/50 p-8 md:p-12 lg:col-span-5 lg:border-l lg:border-t-0">
                <div className="rounded-3xl border border-brand/20 bg-brand/[0.06] p-6">
                  <p className="text-micro font-semibold uppercase tracking-[0.14em] text-brand">
                    {t('priceLabel')}
                  </p>
                  <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
                    {t('priceValue')}
                  </p>
                  <p className="mt-3 text-body-sm leading-relaxed text-muted">{t('priceNote')}</p>
                </div>

                <div className="mt-6 flex items-start gap-3.5 rounded-3xl border border-line/10 p-6">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden />
                  <div>
                    <p className="text-body font-semibold">{t('guaranteeTitle')}</p>
                    <p className="mt-2 text-body-sm leading-relaxed text-muted">{t('guaranteeText')}</p>
                  </div>
                </div>

                {/* Çäklilik görkezijisi — howlukmagy däl-de, hakyky kuwwaty aňladýar */}
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-line/10 bg-surface/50 px-5 py-4">
                  <span className="text-body-sm text-muted">{t('slotsLeft')}</span>
                  <span className="tnum font-display text-h4 font-extrabold text-brand">
                    {t('slotsValue')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ================= FAQ + FORMA ================= */}
        <div id="soraglar" className="mt-20 grid scroll-mt-24 gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <Faq />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            {/* Forma skroll edilende ýanaşyk saklanýar — hemişe el astynda */}
            <div className="lg:sticky lg:top-24">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
