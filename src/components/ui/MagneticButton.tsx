'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'outline';

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

/**
 * MAGNIT DÜWME (Magnetic Button)
 * ------------------------------------------------------------------
 * Mikro-özara täsir (micro-interaction) düzümi:
 *  1. Kursor golaýlanda düwme oňa tarap ýeňiljek süýşýär (magnit effekti).
 *  2. Içinde ýagtylyk tolkuny (shine) çepden saga geçýär.
 *  3. Basylanda kiçelýär — fiziki düwme duýgusy.
 *  4. Nyşan (icon) hereketiň dowamynda öňe süýşýär.
 *
 * Elýeterlilik: hereketi azaltmak islegi saýlanan bolsa, magnit
 * effekti doly öçürilýär, ýöne fokus halkasy hemişe saklanýar.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  icon,
  className,
  type = 'button',
  disabled,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    /* 0.25 — ymtylmagyň güýji. Ondan ýokary bolsa «gaty köp» görünýär. */
    setOffset({ x: x * 0.25, y: y * 0.32 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const styles: Record<Variant, string> = {
    /* Esasy CTA markanyň gradientini göterýär — logo bilen bir dilde */
    primary:
      'brand-gradient text-brand-ink shadow-brand hover:brightness-110 border border-transparent',
    ghost:
      'bg-surface/60 text-ink border border-line/12 backdrop-blur-md hover:border-brand/40 hover:bg-surface',
    outline:
      'bg-transparent text-ink border border-line/20 hover:border-brand hover:text-brand',
  };

  const inner = (
    <>
      {/* Ýagtylyk tolkuny — diňe hover ýagdaýynda işleýär */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full"
      />
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="relative z-10 transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  const classes = cn(
    'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5',
    'text-body-sm font-semibold tracking-tight',
    'transition-[background,border-color,filter,box-shadow] duration-300 ease-out-expo',
    'active:scale-[0.97]',
    disabled && 'pointer-events-none opacity-50',
    styles[variant],
    className,
  );

  const motionProps = {
    animate: { x: offset.x, y: offset.y },
    transition: { type: 'spring' as const, stiffness: 220, damping: 18, mass: 0.55 },
    onMouseMove: handleMove,
    onMouseLeave: reset,
  };

  if (href) {
    return (
      <motion.span {...motionProps} className="inline-block" ref={ref as React.Ref<HTMLSpanElement>}>
        <Link href={href} className={classes}>
          {inner}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      {...motionProps}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}
