import { cn } from '@/lib/utils';

/**
 * NEXT STEP — LOGO
 * ==================================================================
 * Nyşan markanyň Instagram profilindäki hakyky logosyndan yzarlanyp
 * (trace) wektora geçirildi. Asyl surat 150×150 piksel — saýt üçin
 * ýeterlik däl, şonuň üçin geometriýasy ölçenip SVG-de gaýtadan
 * guruldy.
 *
 * ÖLÇENEN GEOMETRIÝA (asyl nusgada, 40×45 piksel):
 *   · Iki şekil, biri-birine 180° simmetrik
 *   · Ýokarky-çep — benewşe, uly tegelek burç (radius ≈ 10)
 *   · Aşaky-sag  — gök, şol bir radiusly burç
 *   · Aralarynda 3 piksellik ak jaý: dik (x 7–9) we 45° diagonal
 *   · Netijede negatiw giňişlikde «N» harpy okalýar
 *
 * NÄME ÜÇIN SVG, SURAT DÄL?
 *   1. Instagram CDN salgylarynyň möhleti gutarýar (`oe=` parametri) —
 *      olary saýtda ulanmak bolmaýar.
 *   2. 150×150 raster logo Retina ekranda bulaşyk çykýar.
 *   3. SVG islendik ölçegde arassa, göwrümi ~0,6 KB.
 *   4. Reňkleri tema boýunça sazlap bolýar.
 *
 * REŇKLER: asyl logoda iki DÜZ reňk (gradient däl) — #8400FC we
 * #0CA8F0. Garaňky temada olar biraz ýagtylandyrylýar, ýogsam çuň
 * benewşe garaňky fonda ýitýär.
 *
 * ⚠️ Müşderide logonyň asyl wektor faýly (SVG/AI/PDF) bar bolsa,
 * ol şu komponentiň ýerine goýulmalydyr — yzarlama diňe wagtlaýyn
 * çözgüt.
 */

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 45"
      className={cn('block h-auto', className)}
      role="img"
      aria-label="Next Step Consulting"
      style={{
        // Asyl brend reňkleri; garaňky temada aşakda ýagtylandyrylýar
        ['--logo-violet' as string]: 'var(--c-logo-violet, #8400FC)',
        ['--logo-azure' as string]: 'var(--c-logo-azure, #0CA8F0)',
      }}
    >
      {/* Ýokarky-çep şekil — benewşe */}
      <path
        fill="var(--logo-violet)"
        d="M0 38 V10 A10 10 0 0 1 10 0 H27 A2 2 0 0 1 29 2 V29.5 L10.5 11 Q7 11 7 14.5 V38 Z"
      />
      {/* Aşaky-sag şekil — gök (ýokarkynyň 180° öwrülmesi) */}
      <path
        fill="var(--logo-azure)"
        d="M40 7 V35 A10 10 0 0 1 30 45 H13 A2 2 0 0 1 11 43 V15.5 L29.5 34 Q33 34 33 30.5 V7 Z"
      />
    </svg>
  );
}

/**
 * Doly logo: nyşan + ýazgy.
 *
 * Ýazgy surat däl-de HAKYKY TEKST — şonuň üçin ol gözleg ulgamlary
 * tarapyndan okalýar, ekran okaýjylar üçin elýeterli we islendik
 * ölçegde arassa galýar.
 */
export function Logo({
  size = 'md',
  showWordmark = true,
  className,
}: {
  /** `xl` — diňe Hero üçin: markanyň sahypadaky esasy görkezilişi */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}) {
  const markSize = { sm: 'w-6', md: 'w-7', lg: 'w-9', xl: 'w-12 sm:w-16' }[size];
  const nameSize = { sm: 'text-body-sm', md: 'text-body', lg: 'text-h4', xl: 'text-h3' }[size];
  const subSize = { sm: 'text-[0.5rem]', md: 'text-micro', lg: 'text-label', xl: 'text-body-sm' }[size];
  /* Nyşan ulaldygyça ýanyndaky jaý hem ulalmaly — ýogsam gulp gysyk görünýär */
  const gap = { sm: 'gap-2', md: 'gap-2.5', lg: 'gap-3', xl: 'gap-4 sm:gap-5' }[size];

  return (
    <span className={cn('inline-flex items-center', gap, className)}>
      <LogoMark className={markSize} />

      {showWordmark && (
        <span className="font-display font-extrabold leading-none tracking-tight">
          <span className={nameSize}>Next Step</span>
          <span
            className={cn(
              'block font-semibold uppercase leading-none tracking-[0.22em] text-faint',
              size === 'xl' ? 'mt-2' : 'mt-0.5',
              subSize,
            )}
          >
            Consulting
          </span>
        </span>
      )}
    </span>
  );
}
