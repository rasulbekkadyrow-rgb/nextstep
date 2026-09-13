'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Menu, X, Moon, Sun, Globe, Check, ChevronDown } from 'lucide-react';
import { locales, localeMeta, type Locale } from '@/lib/i18n';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { LogoMark } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

/**
 * ÝOKARKY PANEL (Header) — SKROLLA BAGLY «DYNAMIC ISLAND»
 * ==================================================================
 * ESASY PIKIR: panelde IKI ÝAGDAÝ ÝOK — BIR ÝAGDAÝ BAR, ol skrollyň
 * ýagdaýyna görä 0-dan 1-e çenli üznüksiz üýtgeýär.
 *
 *   ilerleýiş 0.0  →  uzyn aýna zolak (logo, bölümler, dil, CTA)
 *   ilerleýiş 1.0  →  «Next Step Consulting» ýazgyly kiçijik gerş
 *
 * Aralykdaky her bir ölçeg — giňlik, beýiklik, jaý, burçlaryň radiusy,
 * nyşanyň ölçegi, ýazgylaryň aýdyňlygy — şol BIR sandan hasaplanýar.
 * Şonuň üçin haýal skroll edeniňde panel hem haýal, skrolluň her
 * pikselinde kiçelýär. Bosaga ýok, bökme ýok.
 *
 * NÄME ÜÇIN `layout` DÄL?
 * Framer-iň `layout`-y iki ÝAGDAÝYŇ arasynda köpri gurýar: ol diňe
 * ýagdaý çalşanda işleýär, ýagny hemişe «bir gezekde» geçýär. Bize
 * bolsa skrolluň özi bilen baglanan hereket gerek — şonuň üçin ähli
 * ölçegler `MotionValue` görnüşinde göni skrolldan alynýar.
 *
 * SUWUKLYK NIREDEN GELÝÄR?
 * Çig ilerleýiş `useSpring`-den geçirilýär. Skroll togtansoň hem
 * material ýene bir dem ýerine gelýär — hakyky suwuk ýaly yza galýar.
 *
 * NÄME ÜÇIN ÖLÇEGLER PIKSELDE?
 * `width: 100% → auto` animasiýa edilmeýär. Şonuň üçin açyk ýagdaýyň
 * giňligi mazmunyň gabyndan (`trackRef`), ýygnanan ýagdaýyň giňligi
 * bolsa görünmeýän ölçeýji ýazgydan (`ghostRef`) ölçenilýär —
 * ikisiniň arasy indi adaty san, islendik nokadynda hasaplanýar.
 * Dil çalşanda ýazgynyň uzynlygy üýtgese, ölçeg özi täzelenýär.
 * ================================================================== */

/** Panel şu aralykda doly ýygrylýar (piksel). Uzyn aralyk = haýal geçiş. */
const COLLAPSE_DISTANCE = 260;

/** Açyk we ýygnanan ýagdaýyň ölçegleri (piksel). */
const HEIGHT = { open: 66, shut: 40 };
const PAD_X = { open: 20, shut: 14 };
const LOGO = { open: 28, shut: 20 };
/** Nyşan bilen ýazgynyň arasyndaky hemişelik jaý. */
const GAP = 10;
/** Ýazgy bilen bölümleriň arasyndaky dem. */
const LEAD = 18;

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const proof = useTranslations('proof');
  const reduceMotion = useReducedMotion();

  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  /* Skrolldan gelýän «şu wagtky ýagdaý» — diňe okamak üçin. */
  const [shut, setShut] = useState(false);       /* ýygnanana ýakyn */
  const [fullyOpen, setFullyOpen] = useState(true); /* doly açyk */

  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const stackRef = useRef<HTMLSpanElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  /* --- ÖLÇEGLER ------------------------------------------------- */
  const [openW, setOpenW] = useState(0);
  const [shutW, setShutW] = useState(0);
  const [stackW, setStackW] = useState(96);

  useEffect(() => {
    const track = trackRef.current;
    const ghost = ghostRef.current;
    const stack = stackRef.current;
    if (!track || !ghost || !stack) return;

    const measure = () => {
      setOpenW(track.offsetWidth);
      /* Ýygnanan gerş: jaý + nyşan + aralyk + ýazgy + jaý */
      setShutW(PAD_X.shut * 2 + LOGO.shut + GAP + Math.ceil(ghost.offsetWidth));
      setStackW(Math.ceil(stack.offsetWidth));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(ghost);
    ro.observe(stack);
    /* Şrift giç ýüklense ýazgynyň ini üýtgeýär — gaýtadan ölçeýäris. */
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [locale]);

  /* --- ILERLEÝIŞ (0 → 1) ---------------------------------------- */
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, [0, COLLAPSE_DISTANCE], [0, 1], { clamp: true });

  /* `target` — nirä barmaly; `p` — şol ýere suwuk gelýän hakyky baha. */
  const target = useMotionValue(0);
  const p = useSpring(
    target,
    reduceMotion
      ? { stiffness: 1000, damping: 100, mass: 0.1 }
      : { stiffness: 190, damping: 32, mass: 0.55 },
  );

  /* Ulanyjy panele ýüzlenen bolsa (kursor, basma, menýu) — mejbury açyk. */
  const peek = hovered || tapped || menuOpen || langOpen;

  useMotionValueEvent(raw, 'change', (v) => {
    if (!peek) target.set(v);
    /* Basyp açylan gerş skroll başlanda ýene ýygnanýar. */
    if (tapped) setTapped(false);
  });

  useEffect(() => {
    target.set(peek ? 0 : raw.get());
  }, [peek, target, raw]);

  /* React tarapa gerekli iki bosaga. Deň baha gaýtarylanda React
     gaýtadan çyzmaýar — şonuň üçin bu her kadrda däl, diňe serhet
     kesilende işleýär. */
  useMotionValueEvent(p, 'change', (v) => {
    setShut((s) => (v > 0.6 === s ? s : v > 0.6));
    setFullyOpen((o) => (v < 0.04 === o ? o : v < 0.04));
  });

  /* --- ILERLEÝIŞDEN GELIP ÇYKÝAN ÄHLI ÖLÇEGLER ------------------ */
  const width = useTransform(p, [0, 1], [openW, shutW]);
  const height = useTransform(p, [0, 1], [HEIGHT.open, HEIGHT.shut]);
  const radius = useTransform(p, [0, 1], [HEIGHT.open / 2, HEIGHT.shut / 2]);
  const padX = useTransform(p, [0, 1], [PAD_X.open, PAD_X.shut]);
  const logoW = useTransform(p, [0, 1], [LOGO.open, LOGO.shut]);
  /* Ýazgylar nyşanyň sag gyrasyndan başlaýar — nyşan kiçelende olar hem süýşýär. */
  const labelX = useTransform(logoW, (w) => w + GAP);

  /* ÝAZGYLARYŇ ÇALŞYGY — wagtlama şu ýerde kesgitlenýär.
     Ilkinji görnüşde iki gulp giň aralyk bilen çalyşýardy: aralykda
     panel uzyn, ýöne BOŞ galýardy — geçiş bölünen ýaly duýulýardy.
     Indi olar ir we gysga aralykda çalyşýar: aýna daralýan bütin
     ýoluň dowamynda içinde hemişe ýazgy bar. */
  const stackO = useTransform(p, [0, 0.16], [1, 0]);
  const compactO = useTransform(p, [0.2, 0.46], [0, 1]);
  const chevronO = useTransform(p, [0.55, 0.85], [0, 1]);

  /* Bölümler we gurallar: ýitýär, bulaşýar we ýeňiljek saga süýşýär —
     aýnanyň gyrasynyň aşagyna girýän ýaly. */
  const fullO = useTransform(p, [0, 0.2], [1, 0]);
  const fullBlur = useTransform(p, [0, 0.2], ['blur(0px)', 'blur(7px)']);
  const fullX = useTransform(p, [0, 0.2], [0, 20]);
  /* `hidden` bolanda element klawiatura fokusyna hem düşmeýär. */
  const fullVis = useTransform(p, (v) => (v > 0.3 ? 'hidden' : 'visible'));

  /* Açyk ýagdaýyň mazmuny gymyldamaz ýaly, onuň gaby HEMIŞE şol bir
     ölçegde galýar — daralýan aýna ony diňe kesip gizleýär. */
  const contentLeft = PAD_X.open + LOGO.open + GAP + stackW + LEAD;
  const contentW = Math.max(0, openW - contentLeft - PAD_X.open);

  /* --- TEMA ----------------------------------------------------- */
  useEffect(() => {
    const stored = document.documentElement.getAttribute('data-theme');
    if (stored === 'light' || stored === 'dark') setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ns-theme', next); } catch { /* gizli rejimde elýeterli däl */ }
  };

  /* Gerşiň daşyna basylanda ol ýapylýar (telefon üçin). */
  useEffect(() => {
    if (!tapped) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setTapped(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [tapped]);

  /* Dil sanawy: daşyna basylanda ýa-da Esc basylanda ýapylýar.
     ⚠️ Öň bu iş `fixed inset-0` örtük bilen edilýärdi, emma panelde
     `backdrop-filter` bar — şeýle element `fixed` çagalary üçin täze
     gapdal çäk döredýär, şonuň üçin örtük ekrany däl-de diňe paneliň
     özüni tutýardy we daşyna basmak asla işlemeýärdi. */
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  /** Häzirki sahypany saklap, diňe dili çalyşmak: /tm/... → /ru/... */
  const pathWithLocale = (next: Locale) => {
    const segments = pathname.split('/');
    segments[1] = next;
    return segments.join('/') || `/${next}`;
  };

  /* «Netijeler» bölümi hakyky kabul hatlary bolmasa görkezilmeýär
     (`SocialProof`). Şonuň üçin salgy hem şoňa görä goşulýar —
     ýogsam menýu boş ýere eltýän ölen salga öwrülýärdi. */
  const hasProof = (proof.raw('letters') as unknown[]).length > 0;

  const links = [
    { href: '#kynçylyk', label: t('links.problem') },
    { href: '#tertip', label: t('links.process') },
    { href: '#uniwersitetler', label: t('links.universities') },
    ...(hasProof ? [{ href: '#netijeler', label: t('links.proof') }] : []),
    { href: '#soraglar', label: t('links.faq') },
  ];

  /** Ýygnanan ýazgy — hakyky we ölçeýji nusgada birmeňzeş bolmaly. */
  const compactLabel = (
    <>
      {t('brand')} <span className="font-semibold text-faint">{t('brandSuffix')}</span>
    </>
  );
  const compactCls =
    'whitespace-nowrap font-display text-body-sm font-extrabold leading-none tracking-tight';

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
      <div className="container relative">
        {/* Açyk ýagdaýyň giňligini ölçeýän görünmeýän trek */}
        <div ref={trackRef} aria-hidden className="h-0 w-full" />

        <div className="flex justify-center">
          <motion.nav
            ref={navRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: openW ? width : '100%',
              height,
              borderRadius: radius,
              paddingLeft: padX,
              paddingRight: padX,
            }}
            className={cn(
              /* ⚠️ `lg-refract` bu ýerde ÝOK. Ol SVG tolkun süzgüjini
                 arka fona ulanýar — iň gymmat effektleriň biri. Panel
                 bolsa skrollda her kadrda inini üýtgedýär: ikisi
                 birleşende brauzer her kadrda tolkuny gaýtadan
                 hasaplaýardy. Aýna gyrasy we kölegesi onsuz hem
                 ýeterlik. */
              'lg lg-thin pointer-events-auto relative flex items-center',
              /* Daralýan aýna mazmuny kesýär. Diňe doly açykka kesmeýär —
                 ýogsam dil sanawy panelden çykyp bilmezdi. */
              fullyOpen ? 'overflow-visible' : 'overflow-hidden',
            )}
          >
            {/* --- Marka --- */}
            <Link
              href={`/${locale}`}
              aria-label={`${t('brand')} ${t('brandSuffix')}`}
              tabIndex={shut ? -1 : undefined}
              className="relative flex h-full shrink-0 items-center"
            >
              <motion.span style={{ width: logoW }} className="block shrink-0">
                <LogoMark className="w-full" />
              </motion.span>

              {/* Iki setirli gulp — açyk ýagdaýda.
                  ⚠️ `sm`-den kiçi ekranda GÖRKEZILMEÝÄR. 375px giňlikde
                  zolagyň içinde 116px-lik ýazgy, dil, tema we menýu
                  düwmeleri bir hatarda sygmaýar — gurallar aýnanyň
                  gyrasyndan çykýardy. Nyşanyň özi markany aňladýar,
                  doly at bolsa ýygnanan gerşde onsuz hem görünýär.
                  Ölçeg şu elementden alynýar: gizlenende ini 0 bolýar
                  we galan hasaplar özünden düzelýär. */}
              <motion.span
                ref={stackRef}
                aria-hidden
                style={{ left: labelX, opacity: stackO }}
                className="absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap font-display font-extrabold leading-none tracking-tight sm:block"
              >
                <span className="text-body">{t('brand')}</span>
                <span className="mt-0.5 block text-micro font-semibold uppercase leading-none tracking-[0.22em] text-faint">
                  {t('brandSuffix')}
                </span>
              </motion.span>

              {/* Bir setirli ýazgy — ýygnanan ýagdaýda */}
              <motion.span
                aria-hidden
                style={{ left: labelX, opacity: compactO }}
                className={cn('absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5', compactCls)}
              >
                {compactLabel}
                <motion.span style={{ opacity: chevronO }} className="text-faint">
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </motion.span>
            </Link>

            {/* --- Bölümler we gurallar --- */}
            <motion.div
              style={{
                left: contentLeft,
                width: contentW || undefined,
                opacity: fullO,
                filter: fullBlur,
                x: fullX,
                visibility: fullVis,
              }}
              className="absolute inset-y-0 flex items-center gap-3"
            >
              <ul className="mx-auto hidden items-center gap-1 lg:flex">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group relative block rounded-full px-3.5 py-2 text-body-sm text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                      {/* Aşakdaky çyzyk hover-de merkezden ýaýraýar */}
                      <span
                        aria-hidden
                        className="absolute inset-x-3.5 bottom-1 h-px origin-center scale-x-0 bg-brand transition-transform duration-300 ease-out-expo group-hover:scale-x-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="ml-auto flex shrink-0 items-center gap-2">
                {/* Dil çalşyryjy */}
                <div ref={langRef} className="relative">
                  <button
                    onClick={() => setLangOpen((v) => !v)}
                    aria-expanded={langOpen}
                    aria-label={t('languageLabel')}
                    className="flex items-center gap-1.5 rounded-full border border-line/12 px-3 py-2 text-body-sm font-semibold transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    <Globe className="h-3.5 w-3.5" aria-hidden />
                    {localeMeta[locale].short}
                  </button>

                  <AnimatePresence>
                    {langOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 z-20 mt-3 w-44 overflow-hidden rounded-2xl border border-line/12 bg-surface/95 p-1.5 shadow-lift backdrop-blur-xl"
                      >
                        {locales.map((code) => (
                          <li key={code}>
                            <Link
                              href={pathWithLocale(code)}
                              onClick={() => setLangOpen(false)}
                              className={cn(
                                'flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-body-sm transition-colors',
                                code === locale ? 'bg-brand/10 font-semibold text-brand' : 'hover:bg-line/[0.06]',
                              )}
                            >
                              <span className="flex items-center gap-2.5">
                                <span aria-hidden>{localeMeta[code].flag}</span>
                                {localeMeta[code].label}
                              </span>
                              {code === locale && <Check className="h-3.5 w-3.5" aria-hidden />}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tema çalşyryjy */}
                <button
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line/12 text-muted transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={theme}
                      initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </motion.span>
                  </AnimatePresence>
                </button>

                <div className="hidden md:block">
                  <MagneticButton href="#arza" variant="primary" className="px-5 py-2.5">
                    {t('cta')}
                  </MagneticButton>
                </div>

                {/* Mobil menýu düwmesi */}
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
                  aria-expanded={menuOpen}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line/12 lg:hidden"
                >
                  {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {/* Ýygnanan gerşiň ähli ýüzi — bir düwme. Aşakdaky logo salgysyny
                örtýär, şonuň üçin basmak diňe açýar, sahypa geçirmeýär. */}
            {shut && (
              <button
                type="button"
                onClick={() => setTapped(true)}
                aria-label={t('menuOpen')}
                className="absolute inset-0 z-10"
              />
            )}
          </motion.nav>
        </div>

        {/* --- Mobil menýu --- */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto mt-3 overflow-hidden rounded-3xl border border-line/12 bg-surface/95 p-3 shadow-lift backdrop-blur-xl lg:hidden"
            >
              <ul className="space-y-1">
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-body font-medium transition-colors hover:bg-line/[0.06]"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href="#arza"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-xl bg-brand px-4 py-3.5 text-center text-body-sm font-semibold text-brand-ink"
              >
                {t('cta')}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ÖLÇEÝJI NUSGA — görünmeýär, diňe ýygnanan ýazgynyň inini berýär.
          Hakyky ýazgy bilen synplary birmeňzeş, ýogsam ölçeg ýalňyş bolar. */}
      <span
        ref={ghostRef}
        aria-hidden
        className={cn(
          'invisible fixed left-0 top-0 flex items-center gap-1.5',
          compactCls,
        )}
      >
        {compactLabel}
        <ChevronDown className="h-3.5 w-3.5" />
      </span>
    </header>
  );
}
