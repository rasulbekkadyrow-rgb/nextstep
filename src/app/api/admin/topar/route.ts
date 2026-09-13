import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { addAdmin, listAdmins } from '@/lib/auth/admins';
import { getCurrentAdmin } from '@/lib/auth/current';
import { isSameOrigin } from '@/lib/auth/request';

/**
 * /api/admin/topar — DOLANDYRYJYLARY DOLANDYRMAK
 * ==================================================================
 * GET  — sanawy almak
 * POST — täze dolandyryjy goşmak
 *
 * Diňe `owner` roly üçin. Näme üçin? Sebäbi bu ýol arkaly islendik
 * e-poçta panele doly elýeterlilik alyp bilýär — ýagny bu ulgamdaky
 * iň güýçli hereket. Ony satuw ýa-da seljerme dolandyryjysyna bermek
 * rol bölünişigini manysyz ederdi.
 *
 * CSRF GORAGY: kuki `SameSite=Lax` bolany üçin daşarky saýtdan gelen
 * POST soragyna kuki goşulmaýar. Goşmaça gatlak hökmünde `Origin`
 * başlygy hem barlanýar — iki gorag biri-birini goldaýar.
 */

export const runtime = 'nodejs';

const createSchema = z.object({
  email: z.string().email().max(160),
  name: z.string().max(80).optional(),
  role: z.enum(['sales', 'analytics', 'owner']),
});

export async function GET() {
  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (current.user.role !== 'owner') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  return NextResponse.json({ admins: await listAdmins() });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'bad_origin' }, { status: 403 });

  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (current.user.role !== 'owner') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'validation_failed' }, { status: 422 });

  try {
    const user = await addAdmin({ ...parsed.data, createdBy: current.user.email });
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'already_exists') {
      return NextResponse.json({ error: 'already_exists' }, { status: 409 });
    }
    throw error;
  }
}
