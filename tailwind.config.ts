import type { Config } from 'tailwindcss';

/**
 * NEXT STEP — DIZAÝN ULGAMY (Design System)
 * ------------------------------------------------------------------
 * Ähli reňkler CSS üýtgeýjiler (variables) arkaly kesgitlenýär.
 * Şeýlelikde Dark Mode / Light Mode bir tema gatlagynda dolandyrylýar,
 * komponentleriň kody bolsa üýtgewsiz galýar.
 */
const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    /* 12 sütünli (12-column) tor ulgamy — max giňlik 1280px, jaý 24px */
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', xl: '2.5rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        /* Esasy meýdanlar */
        base: 'rgb(var(--c-base) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        /* Ýazgylar */
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        faint: 'rgb(var(--c-faint) / <alpha-value>)',
        /* Nyşan (accent) reňkleri */
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          deep: 'rgb(var(--c-brand-deep) / <alpha-value>)',
          soft: 'rgb(var(--c-brand-soft) / <alpha-value>)',
          ink: 'rgb(var(--c-brand-ink) / <alpha-value>)',
        },
        /* Logonyň gradientiniň ikinji ujy. DIŇE doldurgy we gradient
           üçin — ak fonda 2,7:1 kontrast berýär, ýazgy üçin ýaramaýar. */
        azure: 'rgb(var(--c-azure) / <alpha-value>)',
        /* Gögüň ÝAZGY üçin garaldylan görnüşi — ak fonda 4,6:1 */
        'azure-ink': 'rgb(var(--c-azure-ink) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        /* «Öň» ýagdaýy üçin bitarap reňk — gyzyl bilen garyşmaz ýaly */
        slate: 'rgb(var(--c-slate) / <alpha-value>)',
        /* Many beriji (semantik) reňkler — nyşan reňkinden aýry */
        ok: 'rgb(var(--c-ok) / <alpha-value>)',
        warn: 'rgb(var(--c-warn) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Unbounded', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Golos Text', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      /* Mikro-tipografiýa: her ölçegiň öz setir aralygy we harp aralygy bar */
      fontSize: {
        'micro': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        'label': ['0.75rem', { lineHeight: '1.1rem', letterSpacing: '0.04em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.7rem', letterSpacing: '-0.005em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.85rem', letterSpacing: '-0.01em' }],
        'h4': ['1.18rem', { lineHeight: '1.34', letterSpacing: '-0.03em' }],
        'h3': ['1.5rem', { lineHeight: '1.28', letterSpacing: '-0.035em' }],
        /* Unbounded giň şrift — şol bir ölçegde has köp ýer tutýar,
           şonuň üçin iň uly baha kiçeldildi we traking darlaşdyryldy.

           ⚠️ SETIR ARALYGY 1,02 DÄL. Türkmen, rus we türk dillerinde
           harplaryň ÜSTÜNDE we AŞAGYNDA belgi köp: Ý, Ň, Ä, Ö, Ü, Ş,
           Ç, Й, Ё. Gaty dar aralykda ýokarky setiriň aşaky guýrugy
           bilen aşaky setiriň ýokarky belgisi biri-birine degýär.
           Iňlis dilinde bildirmeýär, biziň üç dilimizde-de bildirýär. */
        'h2': ['clamp(1.85rem, 3.4vw, 2.75rem)', { lineHeight: '1.14', letterSpacing: '-0.04em' }],
        'h1': ['clamp(2.1rem, 4.9vw, 3.9rem)', { lineHeight: '1.12', letterSpacing: '-0.05em' }],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem', '3xl': '1.75rem', '4xl': '2.5rem' },
      boxShadow: {
        'soft': '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.12)',
        'lift': '0 2px 4px rgb(0 0 0 / 0.06), 0 24px 48px -20px rgb(0 0 0 / 0.25)',
        'seal': '0 0 0 1px rgb(var(--c-brand) / 0.22), 0 14px 34px -12px rgb(var(--c-brand) / 0.38)',
        'brand': '0 10px 30px -10px rgb(var(--c-brand) / 0.55)',
        'inset-line': 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      transitionTimingFunction: {
        /* Premium duýgy: standart `ease` ulanylmaýar */
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        /* Kartanyň reňkli şöhlesiniň haýal demlemegi */
        'glow-pulse': {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1.25)' },
          '50%':      { opacity: '1',    transform: 'scale(1.45)' },
        },
        'aurora': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -6%, 0) scale(1.12)' },
        },
        'marquee': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'shimmer': { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
        'rise': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        /* Ýalňyş kod — gysga, sönýän sarsgyn. Amplituda 6px-den geçmeýär:
           ondan ulusy «döwlen interfeýs» duýgusyny berýär, kiçisi bolsa
           bildirmeýär. Ýazgy okalmanka-da signal berýän ýeke-täk hereket. */
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '18%': { transform: 'translateX(-6px)' },
          '38%': { transform: 'translateX(5px)' },
          '58%': { transform: 'translateX(-3px)' },
          '78%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        aurora: 'aurora 18s ease-in-out infinite',
        marquee: 'marquee 42s linear infinite',
        'marquee-slow': 'marquee 96s linear infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        rise: 'rise 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'glow-pulse': 'glow-pulse 4.5s ease-in-out infinite',
        shake: 'shake 0.44s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
    },
  },
  plugins: [],
};

export default config;
