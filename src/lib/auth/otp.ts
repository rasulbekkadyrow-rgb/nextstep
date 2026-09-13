import { readJson, updateJson } from './store';

/**
 * BIR GEZEKLIK KOD (OTP)
 * ==================================================================
 * Instagram, Telegram we banklaryň ulanýan usuly: parol ýerine
 * e-poçta iberilýän 6 sanly kod. Näme üçin bu ýerde has howpsuz?
 *
 *  · Parol ogurlansa — hemişelik açar bolýar. Kod 10 minutdan soň
 *    öçýär we diňe bir gezek işleýär.
 *  · Işgär işden gitse, parol çalyşmaly däl — salgysy sanawdan aýrylýar.
 *  · Dolandyryjy parol ýatda saklamaly däl: e-poçtasyna girip bilýän
 *    bolsa, panele hem girýär.
 *
 * GORAG GATLAKLARY
 *  1. Kod AÇYK saklanmaýar. Diňe SHA-256 ýygyndysy (hash) ýazylýar —
 *     `.data/otp.json` faýlyny okan adam hem kody bilip bilmeýär.
 *  2. Her kod üçin 5 synanyşyk. Ondan soň kod ýatyrylýar — 6 sanly
 *     kody nokat-nokat çak etmek mümkin däl.
 *  3. Täze kod 60 sekuntdan öň iberilmeýär (poçta ýagdyrmagyň öňi).
 *  4. Bir salga sagatda 5 kod — artykmajy ret edilýär.
 *  5. Kod dogry bolan badyna pozulýar — gaýtadan ulanyp bolmaýar.
 */

export interface OtpRecord {
  hash: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  sentAt: number;
  /** Sagatlyk penjirede näçe kod soraldy */
  requestCount: number;
  windowStart: number;
}

const FILE = 'otp.json';

export const CODE_LENGTH = 6;
export const CODE_TTL_MS = 10 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 60 * 1000;
export const MAX_ATTEMPTS = 5;
const MAX_REQUESTS_PER_WINDOW = 5;
const REQUEST_WINDOW_MS = 60 * 60 * 1000;

type Store = Record<string, OtpRecord>;

/** Möhleti gutaran ýazgylary aýyrmak — faýl çäksiz ösmez ýaly */
function prune(store: Store, now: number): Store {
  const next: Store = {};
  for (const [email, record] of Object.entries(store)) {
    const stale = record.expiresAt < now && now - record.windowStart > REQUEST_WINDOW_MS;
    if (!stale) next[email] = record;
  }
  return next;
}

/**
 * 6 sanly kod. `Math.random()` ULANYLMAÝAR — ol çak edip bolýar.
 * Kriptografik tötänlik + «ret etmek» usuly bilen sanlaryň paýlanyşy
 * deň saklanýar (modul galyndysy käbir sanlary ýygylaşdyrýar).
 */
function generateCode(): string {
  const digits: string[] = [];
  const buffer = new Uint8Array(CODE_LENGTH * 2);

  while (digits.length < CODE_LENGTH) {
    crypto.getRandomValues(buffer);
    for (const byte of buffer) {
      if (byte >= 250) continue;          // 250–255 deňsizlik döredýär
      digits.push(String(byte % 10));
      if (digits.length === CODE_LENGTH) break;
    }
  }
  return digits.join('');
}

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashCode(code: string, salt: string, email: string): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? 'ns-dev-only-secret-change-me-in-production';
  const data = new TextEncoder().encode(`${email}:${code}:${salt}:${secret}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export type IssueResult =
  | { ok: true; code: string; expiresAt: number; resendAfter: number }
  | { ok: false; reason: 'cooldown' | 'too_many'; retryAfter: number };

/** Täze kod döretmek (iberilmegi çagyrýan tarapyň işi) */
export async function issueCode(email: string): Promise<IssueResult> {
  const now = Date.now();
  const key = email.toLowerCase();

  const current = (await readJson<Store>(FILE, {}))[key];

  if (current) {
    if (now - current.sentAt < RESEND_COOLDOWN_MS) {
      return {
        ok: false,
        reason: 'cooldown',
        retryAfter: Math.ceil((RESEND_COOLDOWN_MS - (now - current.sentAt)) / 1000),
      };
    }
    const windowActive = now - current.windowStart < REQUEST_WINDOW_MS;
    if (windowActive && current.requestCount >= MAX_REQUESTS_PER_WINDOW) {
      return {
        ok: false,
        reason: 'too_many',
        retryAfter: Math.ceil((current.windowStart + REQUEST_WINDOW_MS - now) / 1000),
      };
    }
  }

  const code = generateCode();
  const salt = randomSalt();
  const hash = await hashCode(code, salt, key);

  const windowActive = current && now - current.windowStart < REQUEST_WINDOW_MS;
  const record: OtpRecord = {
    hash,
    salt,
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    sentAt: now,
    requestCount: windowActive ? current.requestCount + 1 : 1,
    windowStart: windowActive ? current.windowStart : now,
  };

  await updateJson<Store>(FILE, {}, (store) => ({ ...prune(store, now), [key]: record }));

  return {
    ok: true,
    code,
    expiresAt: record.expiresAt,
    resendAfter: Math.ceil(RESEND_COOLDOWN_MS / 1000),
  };
}

export type VerifyResult = 'ok' | 'invalid' | 'expired' | 'locked' | 'not_found';

export async function verifyCode(email: string, code: string): Promise<VerifyResult> {
  const now = Date.now();
  const key = email.toLowerCase();
  const store = await readJson<Store>(FILE, {});
  const record = store[key];

  if (!record) return 'not_found';
  if (record.expiresAt < now) return 'expired';
  if (record.attempts >= MAX_ATTEMPTS) return 'locked';

  const candidate = await hashCode(code.trim(), record.salt, key);

  if (candidate !== record.hash) {
    const attempts = record.attempts + 1;
    await updateJson<Store>(FILE, {}, (current) => ({
      ...current,
      [key]: { ...(current[key] ?? record), attempts },
    }));
    return attempts >= MAX_ATTEMPTS ? 'locked' : 'invalid';
  }

  /* Dogry kod derrew pozulýar — ikinji gezek ulanyp bolmaýar */
  await clearCode(key);
  return 'ok';
}

export async function clearCode(email: string): Promise<void> {
  const key = email.toLowerCase();
  await updateJson<Store>(FILE, {}, (store) => {
    const next = { ...store };
    delete next[key];
    return next;
  });
}

/**
 * IP boýunça tizlik çägi — bir kompýuterden dürli salgylara köpçülikleýin
 * kod soralmagynyň öňüni alýar. Ýady ulanýar: serwer täzelense
 * nollanýar, emma hüjüm hemişe gysga wagtda bolýar.
 */
const ipLog = new Map<string, number[]>();
const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX = 12;

export function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipLog.get(ip) ?? []).filter((time) => now - time < IP_WINDOW_MS);
  hits.push(now);
  ipLog.set(ip, hits);
  return hits.length > IP_MAX;
}
