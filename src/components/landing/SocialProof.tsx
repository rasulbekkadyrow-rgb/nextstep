'use client';

import { useTranslations } from 'next-intl';
import { BadgeCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

interface Letter { student: string; uni: string; program: string; year: string; img?: string }

/**
 * SOSIAL SUBUTNAMA BÖLÜMI
 * ==================================================================
 * Bu işde iň güýçli subutnama — KABUL HATY. Ol hyzmatyň netijesiniň
 * özi: görüp bolýan, sanap bolýan, ýasap bolmaýan zat.
 *
 * DIZAÝN KARARY — üznüksiz lenta (marquee).
 * Hatlar iki hatarda, garşylyklaýyn ugurda haýal süýşýär. Näme üçin?
 *
 *  1. SAN DUÝGUSY. Statik tor 6 kartany görkezýär. Lenta bolsa
 *     «bularyň soňy ýok» diýen duýgyny berýär — hakyky sanyny
 *     aýtman, köplügi aňladýar.
 *  2. WAGT TYGŞYTLYLYGY. Sahypada az ýer tutýar, ýöne köp görkezýär.
 *  3. Hereket haýal (42–96 sek): okamaga ýetişýärsiň, ünsüňi
 *     dartmaýar. Çalt lenta mahabat bannerine meňzeýär.
 *
 * Kursor üstüne gelende lenta saklanýar (`animation-play-state`) —
 * ulanyjy haýsydyr bir haty okamak islese, ol gaçyp gitmeýär.
 *
 * ⚠️ DIŇE HAKYKY MAGLUMAT
 * Bu bölümde görkezme (demo) ýazgy ýok. Hatlaryň sanawy boş bolsa
 * bölüm asla görkezilmeýär — ýasama subutnama goýmakdan hiç zat
 * goýmazlyk gowudyr.
 *
 * Hakyky hat goşulanda: talybyň ÝAZMAÇA razylygy alynmalydyr, şahsy
 * maglumatlar (doly at, pasport belgisi, e-poçta) şekilde
 * bulaşdyrylmalydyr (blur).
 *
 * Talyplaryň pikirleri (teswirler) bölümi düýbünden aýryldy.
 */
export function SocialProof({ images = {} }: { images?: Record<string, string> }) {
  const t = useTranslations('proof');
  const letters = t.raw('letters') as Letter[];

  /* HATLAR ÝOK BOLSA — BÖLÜM ASLA ÇYKMAÝAR.
     Öň bu ýerde görkezme (demo) hatlar durdy. Ýasama subutnama
     hakyky subutnamadan erbet: müşderi barlap bilýär we ynam bir
     gezekde ýykylýar. Şonuň üçin sanaw boş wagty bölüm gizlenýär —
     hakyky hatlar `messages/*.json` faýlyna goşulan badyna ol
     öz-özünden yzyna gelýär. */
  if (!letters.length) return null;

  /* Iki hatar: birinjisi çepe, ikinjisi saga süýşýär */
  const rowA = [...letters, ...letters];
  const rowB = [...letters.slice().reverse(), ...letters.slice().reverse()];

  return (
    <section id="netijeler" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface/50" />

      <div className="container">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 text-h2">{t('title')}</h2>
            <p className="mt-5 max-w-[62ch] text-body-lg text-muted">{t('subtitle')}</p>
          </div>
        </Reveal>
      </div>

      {/* ================= KABUL HATLARYNYŇ LENTASY ================= */}
      <Reveal delay={0.08}>
        <p className="container eyebrow mb-6 mt-14">{t('lettersLabel')}</p>

        <div
          className="relative space-y-4"
          style={{
            maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <MarqueeRow items={rowA} direction="left" images={images} />
          <MarqueeRow items={rowB} direction="right" images={images} />
        </div>
      </Reveal>
    </section>
  );
}

function MarqueeRow({ items, direction, images }: { items: Letter[]; direction: 'left' | 'right'; images: Record<string, string> }) {
  return (
    <div className="flex overflow-hidden py-4">
      {/* ⚠️ `gap` DÄL, her kartada sag jaý.
          `gap` diňe kartalaryň ARASYNA goýulýar — soňkusyndan soň
          goýulmaýar. Şonda zolagyň ini 2N·(karta+jaý) däl-de ondan
          ýarym jaý kem bolýar, `translateX(-50%)` bolsa tam ýaryma
          düşmeýär: aýlawyň sepgidinde 10 piksel bökme galýar.
          Her kartada sag jaý bolanda iki ýarym takyk deň. */}
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

/**
 * Kabul hatynyň kiçeldilen kartasy.
 * Hakyky hatyň şekili goşulanda, bu karta onuň gaby bolup galýar —
 * şonuň üçin ölçegi we gurluşy A4 nisbetine ýakyn saklanýar.
 */
function LetterCard({ letter, src }: { letter: Letter; src?: string }) {
  const t = useTranslations('proof.letterCard');

  return (
    <article
      className={cn(
        'w-[19.5rem] shrink-0 rounded-3xl border border-line/12 bg-surface p-6 shadow-soft',
        /* Ýeke-täk özara täsir: kursor degende karta ýokary galýar.
           Hereketiň özi CSS lentasynda — JS hiç zat hasaplamaýar. */
        'transition-[transform,box-shadow] duration-500 ease-out-expo',
        'hover:-translate-y-1.5 hover:shadow-lift',
      )}
    >
      {/* HATYŇ ÖZI — bar bolsa kartanyň esasy ýüzi.
          Ýazgy şonda diňe düşündiriş bolup galýar: adam ilki hatyň
          şekilini görýär, soň kimiňkidigini okaýar. */}
      {src && (
        <div className="mb-5 aspect-[3/4] overflow-hidden rounded-2xl border border-line/10 bg-base">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${letter.uni} — ${t('accepted')}`}
            loading="lazy"
            className="block h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-b border-line/10 pb-3">
        <span className="font-display text-body-sm font-extrabold tracking-tight">{letter.uni}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-ok/30 bg-ok/[0.08] px-2 py-0.5 text-micro font-bold text-ok">
          <BadgeCheck className="h-3 w-3" aria-hidden />
          {t('accepted')}
        </span>
      </div>

      <dl className="mt-4 space-y-2.5">
        <div>
          <dt className="font-mono text-micro uppercase tracking-[0.12em] text-faint">
            {t('program')}
          </dt>
          <dd className="mt-0.5 text-body-sm font-semibold leading-snug">{letter.program}</dd>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <dt className="sr-only">{t('year')}</dt>
            <dd className="tnum font-mono text-micro text-muted">{letter.year}</dd>
          </div>
          <p className="text-body-sm font-medium text-muted">{letter.student}</p>
        </div>
      </dl>
    </article>
  );
}
