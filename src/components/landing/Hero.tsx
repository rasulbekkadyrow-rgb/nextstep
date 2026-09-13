'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { AuroraField } from '@/components/ui/AuroraField';
import { LogoMark } from '@/components/shared/Logo';
import { ContactLinks } from '@/components/shared/ContactLinks';

/**
 * HERO BÖLÜMI
 * ==================================================================
 * Maksat: ulanyja ilkinji 3 sekuntda «Men dogry ýere geldim, bu maňa
 * netije berer» diýen duýgyny bermek.
 *
 * IKI SÜTÜN, IKI WEZIPE:
 *  · ÇEP  — marka: uly nyşan we markanyň öz şygary.
 *  · SAG  — söz: sözbaşy, düşündiriş, düwmeler we habarlaşyk.
 *
 * Öň sagda «kabul haty» kartoçkasy durdy — gowy pikirdi, emma
 * sahypanyň ilkinji ekranynda marka bilen bäsleşýärdi we özi hem
 * ýasama maglumatdan (mysal talybyň ady, uniwersiteti) ybaratdy.
 * Indi şol ýer markanyň özüne berildi: nyşan doly ölçeginde, şygar
 * bolsa okalýan uly ýazgyda.
 */
export function Hero() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '16%']);

  return (
    <section ref={sectionRef} className="relative isolate grain overflow-hidden pt-32 pb-20 md:pt-36 md:pb-28">
      {/* ---- Fon: ýyly kagyz şöhlesi ---- */}
      <AuroraField intensity="strong" className="absolute inset-x-[-10%] -top-[28%] -z-10 h-[58rem]" />

      {/* Ýuka tor — resminama kagyzynyň çyzyklary ýaly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--c-line)/0.055) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--c-line)/0.055) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 76% 58% at 42% 16%, #000 26%, transparent 74%)',
          WebkitMaskImage: 'radial-gradient(ellipse 76% 58% at 42% 16%, #000 26%, transparent 74%)',
        }}
      />

      <motion.div style={{ y: contentY }} className="container">
        {/* `items-start` — `items-center` däl: çep sütün sagdakydan
            uzyn, merkezleşdirilende panel ekranyň aşagyna süýşýärdi.
            Indi ikisi hem ýokardan başlaýar. */}
        <div className="grid-12 items-start gap-y-14">
          {/* ================= ÇEP: MARKANYŇ PANELI =================
               ⚠️ Telefonda sütünler üstün-üstüne düzülýär. Şonda panel
               birinji gelse, sözbaşy we «Mugt maslahat al» düwmesi
               ~500 piksel aşak gaçýardy. Şonuň üçin kiçi ekranda
               tertip tersine: ilki söz, soň marka. Kompýuterde bolsa
               panel çepde durýar. */}
          <div className="order-2 col-span-4 md:col-span-8 lg:order-1 lg:col-span-6">
            <BrandPanel />
          </div>

          {/* ================= SAG: ÝAZGY ================= */}
          <div className="order-1 col-span-4 md:col-span-8 lg:order-2 lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg mb-6 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
              <span className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                {t('badge')}
              </span>
            </motion.div>

            <h1 className="text-h1 max-w-[15ch]">
              {[
                { text: t('titleLead'), accent: false },
                { text: t('titleAccent'), accent: true },
                { text: t('titleTail'), accent: false },
              ].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24, filter: 'blur(7px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.11, ease: [0.16, 1, 0.3, 1] }}
                  className={
                    word.accent
                      ? 'brand-gradient-text mr-[0.26em] inline-block'
                      : 'mr-[0.26em] inline-block'
                  }
                >
                  {word.text}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="mt-7 max-w-[50ch] text-body-lg text-muted"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.56 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <MagneticButton href="#arza" variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                {t('ctaPrimary')}
              </MagneticButton>
              <MagneticButton href="#uniwersitetler" variant="ghost" icon={<GraduationCap className="h-4 w-4" />}>
                {t('ctaSecondary')}
              </MagneticButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-body-sm text-faint"
            >
              {t('ctaHint')}
            </motion.p>

            {/* ---- Göni habarlaşyk kanallary ----
                 Forma çenli aşak inmek islemeýän ulanyjy üçin: Instagram,
                 iki WhatsApp belgisi we e-poçta bir hatarda. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.66 }}
              className="mt-7"
            >
              <ContactLinks />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * MARKANYŇ PANELI
 * ------------------------------------------------------------------
 * Merkezleşdirilen dik gulp: nyşan ýokarda, ady aşagynda, soňra şygar.
 * Näme üçin dik? Sebäbi bu ýerde logo BELLIK däl-de SURAT wezipesini
 * ýerine ýetirýär — dik düzülende ol paneli doldurýar we sözbaşy bilen
 * deňagramlylyk berýär.
 *
 * Kursor golaýlanda panel 3D öwrülýär — aýnanyň fiziki galyňlygy şonda
 * duýulýar. Hereketi azaltmak islegi saýlanan bolsa öwrülme öçürilýär.
 *
 * Aşakdaky şöhle diňe bezeg däl: ak fonda Liquid Glass-yň görünmegi
 * üçin onuň AŞAGYNDA reňk bolmaly.
 */
function BrandPanel() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
    ref.current.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1300px' }}
      className="relative mx-auto w-full max-w-lg lg:ml-0 lg:mr-auto"
    >
      {/* Markanyň öz şöhlesi — aýnanyň aşagyndaky reňk */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 blur-3xl"
        style={{
          background:
            'radial-gradient(58% 52% at 50% 42%, rgb(var(--c-brand) / 0.32), rgb(var(--c-azure) / 0.20) 54%, transparent 76%)',
        }}
      />

      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="lg lg-refract relative flex flex-col items-center rounded-4xl px-8 py-14 text-center transition-transform duration-500 ease-out-expo sm:px-12 sm:py-16"
        style={{
          transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <LogoMark className="w-28 sm:w-36" />
        </motion.div>

        <p className="mt-9 font-display font-extrabold leading-none tracking-tight">
          <span className="block text-h2">Next Step</span>
          <span className="mt-3.5 block text-body-sm font-semibold uppercase tracking-[0.34em] text-faint">
            Consulting
          </span>
        </p>

        <div aria-hidden className="my-9 h-px w-16 bg-line/[0.18]" />

        <p className="text-balance font-display text-h4 font-bold leading-snug tracking-tight sm:text-h3">
          {t('slogan')}
        </p>
      </div>
    </motion.div>
  );
}
