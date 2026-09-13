'use client';

import { useState } from 'react';
import { logoPath, type UniversityEntry } from '@/lib/universities';
import { cn } from '@/lib/utils';

/**
 * UNIWERSITETIŇ NYŞANY
 * ==================================================================
 * Hakyky logo bar bolsa — ol; ýok bolsa — monogram (BAU, IGU…).
 *
 * NÄME ÜÇIN `next/image` DÄL-DE ADATY `img`?
 * Logolar `public/universities/` papkasyna SOŇ goşulýar. `next/image`
 * faýl ýok bolanda optimizasiýa serwerinde ýalňyşlyk berýär we
 * konsoly dolduryar. Adaty `img` bolsa `onError` arkaly sessiz-üýnsüz
 * monograma geçýär — ýagny faýl goşulmadyk uniwersitet hem dogry
 * görünýär, faýl goşulan badyna bolsa logo öz-özünden peýda bolýar.
 * Logolar ownuk (256px, aç-açan fonly) we sany 14 — optimizasiýa
 * gerek däl.
 *
 * NÄME ÜÇIN AK TEGELEK TAGTA?
 * Uniwersitetleriň logotipleri gara-gök, goýy gyzyl, ýaşyl — olaryň
 * köpüsi GARAŇKY. Garaňky temada olar fon bilen garyşyp ýitýärdi.
 * Ak tegelek olaryň hemmesine bir hili, tertipli gap berýär we iki
 * temada-da deň işleýär — hakyky nyşan tagtalarynda edilişi ýaly.
 */
export function UniversityLogo({
  uni,
  size = 44,
  className,
}: {
  uni: UniversityEntry;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={logoPath(uni.slug)}
        alt={uni.name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        /* ⚠️ Jaý PROSENTDE berilmeýär. CSS-de prosent padding elementiň
           öz inine däl-de DAŞKY GABYŇ inine görä hasaplanýar: 44px-lik
           nyşanda `p-[9%]` 232px-lik tagtadan 21px alyp, logo üçin
           bary-ýogy 2px galdyrýardy — tegelekler boş görünýärdi. */
        style={{ width: size, height: size, padding: Math.round(size * 0.13) }}
        className={cn(
          'shrink-0 rounded-full bg-white object-contain',
          'shadow-[0_1px_2px_rgb(var(--c-ink)/0.10),0_0_0_1px_rgb(var(--c-ink)/0.06)]',
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.24) }}
      className={cn(
        'grid shrink-0 place-items-center rounded-full border font-display font-extrabold tracking-[0.04em]',
        'transition-colors duration-500',
        uni.partner
          ? 'border-brand/25 bg-brand/[0.08] text-brand'
          : 'border-line/12 bg-base/40 text-muted group-hover:border-brand/25 group-hover:text-brand',
        className,
      )}
    >
      {uni.short}
    </span>
  );
}
