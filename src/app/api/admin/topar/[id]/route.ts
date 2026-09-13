import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { findAdminById, listAdmins, removeAdmin, updateAdmin } from '@/lib/auth/admins';
import { getCurrentAdmin, type CurrentAdmin } from '@/lib/auth/current';
import { isSameOrigin } from '@/lib/auth/request';

/**
 * /api/admin/topar/[id] — BIR DOLANDYRYJY
 * ==================================================================
 * PATCH  — ady, roly ýa-da işjeňligi üýtgetmek
 * DELETE — sanawdan aýyrmak
 *
 * ÜÇ GORAG DÜZGÜNI (ikisi hem «gapyny özüňe ýapmakdan» goraýar):
 *
 *  1. Eýe özüni pozup ýa-da öz rolyny peseldip bilmeýär.
 *  2. Iň soňky işjeň `owner` ýapylyp bilmeýär — ýogsam dolandyryjy
 *     goşmaga hukugy bolan adam galmaýar.
 *  3. `ADMIN_EMAILS` gurşaw üýtgeýjisinden gelen ýazgy panelden
 *     pozulmaýar: ol ätiýaçlyk açar hökmünde saklanýar.
 */

export const runtime = 'nodejs';

const patchSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  role: z.enum(['sales', 'analytics', 'owner']).optional(),
  active: z.boolean().optional(),
});

/** Netije `NextResponse` bolsa — rugsat ýok, ol göni gaýtarylýar */
async function requireOwner(): Promise<CurrentAdmin | NextResponse> {
  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (current.user.role !== 'owner') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return current;
}

/** Bu üýtgetmeden soň işjeň eýe galýarmy? */
async function wouldRemoveLastOwner(targetId: string, next: { role?: string; active?: boolean }) {
  const admins = await listAdmins();
  const owners = admins.filter((admin) => admin.role === 'owner' && admin.active);
  if (owners.length > 1) return false;

  /* Diňe rol eýelikden aýrylanda ýa-da hasap ýapylanda howp bar.
     Diňe at üýtgedilende bu barlag päsgel bermeli däl. */
  const losesOwner = (next.role !== undefined && next.role !== 'owner') || next.active === false;
  return losesOwner && owners.some((admin) => admin.id === targetId);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'bad_origin' }, { status: 403 });

  const guard = await requireOwner();
  if (guard instanceof NextResponse) return guard;

  const { id } = await context.params;
  const target = await findAdminById(id);
  if (!target) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'validation_failed' }, { status: 422 });

  if (guard.user.id === id && (parsed.data.role !== undefined || parsed.data.active === false)) {
    return NextResponse.json({ error: 'self_change' }, { status: 409 });
  }

  if (await wouldRemoveLastOwner(id, parsed.data)) {
    return NextResponse.json({ error: 'last_owner' }, { status: 409 });
  }

  await updateAdmin(id, parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'bad_origin' }, { status: 403 });

  const guard = await requireOwner();
  if (guard instanceof NextResponse) return guard;

  const { id } = await context.params;
  if (guard.user.id === id) return NextResponse.json({ error: 'self_change' }, { status: 409 });

  const target = await findAdminById(id);
  if (!target) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (target.protected) return NextResponse.json({ error: 'protected' }, { status: 409 });

  if (await wouldRemoveLastOwner(id, { active: false })) {
    return NextResponse.json({ error: 'last_owner' }, { status: 409 });
  }

  await removeAdmin(id);
  return NextResponse.json({ ok: true });
}
