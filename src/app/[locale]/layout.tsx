import type { Metadata } from 'next';
import { Geologica, Onest, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeMeta, isLocale, type Locale } from '@/lib/i18n';
import '../globals.css';

// latin-ext: ň, ş, ž üçin hökmany
const displayFont = Geologica({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Onest({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '600'],
  variable: '--font-mono',
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
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
