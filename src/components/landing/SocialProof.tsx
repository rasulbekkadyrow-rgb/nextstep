'use client';

import { useTranslations } from 'next-intl';
import { BadgeCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

interface Letter { student: string; uni: string; program: string; year: string; img?: string }

export function SocialProof({ images = {} }: { images?: Record<string, string> }) {
  const t = useTranslations('proof');
  const letters = t.raw('letters') as Letter[];

  // hat ýok bolsa bölüm görkezilmeýär
  if (!letters.length) return null;

  const row = [...letters, ...letters];

  return (
    <section id="netijeler" className="scroll-mt-24 overflow-hidden bg-surface py-14 md:py-20">
      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-4 text-h2">{t('title')}</h2>
            <p className="mt-3 max-w-[62ch] text-body-lg text-muted">{t('subtitle')}</p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <p className="container mb-4 mt-8 text-label font-extrabold uppercase tracking-[0.14em] text-muted">
          {t('lettersLabel')}
        </p>

        <div
          className="relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <MarqueeRow items={row} direction="left" images={images} />
        </div>
      </Reveal>
    </section>
  );
}

function MarqueeRow({ items, direction, images }: { items: Letter[]; direction: 'left' | 'right'; images: Record<string, string> }) {
  return (
    <div className="flex overflow-hidden py-4">
      {/* gap däl-de mr: -50% aýlawda bökmez ýaly */}
      <div
        className="flex w-max animate-marquee-slow [&>*]:mr-5 hover:[animation-play-state:paused]"
        style={direction === 'right' ? { animationDirection: 'reverse' } : undefined}
      >
        {items.map((letter, i) => (
          <LetterCard key={`${letter.student}-${i}`} letter={letter} src={letter.img ? images[letter.img] : undefined} />
        ))}
      </div>
    </div>
  );
}

function LetterCard({ letter, src }: { letter: Letter; src?: string }) {
  const t = useTranslations('proof.letterCard');

  return (
    <article
      className={cn(
        'card w-[14.5rem] shrink-0 rounded-2xl p-4',
      )}
    >
      {src && (
        <div className="mb-3 aspect-[3/4] overflow-hidden rounded-2xl border border-line/10 bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${letter.uni}: ${t('accepted')}`}
            loading="lazy"
            className="block h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-b border-line/10 pb-3.5">
        <span className="font-display text-body-sm font-extrabold tracking-tight">{letter.uni}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-ok/10 px-2.5 py-1 text-micro font-extrabold uppercase tracking-[0.06em] text-ok">
          <BadgeCheck className="h-3 w-3" aria-hidden />
          {t('accepted')}
        </span>
      </div>

      <dl className="mt-4 space-y-2.5">
        <div>
          <dt className="text-micro font-bold uppercase tracking-[0.12em] text-faint">
            {t('program')}
          </dt>
          <dd className="mt-1 text-body-sm font-bold leading-snug">{letter.program}</dd>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <dt className="sr-only">{t('year')}</dt>
            <dd className="tnum text-micro font-semibold text-faint">{letter.year}</dd>
          </div>
          <p className="text-body-sm font-semibold text-muted">{letter.student}</p>
        </div>
      </dl>
    </article>
  );
}
