'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UNIVERSITIES, type UniversityEntry } from '@/lib/universities';
import { UniversityLogo } from './UniversityLogo';
import { UniversityDialog } from './UniversityDialog';
import { cn } from '@/lib/utils';

export function UniversityMarquee() {
  const t = useTranslations('universities');
  const [openUni, setOpenUni] = useState<UniversityEntry | null>(null);

  const items = t.raw('items') as Array<{ short: string; note: string }>;
  const notes = new Map(items.map((i) => [i.short, i.note]));

  // sanaw iki gezek: -50% süýşende aýlaw bildirmeýär

  return (
    <div className="relative">
      <div
        className=""
        style={{
          maskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
        }}
      >
        <MarqueeRow items={UNIVERSITIES} duration="80s" onPick={setOpenUni} />
      </div>

      <p className="mt-7 text-center text-body-sm text-muted">
        {t('marqueeNote')}
      </p>
      <p className="mt-1.5 text-center text-body-sm font-bold text-brand">
        {t('detail.hint')}
      </p>

      <UniversityDialog
        uni={openUni}
        note={openUni ? notes.get(openUni.short) : undefined}
        onClose={() => setOpenUni(null)}
      />
    </div>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse,
  onPick,
}: {
  items: UniversityEntry[];
  duration: string;
  reverse?: boolean;
  onPick: (uni: UniversityEntry) => void;
}) {
  return (
    <div className="flex overflow-hidden py-2">
      <div
        className="flex w-max [&>*]:mr-3.5 hover:[animation-play-state:paused]"
        style={{
          // shorthand + animationDirection garyşsa React duýduryş berýär
          animationName: 'marquee',
          animationDuration: duration,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map((u) => <Plate key={`a-${u.slug}`} uni={u} onPick={onPick} />)}
        {items.map((u) => <Plate key={`b-${u.slug}`} uni={u} onPick={onPick} duplicate />)}
      </div>
    </div>
  );
}

function Plate({
  uni,
  onPick,
  duplicate,
}: {
  uni: UniversityEntry;
  onPick: (uni: UniversityEntry) => void;
  duplicate?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(uni)}
      aria-hidden={duplicate}
      tabIndex={duplicate ? -1 : undefined}
      className={cn(
        'card card-hover group flex w-[16.5rem] shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left',
        // hyzmatdaşlar
        uni.partner && 'border-l-[3px] border-l-brand',
      )}
    >
      <UniversityLogo uni={uni} size={44} />

      <span className="min-w-0">
        <span className="block truncate font-display text-body-sm font-extrabold leading-tight tracking-tight">
          {uni.name}
        </span>
        <span className="mt-1 block text-micro font-semibold uppercase tracking-[0.1em] text-faint">
          {uni.city}
        </span>
      </span>
    </button>
  );
}
