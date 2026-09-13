'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * SKROLL ILERLEMESI
 * Sahypanyň ýokarsyndaky inçe çyzyk. Ulanyja näçe okandygyny görkezýär
 * we uzyn sahypada «soňy görünmeýär» duýgusyny aýyrýar.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand via-brand to-ok"
    />
  );
}
