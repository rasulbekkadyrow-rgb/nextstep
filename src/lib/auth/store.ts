import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * KIÇIJIK MAGLUMAT GORY — IKI SÜRÜJILI
 * ==================================================================
 * Giriş ulgamy iki zady saklamaly: dolandyryjylaryň sanawy we iberilen
 * kodlaryň ýygyndysy. Bular serweriň täzelenmesinden soň hem galmaly —
 * ýagny `mock-data.ts` ýaly görkezme bolup bilmeýär.
 *
 * Emma saklanýan ýer gurşawa bagly:
 *
 *   FAÝL (`.data/*.json`)  — ýerli kompýuterde we öz serweriňde (VPS).
 *                            Hiç hili sazlama gerek däl.
 *
 *   REDIS (HTTP arkaly)    — VERCEL we beýleki «serwersiz» gurşawlarda.
 *                            Ol ýerde faýl ulgamy DIŇE OKALÝAR: faýla
 *                            ýazjak bolsaň, giriş düýbünden işlemeýär.
 *                            Üstesine her sorag başga nusgada işlemegi
 *                            mümkin — bir nusganyň ýadyndaky kod
 *                            beýlekisine görünmeýär.
 *
 * Sürüji AWTOMATIK saýlanýar: gurşawda Redis açarlary bar bolsa — Redis,
 * ýogsam faýl. Şonuň üçin kody üýtgetmän, şol bir taslama hem noutbukda,
 * hem Vercel-de işleýär.
 *
 * Redis üçin kitaphana goşulmady: Upstash/Vercel KV adaty HTTP arkaly
 * işleýär, ýagny `fetch` ýeterlik. Az bagly kod — az mesele.
 */

const DATA_DIR = process.env.NS_DATA_DIR ?? path.join(process.cwd(), '.data');

/** Açarlaryň öňündäki at — bir gorda birnäçe taslama bolsa çaknyşmaz ýaly */
const PREFIX = process.env.NS_KV_PREFIX ?? 'nextstep';

function redisConfig(): { url: string; token: string } | null {
  /* Vercel KV we Upstash şol bir REST-i dürli atlar bilen berýär */
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

/** Haýsy sürüji işleýär — ýazgy we anyklaýyş üçin */
export function storageDriver(): 'redis' | 'file' {
  return redisConfig() ? 'redis' : 'file';
}

/* ================= REDIS (HTTP) ================= */

async function redisCommand<T>(command: unknown[]): Promise<T | null> {
  const config = redisConfig();
  if (!config) return null;

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    /* Keş bolmaly däl: giriş kody hemişe täze okalmaly */
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`kv_failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as { result: T };
  return data.result;
}

/* ================= FAÝL ================= */

/**
 * ÝAZGYLARYŇ NOBATY.
 * Iki sorag bir wagtda gelse (mysal üçin iki dolandyryjy bir wagtda
 * kod sorasa), ikisi-de faýly okap, soňra biri beýlekisiniň üstünden
 * ýazyp bilerdi — maglumat ýitýär. Nobat şony aradan aýyrýar:
 * ýazgylar biri-biriniň yzyndan ýerine ýetirilýär.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task, task);
  queue = result.catch(() => undefined);
  return result;
}

async function fileRead(file: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(DATA_DIR, file), 'utf8');
  } catch {
    return null;
  }
}

async function fileWrite(file: string, contents: string): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  /* Wagtlaýyn faýla ýazyp, soňra çalyşmak: ýazgynyň ortasynda
     elektrik kesilse-de, esasy faýl ýarym galmaýar. */
  const target = path.join(DATA_DIR, file);
  const temp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temp, contents, 'utf8');
  await fs.rename(temp, target);
}

/* ================= UMUMY API =================
   Aşakdaky üç funksiýa taslamanyň galan böleginiň görýän ýeke-täk
   ýüzi. Sürüji üýtgände olaryň ady-da, işleýşi-de üýtgemeýär. */

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = redisConfig()
      ? await redisCommand<string | null>(['GET', `${PREFIX}:${file}`])
      : await fileRead(file);

    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    /* Ýazgy entek ýok ýa-da bozulan — başlangyç bahasy gaýtarylýar */
    return fallback;
  }
}

export async function writeJson<T>(file: string, value: T): Promise<void> {
  const contents = JSON.stringify(value, null, 2);

  if (redisConfig()) {
    await redisCommand(['SET', `${PREFIX}:${file}`, contents]);
    return;
  }
  await enqueue(() => fileWrite(file, contents));
}

/**
 * Okap → üýtgedip → ýazmak.
 *
 * Faýl sürüjisinde bu amal nobatyň içinde, ýagny doly howpsuz.
 * Redis-de bolsa iki ädimiň arasynda başga sorag girip biler. Iki-üç
 * dolandyryjyly gullukda bu ähtimallyk ujypsyz; ýüzlerçe ulanyjy
 * bolanda bu ýer Lua skripti ýa-da `WATCH` bilen çalşyrylmalydyr.
 */
export async function updateJson<T>(file: string, fallback: T, mutate: (current: T) => T): Promise<T> {
  if (redisConfig()) {
    const current = await readJson<T>(file, fallback);
    const next = mutate(current);
    await writeJson(file, next);
    return next;
  }

  return enqueue(async () => {
    const raw = await fileRead(file);
    let current = fallback;
    try {
      if (raw) current = JSON.parse(raw) as T;
    } catch {
      /* bozulan faýl — başlangyç ýagdaýdan dowam edilýär */
    }

    const next = mutate(current);
    await fileWrite(file, JSON.stringify(next, null, 2));
    return next;
  });
}
