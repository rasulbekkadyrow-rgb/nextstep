import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind synplaryny howpsuz birleşdirmek (gapma-garşylyklar aýrylýar) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Sany ýerli görnüşde görkezmek: 7184 → «7 184» */
export function formatNumber(value: number, locale: string) {
  const map: Record<string, string> = { tm: 'tk-TM', ru: 'ru-RU', tr: 'tr-TR' };
  return new Intl.NumberFormat(map[locale] ?? 'ru-RU').format(value);
}

/** Möhlete çenli galan gün — ýakynlaşan möhletleri bellemek üçin */
export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

/** Wagt aralygyny adam okarlyk görnüşe getirmek: 5400 → «1 sag 30 min» */
export function formatDuration(seconds: number, labels: { h: string; m: string }) {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h} ${labels.h} ${m} ${labels.m}` : `${m} ${labels.m}`;
}

/** Göterimiň üýtgemegini nyşan bilen: +12,4% / −3,1% */
export function formatDelta(delta: number) {
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : '';
  return `${sign}${Math.abs(delta).toFixed(1).replace('.', ',')}%`;
}

/**
 * Terjimäniň dolulygyny hasaplamak.
 * Mazmun panelinde «Terjimäniň dolulygy» görkezijisi şu funksiýa esaslanýar.
 */
export function translationCompleteness(obj: Record<string, unknown>, locales: string[]) {
  let total = 0;
  let filled = 0;
  const walk = (node: unknown) => {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      const record = node as Record<string, unknown>;
      const isLocalized = locales.every((l) => l in record);
      if (isLocalized) {
        for (const l of locales) {
          total += 1;
          if (typeof record[l] === 'string' && (record[l] as string).trim().length > 0) filled += 1;
        }
        return;
      }
      Object.values(record).forEach(walk);
    } else if (Array.isArray(node)) {
      node.forEach(walk);
    }
  };
  walk(obj);
  return total === 0 ? 100 : Math.round((filled / total) * 100);
}

/** Skroll pozisiýasyny 0–1 aralygyna getirmek (progress animasiýalary üçin) */
export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
