/**
 * TÜRKIÝÄNIŇ UNIWERSITETLERI
 * ==================================================================
 * Lentada görkezilýän sanaw. Her ýazgy:
 *
 *   slug    — logo faýlynyň ady: `/public/universities/<slug>.png`
 *   short   — monogram (logo ýok bolsa şol görkezilýär)
 *   name    — resmi ady (terjime EDILMEÝÄR)
 *   city    — şäheri
 *   partner — biziň arza taýýarlaýan uniwersitetlerimizmi?
 *
 * ═══ LOGOLARY NÄDIP GOŞMALY ═══
 * Faýly `public/universities/` papkasyna `<slug>.png` ady bilen
 * goýmak ÝETERLIK — kody düzetmek gerek däl. Komponent surat bar
 * bolsa ony, ýok bolsa monogramy görkezýär (`onError` arkaly).
 * Meselem: `public/universities/bau.png`.
 *
 * Iň gowusy: aç-açan fonly PNG ýa-da SVG, gapdaly ≥ 128 piksel.
 *
 * ⚠️ HUKUK BELLIGI
 * Uniwersitetleriň logotipleri hukuk taýdan goralan nyşanlardyr.
 * Olary ýerleşdirmezden öň uniwersitetden ýa-da hyzmatdaşlyk
 * şertnamasyndan rugsat alynmalydyr. Şonuň üçin faýllar bu ýere
 * ÖZÜŇIZ goýulýar — kod olary awtomatiki ýüklemeýär.
 *
 * ⚠️ `partner: true` — talyp kabul edilendigi TASSYKLANAN uniwersitetler:
 * Instagram highlight-laryndaky bäş hususy uniwersitet, şeýle hem
 * kabul hatlary bar bolan iki döwlet uniwersiteti (Bayburt, Kütahya
 * Dumlupınar). Galanlary sanawda ugur hökmünde dur.
 */

export interface UniversityEntry {
  slug: string;
  short: string;
  name: string;
  city: string;
  partner: boolean;
}

/** Logo faýlynyň garaşylýan ýoly. Faýl ýok bolsa monogram görkezilýär. */
export const logoPath = (slug: string) => `/universities/${slug}.png`;

export const UNIVERSITIES: UniversityEntry[] = [
  /* --- Instagram highlight-laryndan tassyklanan --- */
  { slug: 'bau', short: 'BAU',  name: 'Bahçeşehir Üniversitesi',       city: 'İstanbul', partner: true },
  { slug: 'igu', short: 'IGU',  name: 'İstanbul Gelişim Üniversitesi', city: 'İstanbul', partner: true },
  { slug: 'istinye', short: 'ISU',  name: 'İstinye Üniversitesi',          city: 'İstanbul', partner: true },
  { slug: 'aydin', short: 'IAU',  name: 'İstanbul Aydın Üniversitesi',   city: 'İstanbul', partner: true },
  { slug: 'medipol', short: 'MED',  name: 'İstanbul Medipol Üniversitesi', city: 'İstanbul', partner: true },

  /* --- Öňde baryjy beýleki hususy uniwersitetler --- */
  { slug: 'uskudar', short: 'ÜSK',  name: 'Üsküdar Üniversitesi',          city: 'İstanbul', partner: false },
  { slug: 'yeditepe', short: 'YED',  name: 'Yeditepe Üniversitesi',         city: 'İstanbul', partner: false },
  { slug: 'bilgi', short: 'BLG',  name: 'İstanbul Bilgi Üniversitesi',   city: 'İstanbul', partner: false },
  { slug: 'altinbas', short: 'ALT',  name: 'Altınbaş Üniversitesi',         city: 'İstanbul', partner: false },
  { slug: 'okan', short: 'OKN',  name: 'İstanbul Okan Üniversitesi',    city: 'İstanbul', partner: false },
  { slug: 'kultur', short: 'IKU',  name: 'İstanbul Kültür Üniversitesi',  city: 'İstanbul', partner: false },
  { slug: 'beykent', short: 'BYK',  name: 'Beykent Üniversitesi',          city: 'İstanbul', partner: false },
  { slug: 'kadirhas', short: 'KHAS', name: 'Kadir Has Üniversitesi',        city: 'İstanbul', partner: false },
  { slug: 'nisantasi', short: 'NŞT',  name: 'Nişantaşı Üniversitesi',        city: 'İstanbul', partner: false },

  /* --- Döwlet uniwersitetleri: talyplarymyz kabul edilen --- */
  { slug: 'bayburt',   short: 'BYB',  name: 'Bayburt Üniversitesi',          city: 'Bayburt',  partner: true },
  { slug: 'dumlupinar', short: 'DPÜ', name: 'Kütahya Dumlupınar Üniversitesi', city: 'Kütahya', partner: true },
];
