'use client';

import { useState } from 'react';
import { logoPath, type UniversityEntry } from '@/lib/universities';
import { cn } from '@/lib/utils';

/** Logo faýly ýok bolsa monogram görkezilýär. */
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
        /* padding % bilen däl: % ata elementiň ininden hasaplanýar */
        style={{ width: size, height: size, padding: Math.round(size * 0.13) }}
        className={cn(
          'shrink-0 rounded-full bg-white object-contain',
          'shadow-[0_1px_3px_rgb(var(--c-ink)/0.10),0_0_0_1px_rgb(var(--c-ink)/0.07)]',
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
        'grid shrink-0 place-items-center rounded-full font-display font-extrabold tracking-[0.04em]',
        'transition-colors duration-400',
        uni.partner
          ? 'bg-brand-soft text-brand'
          : 'bg-surface text-muted group-hover:bg-brand-soft group-hover:text-brand',
        className,
      )}
    >
      {uni.short}
    </span>
  );
}
