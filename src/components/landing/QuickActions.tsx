'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, MessageCircle, Percent, Rocket, Search } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const ICONS = {
  rocket: Rocket,     // derrew başlamak
  search: Search,     // uniwersitet gözlemek
  percent: Percent,   // ýeňillik we arzanladyş
  message: MessageCircle, // WhatsApp goldawy
} as const;

interface Item {
  icon: keyof typeof ICONS;
  title: string;
  text: string;
  cta: string;
  href: string;
}

/**
 * ÇALT HEREKET KARTALARY
 * ==================================================================
 * Bu bölüm bäsdeşiň saýtyny seljerenden soň goşuldy.
 *
 * NÄME ÜÇIN? Landing page-i yzygiderli okaýan ulanyjy az. Köpüsi
 * hero-ny görüp, derrew «maňa näme gerek?» diýip pikirlenýär. Şu dört
 * karta şol pursatda ýoly görkezýär: her biri sahypanyň bir bölümine
 * ýa-da WhatsApp-a göni eltýär.
 *
 * Praktikada bu «girişiň dört gapysy»: haýsy gapydan girse-de, ulanyjy
 * özüne gerek ýere düşýär we sahypadan çykmaýar.
 *
 * ÝÖNE BARLANMAÝAN SAN ÝOK. Bäsdeşler «%99,8 kabul», «%75-e çenli
 * ýeňillik» ýaly sanlar ýazýarlar. Biz muny gaýtalamaýarys: «ýeňillik
 * mümkinçilikleri barada anyk maglumat» diýilýär — bu hem güýçli
 * çagyryş, hem hakykat.
 */
export function QuickActions() {
  const t = useTranslations('quickActions');
  const items = t.raw('items') as Item[];

  return (
    <section className="relative -mt-4 pb-20 md:pb-24">
      <div className="container">
        <Reveal>
          <p className="eyebrow mb-5">{t('eyebrow')}</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Rocket;
            const external = item.href.startsWith('http');

            return (
              <Reveal key={item.title} delay={0.05 * i}>
                <Link
                  href={item.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="lg lg-press group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-transform duration-500 ease-out-expo hover:-translate-y-1.5"
                >
                  {/* Hover-de markanyň gradienti ýokardan syzýar */}
                  <span
                    aria-hidden
                    className="brand-gradient pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                  />

                  <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-line/12 bg-base/50 text-brand backdrop-blur-sm transition-colors duration-400 group-hover:border-brand/25 group-hover:bg-brand/[0.10]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>

                  <h3 className="text-h4 leading-tight">{item.title}</h3>
                  <p className="mt-2.5 flex-1 text-body-sm leading-relaxed text-muted">{item.text}</p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand">
                    {item.cta}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
