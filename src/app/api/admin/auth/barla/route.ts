import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  addAdmin,
  findAdminByEmail,
  isSetupMode,
  listAdmins,
  normalizeEmail,
  touchLogin,
} from '@/lib/auth/admins';
import { isIpRateLimited, verifyCode } from '@/lib/auth/otp';
import { SESSION_COOKIE, sessionCookieOptions, signSession, type AdminRole } from '@/lib/auth/session';

/**
 * POST /api/admin/auth/barla — KODY BARLAMAK WE SEANSY AÇMAK
 * ==================================================================
 * Ädim 2: poçtadan gelen 6 sanly kod barlanýar. Dogry bolsa, gol
 * çekilen kuki goýulýar we ulanyjy öz paneline ugradylýar.
 *
 * Ýalňyşlyklaryň jogaby BU ÝERDE anyk — ädim 1-den tapawutlylykda.
 * Sebäbi bu ýere ýeten adam eýýäm e-poçtasyny ýazypdyr we kod
 * garaşýar: «kod ýalňyş» bilen «kodyň möhleti geçdi» tapawudy oňa
 * näme etmelidigini görkezýär. Bu ýerde maglumat syzmasy ýok —
 * kody bilmedik adam üçin ähli jogap birmeňzeş netije berýär.
 */

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email().max(160),
  code: z.string().regex(/^\d{6}$/),
  locale: z.enum(['tm', 'ru', 'tr']).default('tm'),
  back: z.string().max(200).optional(),
});

/** Rol boýunça öý sahypasy */
function homeFor(role: AdminRole, locale: string): string {
  return `/${locale}/admin/${role === 'analytics' ? 'analitika' : 'satuw'}`;
}

/**
 * AÇYK GÖNÜKDIRME (open redirect) GORAGY.
 * `back` URL-den gelýär, ýagny oňa daşarky salgy hem ýazylyp bilner.
 * Şonuň üçin ol göni ulanylmaýar: diňe içerki admin ýoly kabul edilýär.
 */
function safeTarget(back: string | undefined, role: AdminRole, locale: string): string {
  const fallback = homeFor(role, locale);
  if (!back) return fallback;
  if (!/^\/(tm|ru|tr)\/admin\/(satuw|analitika|topar)$/.test(back)) return fallback;

  /* Rugsady bolmadyk bölüme gaýtarmagyň manysy ýok */
  if (role !== 'owner') {
    if (back.includes('/satuw') && role !== 'sales') return fallback;
    if (back.includes('/analitika') && role !== 'analytics') return fallback;
    if (back.includes('/topar')) return fallback;
  }
  return back;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isIpRateLimited(ip)) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_code' }, { status: 422 });

  const email = normalizeEmail(parsed.data.email);
  const locale = parsed.data.locale;

  const result = await verifyCode(email, parsed.data.code);

  if (result !== 'ok') {
    const status = result === 'locked' ? 429 : 401;
    return NextResponse.json({ error: result }, { status });
  }

  /* Kod dogry. Indi şahsyýet barlanýar: kod iberilenden bäri adam
     sanawdan aýrylan bolmagy mümkin. */
  const admins = await listAdmins();
  let admin = await findAdminByEmail(email);

  if (!admin && isSetupMode(admins.length)) {
    /* Sazlama tertibi (diňe işläp düzüşde): ilkinji giren adam eýe
       bolýar we sanawa ýazylýar — şondan soň sazlama tertibi ýapylýar. */
    admin = await addAdmin({ email, role: 'owner' });
  }

  if (!admin || !admin.active) {
    return NextResponse.json({ error: 'not_allowed' }, { status: 403 });
  }

  const token = await signSession({ sub: admin.id, email: admin.email, role: admin.role });
  await touchLogin(admin);

  const response = NextResponse.json({
    ok: true,
    role: admin.role,
    name: admin.name,
    redirect: safeTarget(parsed.data.back, admin.role, locale),
  });

  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

  /* Köne görkezme kukisi galan bolsa — aýrylýar (indi rol golda saklanýar) */
  response.cookies.set('ns_role', '', { path: '/', maxAge: 0 });

  return response;
}
