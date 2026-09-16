import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { UniversityMarquee } from './UniversityMarquee';

export function Universities() {
  const t = useTranslations('universities');

  return (
    <section id="uniwersitetler" className="scroll-mt-24 py-14 md:py-20">
      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-4 text-h2">{t('title')}</h2>
            <p className="mt-3 max-w-[58ch] text-body-lg text-muted">{t('subtitle')}</p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-body-sm font-semibold text-brand">
              <MapPin className="h-4 w-4" aria-hidden />
              <span className="sr-only">{t('cityLabel')}: </span>
              {t('city')}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8">
            <UniversityMarquee />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
