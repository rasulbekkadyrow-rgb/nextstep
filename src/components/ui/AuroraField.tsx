'use client';

import { cn } from '@/lib/utils';

/** Admin giriş sahypasynyň fonundaky hereketli reňk tegelekleri. */
export function AuroraField({
  className,
  intensity = 'normal',
}: {
  className?: string;
  intensity?: 'soft' | 'normal' | 'strong';
}) {
  const alpha = { soft: 0.5, normal: 0.8, strong: 1 }[intensity];

  const blobs = [
    { c: 'var(--c-brand)', a: 0.30, w: '46%', h: '52%', top: '-12%', left: '4%',  anim: 'blob-a', dur: '30s', delay: '0s',   blur: 90 },
    { c: 'var(--c-azure)', a: 0.24, w: '40%', h: '44%', top: '6%',   left: '46%', anim: 'blob-b', dur: '38s', delay: '-6s',  blur: 96 },
    { c: 'var(--c-brand)', a: 0.18, w: '34%', h: '38%', top: '38%',  left: '22%', anim: 'blob-b', dur: '44s', delay: '-14s', blur: 84 },
    { c: 'var(--c-azure)', a: 0.16, w: '30%', h: '34%', top: '44%',  left: '62%', anim: 'blob-a', dur: '34s', delay: '-20s', blur: 78 },
    { c: 'var(--c-brand)', a: 0.13, w: '26%', h: '30%', top: '-6%',  left: '70%', anim: 'blob-a', dur: '26s', delay: '-9s',  blur: 70 },
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
