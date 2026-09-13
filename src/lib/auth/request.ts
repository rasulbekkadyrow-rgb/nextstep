import type { NextRequest } from 'next/server';

/**
 * CSRF ÜÇIN ÇEŞME BARLAGY
 * ------------------------------------------------------------------
 * Esasy gorag — kukiniň `SameSite=Lax` bolmagy: daşarky saýtdan
 * ýazylan POST soragyna brauzer biziň kukimizi goşmaýar.
 *
 * Bu ikinji gatlak: `Origin` başlygy biziň domenimiz bolmaly.
 * Başlyk düýbünden ýok bolsa, sorag brauzerden gelmeýär (curl, skript)
 * — ol ýagdaýda kuki hem bolmaýar, ýagny howp döremeýär.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === request.nextUrl.origin;
}
