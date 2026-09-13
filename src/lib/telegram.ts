import type { Lead } from './types';

/**
 * TELEGRAM BOT API — SERWER TARAPY
 * ==================================================================
 * HOWPSUZLYK DÜZGÜNI: bu faýl diňe serwerde işleýär. Bot açary
 * (`TELEGRAM_BOT_TOKEN`) hiç haçan brauzere iberilmeýär. Şonuň üçin
 * bu faýly `'use client'` bolan komponentden çagyrmak gadagan —
 * diňe API ýollaryndan (`/api/...`) ulanylmaly.
 *
 * Zerur gurşaw üýtgeýjileri (`.env.local`):
 *   TELEGRAM_BOT_TOKEN=123456:AAE...          ← @BotFather-den alynýar
 *   TELEGRAM_CHAT_ID=-1002xxxxxxxxx           ← kanalyň ýa toparyň ID-si
 */

const API_BASE = 'https://api.telegram.org';

/** Telegram-yň MarkdownV2 formatynda ýörite manyly nyşanlary goramak */
function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

/**
 * Nusgadaky {name}, {phone} ýaly ýerleri hakyky maglumat bilen çalyşmak.
 * Nusga admin panelinde üýtgedilýär — kody täzeden ýazmak gerek däl.
 *
 * Elýeterli ýerler:
 *   {name} {phone} {gradYear} {program} {university}
 *   {source} {message} {locale} {time} {id}
 */
export function renderTemplate(template: string, lead: Lead): string {
  const localeNames: Record<string, string> = { tm: 'Türkmen', ru: 'Rus', tr: 'Türk' };

  const values: Record<string, string> = {
    name: lead.name,
    phone: lead.phone,
    gradYear: lead.gradYear,
    program: lead.program || '—',
    university: lead.targetUniversity || '—',
    source: lead.source,
    message: lead.message || '—',
    locale: localeNames[lead.locale] ?? lead.locale,
    time: new Date(lead.createdAt).toLocaleString('ru-RU', { timeZone: 'Asia/Ashgabat' }),
    id: lead.id,
  };

  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    escapeMarkdown(values[key] ?? `{${key}}`),
  );
}

/**
 * Kanala habar ibermek.
 * Ýalňyşlyk ýüze çyksa, arzanyň özi ýitmeli däl — şonuň üçin bu
 * funksiýa hiç haçan «ýykylmaýar», diňe `false` gaýtarýar.
 */
export async function sendTelegramMessage(
  text: string,
  options: { silent?: boolean } = {},
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[telegram] Gurşaw üýtgeýjileri bellenilmedik — habar iberilmedi.');
    return false;
  }

  try {
    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'MarkdownV2',
        disable_notification: options.silent ?? false,
      }),
      /* 5 sekuntdan uzaga çekse, arzany togtatmaly däl */
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error('[telegram] API ýalňyşlygy:', await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('[telegram] Iberip bolmady:', error);
    return false;
  }
}

/** Täze ýüztutma barada bildiriş */
export async function notifyNewLead(lead: Lead, template: string) {
  const text = renderTemplate(template, lead);
  return sendTelegramMessage(text);
}

/** Tapgyr üýtgände gysga bildiriş */
export async function notifyStageChange(lead: Lead, from: string, to: string) {
  const text = [
    '🔄 *Tapgyr üýtgedi*',
    `👤 ${escapeMarkdown(lead.name)} \\(${escapeMarkdown(lead.program)}\\)`,
    `${escapeMarkdown(from)} → *${escapeMarkdown(to)}*`,
  ].join('\n');

  return sendTelegramMessage(text, { silent: true });
}

/** Günüň ahyryndaky jemleýji hasabat */
export async function sendDailyDigest(stats: {
  newLeads: number;
  meetings: number;
  won: number;
  revenue: string;
}) {
  const text = [
    '📊 *Günlük jemleýji hasabat*',
    '',
    `🆕 Täze arzalar: *${stats.newLeads}*`,
    `📅 Bellenen duşuşyklar: *${stats.meetings}*`,
    `✅ Baglaşylan şertnamalar: *${stats.won}*`,
    `💰 Girdeji: *${escapeMarkdown(stats.revenue)}*`,
  ].join('\n');

  return sendTelegramMessage(text);
}
