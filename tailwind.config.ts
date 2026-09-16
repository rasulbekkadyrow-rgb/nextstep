import type { Config } from 'tailwindcss';

// Reňkler globals.css-däki CSS üýtgeýjilerinden gelýär. Garaňky tema ýok.
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', xl: '2.5rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        base: 'rgb(var(--c-base) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        faint: 'rgb(var(--c-faint) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          deep: 'rgb(var(--c-brand-deep) / <alpha-value>)',
          soft: 'rgb(var(--c-brand-soft) / <alpha-value>)',
          ink: 'rgb(var(--c-brand-ink) / <alpha-value>)',
        },
        deep: {
          DEFAULT: 'rgb(var(--c-deep) / <alpha-value>)',
          soft: 'rgb(var(--c-deep-soft) / <alpha-value>)',
          ink: 'rgb(var(--c-deep-ink) / <alpha-value>)',
          muted: 'rgb(var(--c-deep-muted) / <alpha-value>)',
        },
        // azure ak fonda 2.7:1, tekst üçin azure-ink ulanmaly
        azure: 'rgb(var(--c-azure) / <alpha-value>)',
        'azure-ink': 'rgb(var(--c-azure-ink) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        slate: 'rgb(var(--c-slate) / <alpha-value>)',
        ok: 'rgb(var(--c-ok) / <alpha-value>)',
        warn: 'rgb(var(--c-warn) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Geologica', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Onest', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      // line-height 1.1-den pes bolmaly: Ý, Ň, Й ýaly harplaryň belgileri degişýär
      fontSize: {
        'micro': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
        'label': ['0.75rem', { lineHeight: '1.1rem', letterSpacing: '0.03em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.45rem', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.65rem', letterSpacing: '0' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],
        'h4': ['1.0625rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        'h3': ['clamp(1.2rem, 1.9vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.55rem, 2.7vw, 2.15rem)', { lineHeight: '1.2', letterSpacing: '-0.022em' }],
        'h1': ['clamp(1.95rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.026em' }],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem', '3xl': '1.75rem', '4xl': '2.5rem' },
      boxShadow: {
        'soft': '0 1px 2px rgb(var(--c-ink) / 0.04), 0 12px 32px -14px rgb(var(--c-ink) / 0.14)',
        'lift': '0 2px 4px rgb(var(--c-ink) / 0.05), 0 28px 56px -22px rgb(var(--c-ink) / 0.26)',
        'brand': '0 10px 26px -10px rgb(var(--c-brand) / 0.55)',
        'brand-lg': '0 16px 40px -12px rgb(var(--c-brand) / 0.62)',
        'header': '0 1px 0 0 rgb(var(--c-line) / 0.08), 0 8px 24px -16px rgb(var(--c-ink) / 0.22)',
        'inset-line': 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'marquee': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'rise': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '18%': { transform: 'translateX(-6px)' },
          '38%': { transform: 'translateX(5px)' },
          '58%': { transform: 'translateX(-3px)' },
          '78%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        'marquee-slow': 'marquee 96s linear infinite',
        rise: 'rise 0.7s cubic-bezier(0.16,1,0.3,1) both',
        shake: 'shake 0.44s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
    },
  },
  plugins: [],
};

export default config;
