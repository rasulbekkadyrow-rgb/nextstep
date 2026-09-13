import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Hero } from '@/components/landing/Hero';
import { QuickActions } from '@/components/landing/QuickActions';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Universities } from '@/components/landing/Universities';
import { SocialProof } from '@/components/landing/SocialProof';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { FinalCta } from '@/components/landing/FinalCta';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

/**
 * LANDING PAGE — BÖLÜMLERIŇ TERTIBI
 * ==================================================================
 * Tertip ynandyryş mantygyna görä düzüldi. Talyp we onuň ene-atasy
 * sahypany okap barýarka, olaryň kellesinde şu soraglar yzygiderli
 * döreýär — her bölüm şolaryň birine jogap berýär:
 *
 *  1. HERO ............ «Bu näme? Maňa gerekmi?»
 *                       Jogap: kabul haty — görüp bolýan netije.
 *
 *  1b. ÇALT HEREKET ... «Maňa haýsysy gerek?»
 *                       Dört gapy: başlamak / uniwersitet / ýeňillik /
 *                       WhatsApp. Sahypany okaman hem ýoluny saýlaýan
 *                       ulanyjy üçin. (Bäsdeş seljermesinden alyndy.)
 *
 *  2. AGYRY/ÇÖZGÜT .... «Olar meniň ýagdaýymy bilýärmi?»
 *                       Jogap: dört tanyş kynçylyk we olaryň çözgüdi.
 *
 *  3. IŞ TERTIBI ...... «Bu nähili işleýär? Näçe wagt gerek?»
 *                       Jogap: dört ädim, her biriniň möhleti bilen.
 *
 *  4. UNIWERSITETLER .. «Haýsy uniwersitetler barada gürrüň gidýär?»
 *                       Jogap: anyk atlar — hyzmatyň barlanýan bölegi.
 *
 *  5. NETIJELER ....... «Bu hakykatdan hem işleýärmi?»
 *                       Jogap: kabul hatlary we talyplaryň pikirleri.
 *
 *  6. TEKLIP + FAQ .... «Ýitirjek zadym barmy?»
 *                       Jogap: ilkinji maslahat tölegsiz, borçnama ýok.
 *
 * UNIWERSITETLER bölüminiň ýeri bilkastlaýyn şu ýerde: ulanyjy prosesi
 * öwrenenden SOŇ, ýöne subutnamany görmezden ÖŇ. Sebäbi tanalýan
 * uniwersitetiň ady prosese ynamy berkidýär we indiki bölümdäki
 * kabul hatlaryny has manyly edýär.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  /* Statik generasiýa üçin dili berkidýär (SSG — has çalt ýüklenýär) */
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        {/* SUBUTNAMA ILKINJI ORUNDA.
            Öň sahypa «kynçylyk → çözgüt → tertip → uniwersitetler»
            tertibinde gidip, kabul hatlary iň soňunda çykýardy. Emma
            bu işde adamyň ilki görmek isleýän zady WADA däl, NETIJE:
            hakykatdan-da kabul edilen talyplaryň hatlary. Şonuň üçin
            olar Hero-dan soň bada-bat gelýär, yzyndan bolsa şol
            hatlaryň gelen uniwersitetleri. */}
        <SocialProof images={await letterImages()} />
        <Universities />
        <QuickActions />
        <ProblemSolution />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/**
 * KABUL HATLARYNYŇ ŞEKILLERI — PAPKADAN OKALÝAR
 * ------------------------------------------------------------------
 * `public/hatlar/` papkasy serwer tarapda bir gezek okalýar we haýsy
 * hatyň şekiliniň BARDYGY anyk bilinýär.
 *
 * ⚠️ NÄME ÜÇIN BRAUZERDE SYNAMAK DÄL?
 * Ilki komponent şekili özi synaýardy: `.png` bolmasa `.jpg`, ol
 * bolmasa `.jpeg`… Papka boş wagty bu 44 karta × 4 giňeltme = 176
 * netijesiz haýyş berýärdi we kartalarda boş çarçuwa galýardy.
 * Papkany serwerde okamak — bir amal, nol artykmaç haýyş.
 *
 * Faýl goşulan badyna şekil öz-özünden peýda bolýar; ýok bolsa karta
 * ýazgy görnüşinde dogry işleýär.
 */
async function letterImages(): Promise<Record<string, string>> {
  try {
    const dir = path.join(process.cwd(), 'public', 'hatlar');
    const files = await readdir(dir);
    const map: Record<string, string> = {};
    for (const file of files) {
      const match = file.match(/^(.+)\.(png|jpg|jpeg|webp)$/i);
      if (match) map[match[1]] = `/hatlar/${file}`;
    }
    return map;
  } catch {
    return {}; // papka ýok — hiç zat, kartalar ýazgy bolup galýar
  }
}
