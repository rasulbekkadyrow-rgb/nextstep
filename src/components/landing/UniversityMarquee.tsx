'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UNIVERSITIES, type UniversityEntry } from '@/lib/universities';
import { UniversityLogo } from './UniversityLogo';
import { UniversityDialog } from './UniversityDialog';
import { cn } from '@/lib/utils';

/**
 * UNIWERSITETLERIŇ LENTASY
 * ==================================================================
 * Iki hatar garşylyklaýyn ugurda haýal süýşýär (58 we 72 sekunt).
 *
 * NÄME ÜÇIN IKI HATAR WE GARŞYLYKLAÝYN?
 * Bir hatar lenta «banner» ýaly duýulýar. Iki hatar garşylyklaýyn
 * gidende göz olaryň arasyndaky tapawuda düşýär we hereket «material»
 * bolýar — bu Apple-yň interfeýslerinde ýygy ulanylýan usul.
 *
 * TIZLIK: 58–72 sekunt bir aýlaw. Ýeterlik haýal ki, ady okap
 * ýetişýärsiň. Çalt lenta mahabat bannerine meňzeýär we ynamy peseldýär.
 *
 * DURMAK: kursor lentanyň üstüne gelende ol saklanýar
 * (`animation-play-state: paused`) — gyzyklanan adam okap we basyp
 * bilýär.
 *
 * BASYLANDA: uniwersitetiň maglumat penjiresi açylýar. Şonuň üçin
 * her tagta indi `article` däl-de HAKYKY DÜWME — ýagny klawiatura
 * bilen hem elýeterli.
 *
 * ELÝETERLILIK: mazmun iki gezek gaýtalanýandygy üçin ikinji nusga
 * `aria-hidden` bilen gizlenýär we fokusdan çykarylýar — ekran
 * okaýjy we Tab düwmesi sanawy iki gezek geçmeýär.
 */
export function UniversityMarquee() {
  const t = useTranslations('universities');
  const [openUni, setOpenUni] = useState<UniversityEntry | null>(null);

  /* Redaksiýa ýazgylary diňe hyzmatdaş bäş uniwersitet üçin bar —
     gysgaltma boýunça baglanyşdyrylýar. */
  const items = t.raw('items') as Array<{ short: string; note: string }>;
  const notes = new Map(items.map((i) => [i.short, i.note]));

  /* Üznüksiz aýlaw üçin sanaw iki gezek gaýtalanýar: birinji nusga
     ekrandan çykanda ikinjisi tam onuň ýerini tutýar. */
  const half = Math.ceil(UNIVERSITIES.length / 2);
  const rowA = UNIVERSITIES.slice(0, half);
  const rowB = UNIVERSITIES.slice(half);

  return (
    <div className="relative">
      <div
        className="space-y-3.5"
        style={{
          /* Gyralarda ýumşak ýitiş — lenta kesilen ýaly görünmez ýaly */
          maskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
        }}
      >
        <MarqueeRow items={rowA} duration="58s" onPick={setOpenUni} />
        <MarqueeRow items={rowB} duration="72s" reverse onPick={setOpenUni} />
      </div>

      <p className="mt-6 text-center text-body-sm text-faint">
        {t('marqueeNote')}
      </p>
      <p className="mt-1.5 text-center text-body-sm font-medium text-brand">
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
          animation: `marquee ${duration} linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map((u) => <Plate key={`a-${u.slug}`} uni={u} onPick={onPick} />)}
        {items.map((u) => <Plate key={`b-${u.slug}`} uni={u} onPick={onPick} duplicate />)}
      </div>
    </div>
  );
}

/** Bir uniwersitetiň «logo tagtasy» — basylýan. */
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
      style={{ ['--rim' as string]: uni.partner ? 'var(--c-brand)' : 'var(--c-azure)' }}
      className={cn(
        /* `lg-press` ÝOK: ol hem `transform`-y eýeleýär we aşakdaky
           hover galmasy bilen bäsleşýär. */
        'lg-flat rim group flex w-[16.5rem] shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left',
        'transition-transform duration-500 ease-out-expo hover:-translate-y-1',
      )}
    >
      <UniversityLogo uni={uni} size={44} />

      <span className="min-w-0">
        <span className="block truncate font-display text-body-sm font-bold leading-tight tracking-tight">
          {uni.name}
        </span>
        <span className="mt-0.5 block text-micro uppercase tracking-[0.12em] text-faint">
          {uni.city}
        </span>
      </span>
    </button>
  );
}
