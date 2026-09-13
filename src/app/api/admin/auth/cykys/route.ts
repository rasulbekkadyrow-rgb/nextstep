import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session';

/**
 * POST /api/admin/auth/cykys — SEANSY ÝAPMAK
 * ==================================================================
 * Kuki pozulýar. Serwerde saklanýan «seanslar tablisasy» ýok, sebäbi
 * seans golda saklanýar — şonuň üçin çykmak üçin diňe kukini aýyrmak
 * ýeterlik.
 *
 * `POST` saýlandy, `GET` däl: brauzerler we poçta müşderileri
 * sahypadaky suratlary öňünden ýükleýär. `GET /cykys` bolan bolsa,
 * şeýle öňünden ýükleme adamy tötänden ulgamdan çykarardy.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  response.cookies.set('ns_role', '', { path: '/', maxAge: 0 });

  return response;
}
