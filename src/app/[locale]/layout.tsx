import type { Metadata } from 'next';
import { Golos_Text, Unbounded, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeMeta, isLocale, type Locale } from '@/lib/i18n';
import { LiquidRefractionFilter } from '@/components/ui/AuroraField';
import '../globals.css';

/**
 * ŞRIFTLER — üçüsi hem `cyrillic` we `latin-ext` toplumlaryny doly
 * goldaýar (fonts.googleapis.com boýunça barlanyldy). Bu üç dilli
 * taslamada hökmany şert: türkmen diliniň ä ň ö ş ü ý ž harplary
 * (ň → U+0148, ş → U+015F, ž → U+017E — `latin-ext`) hem-de rus
 * kirillisi bir şriftde, bir stilde çykmalydyr.
 *
 *   Unbounded      — sözbaşylar: giň, geometrik, örän häsiýetli.
 *                    900 agramda ulanylýar — «creative + ýogyn».
 *   Golos Text     — esasy ýazgy 450–600 agramda: uzyn abzaslarda
 *                    okalýan, ýöne inçe däl.
 *   JetBrains Mono — sanlar, bellikler we açar atlary
 */
const displayFont = Unbounded({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const golos = Golos_Text({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  /* 500 we 600 goşuldy — esasy ýazgy hem ýogynrak bolmaly, ýogsam
     Unbounded 900 sözbaşynyň gapdalynda ol «inçe» görünýär. */
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: { default: t('title'), template: `%s · Next Step Consulting` },
    description: t('description'),
    metadataBase: new URL('https://nextstep.tm'),
    alternates: {
      canonical: `/${locale}`,
      /* Gözleg ulgamlaryna dil görnüşlerini görkezmek */
      languages: {
        tk: '/tm',
        ru: '/ru',
        tr: '/tr',
        'x-default': '/tm',
      },
    },
    openGraph: {
      type: 'website',
      locale: localeMeta[locale].htmlLang,
      title: t('title'),
      description: t('description'),
      siteName: 'Next Step Consulting',
      images: [{ url: `/api/og?locale=${locale}`, width: 1200, height: 630, alt: t('ogAlt') }],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Tema skripti — sahypa çyzylmazdan öň işleýär.
 * Şeýlelikde garaňky temada sahypanyň ak «ýalpyldamagy» (flash) bolmaýar.
 */
const themeScript = `
(function(){
  try {
    /* Saýtyň esasy görnüşi ÝAGTY. Ulanyjy garaňkyny saýlan bolsa
       ýa-da ulgamy garaňky bolsa — şoňa geçirilýär. */
    var stored = localStorage.getItem('ns-theme');
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', stored || system);
  } catch (e) {}
})();
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={localeMeta[locale as Locale].htmlLang}
      dir="ltr"
      suppressHydrationWarning
      className={`${displayFont.variable} ${golos.variable} ${monoFont.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        {/* Döwülme süzgüji sahypada bir gezek — ähli aýna elementleri
            şondan peýdalanýar (`.lg-refract`). */}
        <LiquidRefractionFilter />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
