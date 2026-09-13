'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Bell, LogOut, Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/types';
import { Logo } from '@/components/shared/Logo';

/**
 * ADMIN GABYGY (Shell)
 * ------------------------------------------------------------------
 * Iki panel hem şu bir gabygy paýlaşýar — çep gapdal menýu, ýokarky
 * hatar we mazmun meýdany. Tapawut diňe menýunyň elementlerinde.
 *
 * Näme üçin bir gabyk? Sebäbi iki dolandyryjy hem şol bir ulgamda
 * işleýär: öwrenişmek wagty gysgalýar, kod bolsa iki gezek
 * ýazylmaýar. Rol tapawudy `middleware.ts`-de goralýar.
 */
export function AdminShell({
  children,
  nav,
  title,
  subtitle,
  user,
  accent = 'brand',
}: {
  children: React.ReactNode;
  nav: Array<{ href: string; label: string; icon: React.ElementType; badge?: number }>;
  title: string;
  subtitle: string;
  user: TeamMember;
  accent?: 'brand' | 'ok';
}) {
  const t = useTranslations('admin.common');
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="flex min-h-screen bg-base">
      {/* ================= ÇEP GAPDAL MENÝU ================= */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line/10 bg-surface/40 p-5 lg:flex">
        <Link href={`/${locale}`} aria-label="Next Step Consulting">
          <Logo size="sm" />
        </Link>

        {/* Ulanyjynyň roly — kimiň paneline girendigi hemişe görünýär */}
        <div className="mt-6 rounded-2xl border border-line/10 bg-base/60 p-3.5">
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-body-sm font-bold text-base"
              style={{ background: `rgb(${user.avatarColor})` }}
            >
              {user.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-semibold">{user.name}</p>
              <p className="truncate text-micro text-faint">
                {user.role === 'analytics' ? t('roleAnalytics') : t('roleSales')}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1">
          <ul className="space-y-1">
            {nav.map(({ href, label, icon: Icon, badge }) => {
              const active = pathname.includes(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-body-sm transition-all duration-200',
                      active
                        ? accent === 'brand'
                          ? 'bg-brand/12 font-semibold text-brand'
                          : 'bg-ok/12 font-semibold text-ok'
                        : 'text-muted hover:bg-line/[0.05] hover:text-ink',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="flex-1 truncate">{label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className="tnum rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-body-sm text-muted transition-colors hover:bg-line/[0.05] hover:text-brand">
          <LogOut className="h-4 w-4" aria-hidden />
          {t('logout')}
        </button>
      </aside>

      {/* ================= ESASY MEÝDAN ================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line/10 bg-base/80 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate font-display text-h4 font-extrabold tracking-tight">{title}</h1>
              <p className="truncate text-body-sm text-muted">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
                <input
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  aria-label={t('search')}
                  className="w-64 rounded-full border border-line/12 bg-surface/60 py-2.5 pl-9 pr-4 text-body-sm placeholder:text-faint focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/12"
                />
              </div>

              <button
                aria-label={t('notifications')}
                className="relative grid h-9 w-9 place-items-center rounded-full border border-line/12 text-muted transition-colors hover:text-ink"
              >
                <Bell className="h-4 w-4" aria-hidden />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
              </button>

              <button
                aria-label={t('profile')}
                className="grid h-9 w-9 place-items-center rounded-full border border-line/12 text-muted transition-colors hover:text-ink"
              >
                <Settings className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

/** Görkeziji kartasy (KPI) — iki panelde-de ulanylýar */
export function KpiCard({
  label,
  value,
  delta,
  suffix,
  accent = 'brand',
}: {
  label: string;
  value: string;
  delta?: number;
  suffix?: string;
  accent?: 'brand' | 'ok' | 'gold';
}) {
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line/10 bg-surface/50 p-5 transition-all duration-400 ease-out-expo hover:border-line/20 hover:shadow-soft">
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100',
          accent === 'brand' ? 'bg-brand/30' : accent === 'ok' ? 'bg-ok/30' : 'bg-gold/30',
        )}
      />
      <p className="relative text-body-sm text-muted">{label}</p>
      <div className="relative mt-2.5 flex items-baseline gap-2">
        <span className="tnum font-display text-3xl font-extrabold tracking-tight">{value}</span>
        {suffix && <span className="text-body-sm text-faint">{suffix}</span>}
      </div>
      {delta !== undefined && (
        <p className={cn('relative mt-2 text-body-sm font-semibold', positive ? 'text-ok' : 'text-brand')}>
          {positive ? '↑' : '↓'} {Math.abs(delta).toFixed(1).replace('.', ',')}%
        </p>
      )}
    </div>
  );
}
