import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * ÝÖNEKEÝ FAÝL GORY (JSON)
 * ==================================================================
 * Taslamada entek hakyky maglumat gory ýok (`mock-data.ts` görkezme
 * maglumat). Emma GIRIŞ ULGAMY görkezme bolup bilmeýär: dolandyryjylaryň
 * sanawy we iberilen kodlar serweriň täzelenmesinden soň hem galmaly.
 *
 * Şonuň üçin aralyk çözgüt: `.data/` bukjasynda JSON faýllar.
 *  · Bir serwerde (VPS, Docker) doly ýeterlik.
 *  · Kody üýtgetmezden gora geçmek üçin ähli okamak/ýazmak diňe şu
 *    faýlyň içinden geçýär — soňra bu iki funksiýa SQL soraglaryna
 *    çalşylýar, galan kod bolsa durşuna galýar.
 *
 * ⚠️ Vercel ýaly «serwersiz» gurşawda faýl ulgamy diňe okalýar.
 * Ol ýere çykylanda `readJson`/`writeJson` Redis ýa-da Postgres bilen
 * çalşyrylmalydyr — başga hiç ýeri üýtgetmeli däl.
 */

const DATA_DIR = process.env.NS_DATA_DIR ?? path.join(process.cwd(), '.data');

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

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    /* Faýl entek ýok ýa-da bozulan — başlangyç bahasy gaýtarylýar */
    return fallback;
  }
}

export async function writeJson<T>(file: string, value: T): Promise<void> {
  await enqueue(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });

    /* Wagtlaýyn faýla ýazyp, soňra çalyşmak: ýazgynyň ortasynda
       elektrik kesilse-de, esasy faýl ýarym galmaýar. */
    const target = path.join(DATA_DIR, file);
    const temp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(temp, JSON.stringify(value, null, 2), 'utf8');
    await fs.rename(temp, target);
  });
}

/** Okap → üýtgedip → ýazmak. Nobatyň içinde bolany üçin howpsuz. */
export async function updateJson<T>(file: string, fallback: T, mutate: (current: T) => T): Promise<T> {
  return enqueue(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const target = path.join(DATA_DIR, file);

    let current = fallback;
    try {
      current = JSON.parse(await fs.readFile(target, 'utf8')) as T;
    } catch {
      /* başlangyç ýagdaý */
    }

    const next = mutate(current);
    const temp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(temp, JSON.stringify(next, null, 2), 'utf8');
    await fs.rename(temp, target);
    return next;
  });
}
