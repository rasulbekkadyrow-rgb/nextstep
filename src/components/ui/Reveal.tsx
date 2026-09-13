'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * REVEAL — bölümleriň skrollda peýda bolmagy
 * ------------------------------------------------------------------
 * Ýeke-täk animasiýa düzgüni: 18px aşakdan, ýeňil blur bilen.
 * Ähli sahypada şu bir düzgün ulanylýar — şonuň üçin hereket
 * «bulaşyk» däl-de, tertipli we premium duýulýar.
 *
 * `once: true` — animasiýa diňe bir gezek işleýär. Ýokary-aşak
 * skroll edilende gaýtalanmagy ulanyjyny biynjalyk edýär.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -8% 0px' });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
