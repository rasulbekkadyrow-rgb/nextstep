import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { notifyNewLead } from '@/lib/telegram';
import { TELEGRAM_DEFAULTS } from '@/lib/mock-data';
import type { Lead } from '@/lib/types';

/**
 * POST /api/leads — SAÝTDAN GELÝÄN TALYP ÝÜZTUTMALARYNY KABUL ETMEK
 * ==================================================================
 * Işleýiş tertibi:
 *   1. Maglumatlary barlamak (serwerde gaýtadan — brauzere ynanylmaýar).
 *   2. Ýönekeý spam goragy: «bal gaby» (honeypot) meýdany we tizlik çägi.
 *   3. Maglumat gorunda saklamak.
 *   4. Telegram bildirişini ibermek.
 *
 * MÖHÜM: 4-nji ädim şowsuz bolsa-da, ulanyja ýalňyşlyk görkezilmeýär.
 * Sebäbi arza eýýäm gora ýazyldy — Telegram-yň näsazlygy müşderiniň
 * meselesi däl. Bildiriş soňra gaýtadan synanyşylýar.
 */

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(24),
  gradYear: z.string().min(1).max(40),
  program: z.string().max(80).optional(),
  targetUniversity: z.string().max(80).optional(),
  channel: z.string().max(40).optional(),
  message: z.string().max(600).optional(),
  locale: z.enum(['tm', 'ru', 'tr']),
  source: z.enum(['instagram', 'site', 'referral', 'whatsapp', 'call']).default('site'),
  /* Bal gaby: adam muny görmeýär, robot bolsa doldurýar */
  website: z.string().max(0).optional(),
});

/** Ýönekeý tizlik çägi (rate limit). Önümçilikde Redis / Upstash ulanylmaly. */
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  /* Bal gaby doldurylan bolsa — bu robot. Ýalňyşlyk görkezmeýäris,
     ýogsam robot usuly üýtgeder. Diňe sessiz «üstünlik» gaýtarýarys. */
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const lead: Lead = {
    id: `NS-${Date.now().toString(36).toUpperCase()}`,
    ...parsed.data,
    program: parsed.data.program ?? '',
    stage: 'new',
    priority: derivePriority(parsed.data.gradYear),
    assigneeId: 'u1',
    documents: { passport: false, diploma: false, transcript: false, photo: false },
    createdAt: new Date().toISOString(),
    tags: [],
    notes: [],
  };

  /* --- 3-nji ädim: gora ýazmak ---
     Önümçilikde:
       await db.insert(leads).values(lead);
     Häzirlikçe diňe žurnala ýazýarys. */
  console.info('[lead] Täze ýüztutma kabul edildi:', lead.id, lead.name, lead.program);

  /* --- 4-nji ädim: bildiriş (arzanyň ykbalyna täsir etmeýär) --- */
  if (TELEGRAM_DEFAULTS.events.newLead) {
    void notifyNewLead(lead, TELEGRAM_DEFAULTS.template);
  }

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}

/**
 * Ilerlik derejesi mekdebi gutarýan ýyla görä kesgitlenýär.
 *
 * Mantyk: şu ýyl ýa-da geçen ýyl gutaran talybyň möhleti gysgalýar —
 * arza möwsümi ýapylmanka ýetişmeli. Öňki ýyllaryň uçurymlary bolsa
 * adatça indiki okuw ýylyna taýýarlanýar, şonuň üçin olar biraz
 * garaşyp bilýär.
 */
function derivePriority(gradYear: string): 'high' | 'medium' | 'low' {
  const year = Number(gradYear.match(/\d{4}/)?.[0] ?? 0);
  const current = new Date().getFullYear();
  if (year >= current) return 'high';
  if (year === current - 1) return 'medium';
  return 'low';
}
