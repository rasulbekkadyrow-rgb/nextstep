import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';
import { SESSION_COOKIE, verifySession, type AdminRole } from '@/lib/auth/session';

/**
 * ARADAKY GATLAK (Middleware)
 * ------------------------------------------------------------------
 * Iki wezipäni ýerine ýetirýär:
 *  1. Dili kesgitlemek — URL-de dil bolmasa, brauzeriň diline görä
 *     ugrukdyrýar (`/` → `/tm`).
 *  2. Admin bölümlerini goramak — `/{dil}/admin/...` salgylary diňe
 *     dogry rola eýe ulanyjy üçin açylýar.
 *
 * GORAG INDI HAKYKY.
 * Öň bu ýerde kukiniň BARLYGY barlanýardy (`ns_session=demo`), ýagny
 * islendik adam brauzeriň gurallarynda şol kukini ýazyp panele girip
 * bilerdi. Indi kuki HMAC-SHA256 goly bilen barlanýar: golsuz ýa-da
 * üýtgedilen kuki kabul edilmeýär.
 *
 * ⚠️ Bu gatlak **Edge gurşawynda** işleýär — faýl ulgamyna we
 * `node:crypto`-a elýeterliligi ýok. Şonuň üçin bu ýerde diňe golyň
 * matematiki barlagy geçirilýär. «Bu adam henizem sanawdamy?» diýen
 * ikinji barlag sahypanyň özünde (`getCurrentAdmin`) edilýär.
 */

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

/** Haýsy admin bölümi haýsy rola degişli */
const ADMIN_ROUTES: Record<string, AdminRole> = {
  satuw: 'sales',
  analitika: 'analytics',
  topar: 'owner',
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

/** Rol boýunça öý sahypasy — rugsat ýetmedik ýagdaýynda şoňa gaýtarylýar */
function homeFor(role: AdminRole, locale: string): string {
  return `/${locale}/admin/${role === 'analytics' ? 'analitika' : 'satuw'}`;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminMatch = pathname.match(/^\/(tm|ru|tr)\/admin\/([^/]+)/);
  if (adminMatch) {
    const [, locale, section] = adminMatch;

    /* Giriş sahypasynyň özi goralmaýar — ýogsam aýlaw ýapylmaýar */
    if (PUBLIC_ADMIN.has(section)) return intlMiddleware(request);

    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

    /* Giriş edilmedik bolsa — giriş sahypasyna, gelen ýerini ýatda saklap */
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/giris`;
      url.searchParams.set('yzyna', pathname);

      const response = NextResponse.redirect(url);
      /* Möhleti geçen ýa-da bozulan kuki bu ýerde arassalanýar */
      response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
      return response;
    }

    const requiredRole = ADMIN_ROUTES[section];

    /* Eýe (owner) ähli bölüme girýär; galanlar diňe öz bölümine */
    if (requiredRole && session.role !== 'owner' && session.role !== requiredRole) {
      const url = request.nextUrl.clone();
      url.pathname = homeFor(session.role, locale);
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  /* Statik faýllar we API ýollary aradaky gatlakdan geçmeýär */
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
