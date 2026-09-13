'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * LIQUID GLASS — material gaby
 * ==================================================================
 * CSS-iň `.lg` synpyna interaktiwlik goşýar: kursoryň ýerleşişini
 * yzarlap, spekulýaryň (ýalpyldynyň) merkezini süýşürýär.
 *
 * Hakyky aýnada ýalpyldy ýagtylygyň çeşmesine bagly. Ekranda
 * «ýagtylyk çeşmesi» — kursoryň özi. Şonuň üçin ol golaýlanda
 * ýalpyldy oňa tarap süýşýär, uzaklaşanda ýitýär.
 *
 * Öndürijilik: `setProperty` göni DOM-a ýazýar (React state däl) —
 * her piksel hereketde komponent gaýtadan çyzylmaýar.
 */
export function LiquidGlass<T extends ElementType = 'div'>({
  as,
  children,
  className,
  refract = false,
  press = true,
  ...rest
}: {
  as?: T;
  children?: ReactNode;
  className?: string;
  /** Hakyky döwülme süzgüji (diňe Chromium-da işleýär) */
  refract?: boolean;
  /** Basylanda «gysylma» effekti */
  press?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      className={cn('lg', refract && 'lg-refract', press && 'lg-press', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
