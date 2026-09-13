import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

/**
 * I18N — DILLERIŇ MERKEZI SAZLAMASY
 * ---------------------------------------------------------------
 * Bu ýer taslamadaky dilleriň ýeke-täk hakykat çeşmesidir (single
 * source of truth). Täze dil goşulanda diňe şu faýl we `messages/`
 * bukjasyndaky JSON üýtgedilýär — komponentlere degmeli däl.
 */

export const locales = ['tm', 'ru', 'tr'] as const;
export type Locale = (typeof locales)[number];

/** Dil kesgitlenmedik ýagdaýynda ulanylýan esasy dil */
export const defaultLocale: Locale = 'tm';

/** Dil çalşyryjyda (switcher) görkezilýän maglumatlar */
export const localeMeta: Record<Locale, { label: string; short: string; flag: string; htmlLang: string }> = {
  tm: { label: 'Türkmen', short: 'TM', flag: '🇹🇲', htmlLang: 'tk' },
  ru: { label: 'Русский', short: 'RU', flag: '🇷🇺', htmlLang: 'ru' },
  tr: { label: 'Türkçe', short: 'TR', flag: '🇹🇷', htmlLang: 'tr' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Brauzeriň `Accept-Language` başlygyny biziň dillerimize öwürmek.
 * Mysal: `tk-TM` → `tm`, `ru-RU` → `ru`, `tr-TR` → `tr`.
 */
const languageAliases: Record<string, Locale> = {
  tk: 'tm', tm: 'tm', tuk: 'tm',
  ru: 'ru', be: 'ru', uk: 'ru', kk: 'ru', uz: 'ru',
  tr: 'tr', az: 'tr',
};

export function resolveLocaleFromHeader(header: string | null): Locale {
  if (!header) return defaultLocale;
  const candidates = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.toLowerCase().split('-')[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    const match = languageAliases[tag];
    if (match) return match;
  }
  return defaultLocale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  if (!requested || !isLocale(requested)) notFound();

  return {
    locale: requested,
    messages: (await import(`../../messages/${requested}.json`)).default,
    timeZone: 'Asia/Ashgabat',
    now: new Date(),
    formats: {
      number: {
        /* Sanlar we göterimler ähli dillerde bir görnüşde görkezilýär */
        percent: { style: 'percent', maximumFractionDigits: 1 },
        compact: { notation: 'compact', maximumFractionDigits: 1 },
      },
      dateTime: {
        short: { day: 'numeric', month: 'short' },
        full: { day: 'numeric', month: 'long', year: 'numeric' },
      },
    },
  };
});
