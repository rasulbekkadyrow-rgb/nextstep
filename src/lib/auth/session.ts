/**
 * SEANS BELGISI (session token) — GOL ÇEKILEN KUKI
 * ==================================================================
 * Näme üçin öz gurallarymyz, NextAuth däl?
 *  · Bize diňe bir zat gerek: «bu kuki hakykatdan hem biziň serwerimiz
 *    tarapyndan berildimi?» diýen sorag. Onuň jogaby HMAC-SHA256.
 *  · NextAuth bize gerek bolmadyk onlarça sazlama we üçünji tarap
 *    üpjünçileri getirýär. Az kod — az howp ýüzi.
 *
 * IŇ MÖHÜM TEHNIKI ŞERT: bu faýl `middleware.ts`-den hem çagyrylýar,
 * ýagny **Edge gurşawynda** işlemeli. Şonuň üçin bu ýerde `node:crypto`
 * ULANYLMAÝAR — diňe ähli gurşawlarda bar bolan Web Crypto
 * (`crypto.subtle`). Şol sebäpli funksiýalaryň hemmesi `async`.
 *
 * Belginiň gurluşy (JWT-e meňzeş, ýöne sada):
 *     base64url(JSON maglumat) . base64url(HMAC-SHA256 goly)
 *
 * Maglumatyň özi ŞIFRLENMEÝÄR — ol diňe gol bilen goralýar. Şonuň üçin
 * oňa syrly zat ýazylmaýar: diňe ulanyjynyň belgisi, e-poçtasy we roly.
 */

export type AdminRole = 'sales' | 'analytics' | 'owner';

export interface SessionPayload {
  /** Ulanyjynyň içerki belgisi */
  sub: string;
  email: string;
  role: AdminRole;
  /** Berlen wagty (sekunt) */
  iat: number;
  /** Möhleti gutarýan wagty (sekunt) */
  exp: number;
}

/** Kukiniň ady — ähli ýerde şu hemişelik ulanylýar */
export const SESSION_COOKIE = 'ns_session';

/** Seansyň dowamlylygy: 7 gün. Her girişde täzeden hasaplanýar. */
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

/**
 * Gol açary. Önümçilikde `AUTH_SECRET` HÖKMANY — ol bolmasa islendik
 * adam özüne «owner» kukisini ýasap bilerdi.
 *
 * Işläp düzüş wagtynda ýazgy ýazylýar we wagtlaýyn açar ulanylýar,
 * ýogsam her täzelenmede hemme çykarylardy.
 */
function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 16) return value;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'AUTH_SECRET kesgitlenmedik. Öndüriji açary `.env.local` faýlyna goşuň: ' +
        'openai däl-de, `openssl rand -base64 32` bilen döredilen tötänleýin setir.',
    );
  }
  return 'ns-dev-only-secret-change-me-in-production';
}

/* ---------------- base64url — Buffer-siz, Edge üçin ---------------- */

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/**
 * Deňeşdirmek WAGT boýunça durnukly bolmaly.
 * Adaty `===` ilkinji tapawutda durýar, şol bir ýerde hüjümçä goly
 * nyşan-nyşan çak etmäge mümkinçilik berýär. Bu ýerde uzynlyga garaşsyz
 * ähli baýtlar deňeşdirilýär.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Maglumaty gol bilen belgä öwürmek */
export async function signSession(
  data: Omit<SessionPayload, 'iat' | 'exp'>,
  ttlSeconds: number = SESSION_TTL_SECONDS,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { ...data, iat: now, exp: now + ttlSeconds };

  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(), new TextEncoder().encode(body));

  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

/**
 * Belgini barlamak. Şowsuz bolsa — `null`.
 * Sebäbi tapawutlandyrylmaýar: nädogry gol we gutaran möhlet üçin
 * jogap birmeňzeş bolmaly, ýogsam ol hüjümçä maglumat berýär.
 */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  try {
    const expected = toBase64Url(
      new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(), new TextEncoder().encode(body))),
    );
    if (!timingSafeEqual(signature, expected)) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.sub || !payload.email || !payload.role) return null;

    return payload;
  } catch {
    return null;
  }
}

/** Kukiniň sazlamalary — bir ýerde, ýogsam giriş bilen çykyş deň gelmeýär */
export function sessionCookieOptions(maxAge: number = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,               // JavaScript kukini okap bilmeýär (XSS goragy)
    sameSite: 'lax' as const,     // CSRF goragy, ýöne adaty geçişler işleýär
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}
