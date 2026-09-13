'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { AuroraField } from '@/components/ui/AuroraField';
import { LogoMark } from '@/components/shared/Logo';
import { ContactLinks } from '@/components/shared/ContactLinks';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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

  /* Paralaks diňe uly ekranda: telefonda sütünler üstün-üstüne
     düzülýär we iň aşakdaky element — habarlaşyk nyşanlary — bolýar. */
  const wideScreen = useMediaQuery('(min-width: 1024px)');

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  /**
   * PARALAKS SÜÝŞMESI — PIKSELDE, GÖTERIMDE DÄL.
   *
   * ⚠️ BU ÝERDE NÄSAZLYK BARDY. Öň süýşme `16%` idi, ýagny mazmunyň
   * ÖZ BEÝIKLIGINIŇ göterimi. Bölümde bolsa `overflow-hidden` bar
   * (ol fondaky şöhläniň gyradan çykmagyny kesýär). Telefonda mazmun
   * ~1100px beýiklikde bolýar → 16% ≈ 176px, aşaky jaý bolsa 80px.
   * Netijede skroll edeniňde iň aşaky element bölümiň gyrasyndan
   * çykyp, KESILÝÄRDI — habarlaşyk nyşanlary ýitýärdi.
   *
   * Indi iki gorag bar:
   *  1. Süýşme anyk pikselde — mazmunyň uzynlygyna bagly däl.
   *  2. Ol aşaky jaýdan (md:pb-28 = 112px) KIÇI saýlanyldy, ýagny
   *     mazmun kesilýän gyra matematiki taýdan hiç haçan ýetmeýär.
   */
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0px', reduceMotion || !wideScreen ? '0px' : '64px'],
  );

  /* Telefonda ýokarky jaý gysgaldyldy (pt-24). Marka paneli indi
     birinji gelýändigi üçin her piksel möhüm: maksat — «Mugt
     maslahat al» düwmesiniň ilkinji ekranda galmagy. */
  return (
    <section ref={sectionRef} className="relative isolate grain overflow-hidden pt-24 pb-20 sm:pt-32 md:pt-36 md:pb-28">
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
        <div className="grid-12 items-start gap-y-10 sm:gap-y-14">
          {/* ================= ÇEP: MARKANYŇ PANELI =================
               Telefonda hem BIRINJI gelýär: sahypa açylanda ilki
               marka görünmeli.

               ⚠️ Öň ol ikinji durýardy — sebäbi doly ölçegli panel
               sözbaşyny we «Mugt maslahat al» düwmesini ~500 piksel
               aşak gaçyrýardy. Mesele tertipde däl-de PANELIŇ
               BEÝIKLIGINDEDI. Şonuň üçin ol kiçi ekranda gysgaldyldy
               (nyşan kiçi, jaýlar dar, şygar bir setire ýakyn) —
               indi ol ~260 piksel tutýar we düwme ekranda galýar. */}
          <div className="order-1 col-span-4 md:col-span-8 lg:col-span-6">
            <BrandPanel />
          </div>

          {/* ================= SAG: ÝAZGY ================= */}
          <div className="order-2 col-span-4 md:col-span-8 lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg mb-5 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 sm:mb-6"
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

  /* Daşky gap diňe perspektiwa üçin — ol animasiýa EDILMEÝÄR.
     Öň ol hem süýşüp-ulalyp gelýärdi; aýnanyň açylyşy goşulanda
     iki hereket üst-üste düşüp, girişi bulaşyk edýärdi. Indi
     ýeke-täk giriş — aýnanyň açylmagy. */
  return (
    <div
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

      {/* ---- AÝNANYŇ AÇYLYŞY ----
           Panel ýapyk kapsula bolup başlaýar we dikligine açylýar —
           göz gabagynyň açylyşy ýaly. Logo bolsa açylyş tamamlanyp
           barýarka içinden çykýar.

           `clip-path` saýlandy (`height` däl): ol mazmuny kesýär,
           ýöne ýerleşişi gaýtadan hasaplatmaýar. `height` animasiýa
           edilse, brauzer her kadrda tutuş sahypany täzeden ölçeýär
           we aşakdaky bölümler bökýär. */}
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        initial={
          reduceMotion
            ? false
            : { clipPath: 'inset(44% 10% 44% 10% round 2.5rem)' }
        }
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 2.5rem)' }}
        transition={{ duration: 1.05, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="lg lg-refract relative flex flex-col items-center overflow-hidden rounded-4xl px-6 py-7 text-center transition-transform duration-500 ease-out-expo sm:px-12 sm:py-16"
        style={{
          transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Açylyş pursatynda aýnanyň ýüzünden geçýän ýagtylyk.
            Ol açylyşy «material hereketi» edýär — ýogsam kesilme
            diňe tehniki effekt bolup görünýär. */}
        {!reduceMotion && (
          <motion.span
            aria-hidden
            initial={{ x: '-130%' }}
            animate={{ x: '130%' }}
            transition={{ duration: 1.3, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgb(var(--glass-spec) / 0.55), transparent)',
            }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.55, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Telefonda nyşan kiçeldildi: panel birinji gelýändigi üçin
              ol sözbaşyny ekrandan itermeli däl. */}
          <LogoMark className="w-16 sm:w-32 lg:w-36" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.86, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <p className="mt-5 font-display font-extrabold leading-none tracking-tight sm:mt-9">
            <span className="block text-h3 sm:text-h2">Next Step</span>
            <span className="mt-2.5 block text-micro font-semibold uppercase tracking-[0.3em] text-faint sm:mt-3.5 sm:text-body-sm sm:tracking-[0.34em]">
              Consulting
            </span>
          </p>

          <div aria-hidden className="my-5 h-px w-16 bg-line/[0.18] sm:my-9" />

          <p className="text-balance font-display text-body-lg font-bold leading-snug tracking-tight sm:text-h3">
            {t('slogan')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
