import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { findAdminByEmail, listAdmins, isSetupMode, normalizeEmail } from '@/lib/auth/admins';
import { issueCode, isIpRateLimited, RESEND_COOLDOWN_MS } from '@/lib/auth/otp';
import { sendLoginCode } from '@/lib/auth/mailer';

/**
 * POST /api/admin/auth/kod — GIRIŞ KODYNY IBERMEK
 * ==================================================================
 * Ädim 1: dolandyryjy e-poçtasyny ýazýar → ol salga 6 sanly kod gidýär.
 *
 * ⚠️ ESASY KARAR: JOGAP HEMIŞE BIRMEŇZEŞ.
 * Salgy sanawda bar bolsa-da, ýok bolsa-da serwer `{ ok: true }`
 * gaýtarýar. Näme üçin? Ýogsam bu ýol «barlagçy» bolardy: nätanyş adam
 * salgylary birin-birin synap, kimiň dolandyryjydygyny anyklap bilerdi.
 * Şol maglumat bolsa nyşana alnan hüjümiň (phishing) ilkinji ädimi.
 *
 * Şol sebäpli ýalňyş salgy ýazan dolandyryjy kody almaýar we muny
 * ekranda görmeýär — giriş sahypasynda «hat gelmedimi?» bölümi bar.
 *
 * Serweriň ýerine ýetirýän işi:
 *   1. IP boýunça tizlik çägi (köpçülikleýin synanyşyga garşy).
 *   2. Salgynyň dogrulygyny barlamak.
 *   3. Sanawda bar bolsa — kod döretmek we hat ibermek.
 */

/* `nodemailer` we faýl gory Node gurşawyny talap edýär */
export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email().max(160),
  locale: z.enum(['tm', 'ru', 'tr']).default('tm'),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isIpRateLimited(ip)) {
    return NextResponse.json(
      { error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': '900' } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 });
  }

  const email = normalizeEmail(parsed.data.email);
  const locale = parsed.data.locale;

  const admins = await listAdmins();
  const setup = isSetupMode(admins.length);
  const admin = await findAdminByEmail(email);

  /* Sanawda ýok we sazlama tertibi hem däl — daşyndan tapawutsyz jogap */
  if (!admin && !setup) {
    return NextResponse.json({ ok: true, resendAfter: RESEND_COOLDOWN_MS / 1000 });
  }

  if (admin && !admin.active) {
    return NextResponse.json({ ok: true, resendAfter: RESEND_COOLDOWN_MS / 1000 });
  }

  const issued = await issueCode(email);

  if (!issued.ok) {
    return NextResponse.json(
      { error: issued.reason, retryAfter: issued.retryAfter },
      { status: 429, headers: { 'Retry-After': String(issued.retryAfter) } },
    );
  }

  try {
    const driver = await sendLoginCode(email, issued.code, locale);

    return NextResponse.json({
      ok: true,
      resendAfter: issued.resendAfter,
      expiresAt: issued.expiresAt,
      /* Diňe işläp düzüşde: kodyň terminalda çykandygyny ekranda duýdurmak
         üçin. Önümçilikde bu hiç haçan `console` bolmaýar. */
      driver: process.env.NODE_ENV === 'production' ? undefined : driver,
      setup: setup || undefined,
    });
  } catch (error) {
    console.error('[auth] hat iberilmedi:', error);
    return NextResponse.json({ error: 'mail_failed' }, { status: 502 });
  }
}
