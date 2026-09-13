'use client';

import { cn } from '@/lib/utils';

/**
 * AURORA FIELD — fonuň benewşe blur animasiýasy
 * ==================================================================
 * Bäş sany uly bulaşyk şekil haýal aýlanýar, süýşýär we görnüşini
 * üýtgedýär. Olar markanyň iki reňkinden ybarat: benewşe (#8400FC)
 * we gök (#0CA8F0).
 *
 * NÄME ÜÇIN BU GEREK?
 * Liquid Glass materialynyň özi görünmeýär — ol diňe AŞAGYNDAKY
 * zady görkezýär. Eger fon tegiz ak bolsa, aýna hem tegiz ak bolýar
 * we effekt ýitýär. Şonuň üçin fonda hemişe hereket edýän reňk
 * bolmaly: şonda aýnanyň içindäki şekil hem üýtgäp durýar.
 *
 * ÖNDÜRIJILIK
 * · Diňe `transform` we `border-radius` animasiýa edilýär → GPU.
 * · `will-change` bilen gatlak öňünden taýýarlanýar.
 * · Aýlawlar 26–44 sekunt — haýal, üns çekmeýär, ýöne janly.
 * · `prefers-reduced-motion` saýlananda animasiýa doly saklanýar
 *   (globals.css-däki umumy düzgün arkaly), şekiller görnüp galýar.
 */
export function AuroraField({
  className,
  intensity = 'normal',
}: {
  className?: string;
  /** `strong` — hero üçin, `soft` — bölümleriň arasyndaky geçişler üçin */
  intensity?: 'soft' | 'normal' | 'strong';
}) {
  const alpha = { soft: 0.5, normal: 0.8, strong: 1 }[intensity];

  /* Her şekil: reňk, ölçeg, ýerleşiş, animasiýa we onuň tizligi */
  const blobs = [
    { c: 'var(--c-brand)',  a: 0.42, w: '46%', h: '52%', top: '-12%', left: '4%',   anim: 'blob-a', dur: '30s', delay: '0s',    blur: 90 },
    { c: 'var(--c-azure)',  a: 0.34, w: '40%', h: '44%', top: '6%',   left: '46%',  anim: 'blob-b', dur: '38s', delay: '-6s',   blur: 96 },
    { c: 'var(--c-brand)',  a: 0.26, w: '34%', h: '38%', top: '38%',  left: '22%',  anim: 'blob-b', dur: '44s', delay: '-14s',  blur: 84 },
    { c: 'var(--c-azure)',  a: 0.22, w: '30%', h: '34%', top: '44%',  left: '62%',  anim: 'blob-a', dur: '34s', delay: '-20s',  blur: 78 },
    { c: 'var(--c-brand)',  a: 0.18, w: '26%', h: '30%', top: '-6%',  left: '70%',  anim: 'blob-a', dur: '26s', delay: '-9s',   blur: 70 },
  ];

  return (
    <div aria-hidden className={cn('pointer-events-none overflow-hidden', className)}>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="blob"
          style={{
            width: b.w,
            height: b.h,
            top: b.top,
            left: b.left,
            background: `radial-gradient(closest-side, rgb(${b.c} / ${b.a * alpha}), transparent 78%)`,
            filter: `blur(${b.blur}px)`,
            animation: `${b.anim} ${b.dur} ease-in-out ${b.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * DÖWÜLME SÜZGÜJI (refraction filter)
 * ------------------------------------------------------------------
 * Hakyky aýna ýagtylygy döwýär. Bu SVG süzgüji tolkun görnüşli
 * şowhun (turbulence) döredýär we şoňa görä arkadaky şekili
 * süýşürýär — netijede aýnanyň gyrasynda ýeňil «suwuk» ýoýulma
 * peýda bolýar.
 *
 * Sahypada BIR gezek ýerleşdirilmeli (layout-da), soňra islendik
 * element `.lg-refract` synpy arkaly ondan peýdalanýar.
 *
 * Goldaw: `backdrop-filter: url()` häzirlikçe diňe Chromium esasly
 * brauzerlerde işleýär. Beýlekilerde CSS `@supports` blogy taşlanýar
 * we adaty aýna görnüşi galýar — sahypa hiç zat ýitirmeýär.
 */
export function LiquidRefractionFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0" focusable="false">
      <filter id="liquid-refract" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.006 0.011"
          numOctaves={2}
          seed={7}
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2.4" result="soft" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="soft"
          scale="14"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
