import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';

/**
 * ARADAKY GATLAK (Middleware)
 * ------------------------------------------------------------------
 * Iki wezipäni ýerine ýetirýär:
 *  1. Dili kesgitlemek — URL-de dil bolmasa, brauzeriň diline görä
 *     ugrukdyrýar (`/` → `/tm`).
 *  2. Admin bölümlerini goramak — `/{dil}/admin/...` salgylary diňe
 *     dogry rola eýe ulanyjy üçin açylýar.
 *
 * BELLIK: Aşakdaky rol barlagy görkezme (demo) görnüşde ýazyldy.
 * Önümçilikde ony NextAuth / Supabase Auth ýaly hakyky ulgama
 * çalyşmaly — şerti üýtgetmeli däl, diňe çeşmesini.
 */

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

/** Haýsy admin bölümi haýsy rola degişli */
const ADMIN_ROUTES: Record<string, 'sales' | 'analytics'> = {
  satuw: 'sales',
  analitika: 'analytics',
};

/**
 * Goragyň DAŞYNDA galýan admin bölümleri.
 *
 * ⚠️ Bu sanaw bolmasa ÇÄKSIZ AÝLAW ýüze çykýar: giriş sahypasynyň
 * salgysy hem `/{dil}/admin/...` nusgasyna gabat gelýär, ýagny
 * goragçy ony hem tutup, ýene giriş sahypasyna ugrukdyrýar — we
 * şeýdip tükeniksiz. Brauzer `ERR_TOO_MANY_REDIRECTS` berýärdi.
 */
const PUBLIC_ADMIN = new Set(['giris']);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminMatch = pathname.match(/^\/(tm|ru|tr)\/admin\/([^/]+)/);
  if (adminMatch) {
    const [, locale, section] = adminMatch;

    /* Giriş sahypasynyň özi goralmaýar — ýogsam aýlaw ýapylmaýar */
    if (PUBLIC_ADMIN.has(section)) return intlMiddleware(request);

    const requiredRole = ADMIN_ROUTES[section];

    const session = request.cookies.get('ns_session')?.value;
    const role = request.cookies.get('ns_role')?.value;

    /* Giriş edilmedik bolsa — giriş sahypasyna */
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/giris`;
      url.searchParams.set('yzyna', pathname);
      return NextResponse.redirect(url);
    }

    /* Rol gabat gelmese — öz paneline gaýtarylýar */
    if (requiredRole && role !== requiredRole && role !== 'owner') {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/${role === 'analytics' ? 'analitika' : 'satuw'}`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  /* Statik faýllar we API ýollary aradaky gatlakdan geçmeýär */
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
