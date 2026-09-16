import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { isLocale } from '@/lib/i18n';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Hero } from '@/components/landing/Hero';
import { QuickActions } from '@/components/landing/QuickActions';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Universities } from '@/components/landing/Universities';
import { SocialProof } from '@/components/landing/SocialProof';
import { FinalCta } from '@/components/landing/FinalCta';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero banner={await heroBanner()} />
        <QuickActions />
        <SocialProof images={await letterImages()} />
        <Universities />
        <ProblemSolution />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/** public/banner/<ad>.jpg + telefon üçin <ad>@1280.jpg */
async function heroBanner(): Promise<{ src: string; mobile?: string } | undefined> {
  try {
    const dir = path.join(process.cwd(), 'public', 'banner');
    const files = (await readdir(dir)).filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file));
    const main = files.filter((file) => !file.includes('@')).sort()[0];
    if (!main) return undefined;
    const base = main.replace(/\.[^.]+$/, '');
    const mobile = files.find((file) => file.startsWith(`${base}@1280.`));
    return { src: `/banner/${main}`, mobile: mobile && `/banner/${mobile}` };
  } catch {
    return undefined;
  }
}

/** public/hatlar/<slug>.jpg → { slug: url } */
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
    return {};
  }
}
