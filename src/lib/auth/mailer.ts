import type { Locale } from '@/lib/i18n';

/**
 * E-POÇTA IBERIJI
 * ==================================================================
 * Talap: dolandyryjylar islendik poçta hyzmatyny ulanyp bilmeli —
 * Gmail, iCloud (iPhone), Outlook, Yandex, Mail.ru, öz domeni...
 * Şonuň üçin ALYJY tarapynda hiç hili çäklendirme ýok: adaty hat
 * iberilýär, ol ähli enjamda (iOS, Android, kompýuter) açylýar.
 *
 * IBERIJI tarapynda üç sürüji bar — gurşawa görä awtomatik saýlanýar:
 *
 *   smtp     — islendik poçta serweri (nodemailer arkaly).
 *              Iň giň ýaýran ýol: Gmail-iň «App password», Yandex 360,
 *              hostingiň öz poçtasy — hemmesi SMTP.
 *   resend   — HTTP API (resend.com). Serwersiz gurşawda amatly.
 *   console  — hat iberilmeýär, kod terminalda çykýar.
 *              Diňe işläp düzüş üçin: poçta sazlamazdan synag etmäge
 *              mümkinçilik berýär.
 *
 * ⚠️ `console` sürüjisi önümçilikde ULANYLMAÝAR — kod serweriň
 * žurnalyna düşerdi. Önümçilikde ol açylsa, ýalňyşlyk berilýär.
 */

export type MailDriver = 'smtp' | 'resend' | 'console';

export function resolveDriver(): MailDriver {
  const explicit = process.env.MAIL_DRIVER as MailDriver | undefined;
  if (explicit === 'smtp' || explicit === 'resend' || explicit === 'console') return explicit;

  if (process.env.SMTP_HOST) return 'smtp';
  if (process.env.RESEND_API_KEY) return 'resend';
  return 'console';
}

function fromAddress(): string {
  return process.env.MAIL_FROM ?? 'Next Step Consulting <onboarding@resend.dev>';
}

/* ================= HATYŇ ÝAZGYLARY — ÜÇ DILDE ================= */

const COPY: Record<
  Locale,
  {
    subject: (code: string) => string;
    preheader: string;
    greeting: string;
    intro: string;
    codeLabel: string;
    expiry: (minutes: number) => string;
    warning: string;
    signature: string;
  }
> = {
  tm: {
    subject: (code) => `${code} — Next Step admin paneline giriş kody`,
    preheader: 'Giriş kody 10 minut dowamynda hereket edýär.',
    greeting: 'Salam!',
    intro: 'Admin panele girmek üçin şu kody giriziň:',
    codeLabel: 'Giriş kody',
    expiry: (minutes) => `Kod ${minutes} minut dowamynda hereket edýär.`,
    warning:
      'Eger siz girmäge synanyşmadyk bolsaňyz, bu haty äsgermezlik ediň — kod ulanylmasa, özi öçýär.',
    signature: 'Next Step Consulting · admin ulgamy',
  },
  ru: {
    subject: (code) => `${code} — код входа в админ-панель Next Step`,
    preheader: 'Код действует 10 минут.',
    greeting: 'Здравствуйте!',
    intro: 'Введите этот код, чтобы войти в админ-панель:',
    codeLabel: 'Код входа',
    expiry: (minutes) => `Код действует ${minutes} минут.`,
    warning:
      'Если вы не пытались войти, просто проигнорируйте это письмо — неиспользованный код погаснет сам.',
    signature: 'Next Step Consulting · система администрирования',
  },
  tr: {
    subject: (code) => `${code} — Next Step yönetim paneli giriş kodu`,
    preheader: 'Kod 10 dakika geçerlidir.',
    greeting: 'Merhaba!',
    intro: 'Yönetim paneline girmek için bu kodu girin:',
    codeLabel: 'Giriş kodu',
    expiry: (minutes) => `Kod ${minutes} dakika boyunca geçerlidir.`,
    warning:
      'Giriş denemesi size ait değilse bu e-postayı yok sayın — kullanılmayan kod kendiliğinden geçersiz olur.',
    signature: 'Next Step Consulting · yönetim sistemi',
  },
};

/**
 * HATYŇ ŞEKILI
 * Poçta müşderileri (Gmail, Outlook, Apple Mail) döwrebap CSS-i
 * goldamaýar: `flex`, `grid`, daşarky stil faýllary işlemeýär. Şonuň
 * üçin bu ýerde bilkastlaýyn **tablisa we içki stiller** ulanylýar —
 * bu «köne usul» däl, poçta üçin ýeke-täk ygtybarly usul.
 *
 * Kod uly, monoşrift we giň aralykly: telefonda ony okamak we
 * göçürmek aňsat bolmaly.
 */
function renderHtml(code: string, locale: Locale): string {
  const copy = COPY[locale];
  const spaced = code.split('').join('&nbsp;&nbsp;');

  return `<!doctype html>
<html lang="${locale === 'tm' ? 'tk' : locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f2fd;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${copy.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2fd;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 48px rgba(20,18,43,0.10);">

        <tr><td style="height:5px;background:#8400FC;background-image:linear-gradient(90deg,#8400FC 0%,#0CA8F0 100%);"></td></tr>

        <tr><td style="padding:36px 36px 0 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8400FC;">Next Step Consulting</p>
          <p style="margin:20px 0 0 0;font-size:17px;font-weight:600;color:#14122b;">${copy.greeting}</p>
          <p style="margin:8px 0 0 0;font-size:15px;line-height:1.6;color:#545076;">${copy.intro}</p>
        </td></tr>

        <tr><td style="padding:26px 36px 0 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(132,0,252,0.18);background:#f9f5ff;border-radius:18px;">
            <tr><td align="center" style="padding:22px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8480a6;">${copy.codeLabel}</p>
              <p style="margin:0;font-family:'SF Mono',Menlo,Consolas,'Courier New',monospace;font-size:34px;font-weight:700;color:#14122b;">${spaced}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:18px 36px 0 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          <p style="margin:0;font-size:13px;color:#8480a6;">${copy.expiry(10)}</p>
          <p style="margin:14px 0 0 0;font-size:13px;line-height:1.6;color:#8480a6;">${copy.warning}</p>
        </td></tr>

        <tr><td style="padding:26px 36px 32px 36px;">
          <div style="height:1px;background:rgba(20,18,43,0.08);"></div>
          <p style="margin:16px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;color:#a3a0bd;">${copy.signature}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Ýönekeý tekst görnüşi — HTML öçürilen poçta müşderileri üçin hökman */
function renderText(code: string, locale: Locale): string {
  const copy = COPY[locale];
  return `${copy.greeting}\n\n${copy.intro}\n\n    ${code}\n\n${copy.expiry(10)}\n${copy.warning}\n\n— ${copy.signature}`;
}

/* ================= SÜRÜJILER ================= */

async function sendViaSmtp(to: string, subject: string, html: string, text: string) {
  /* Dinamik import: `nodemailer` diňe hakykatdan gerek bolanda ýüklenýär
     we Edge gurluşygyna düşmeýär. */
  const nodemailer = (await import('nodemailer')).default;

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    /* 465 — gönümel TLS, 587 — STARTTLS arkaly */
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transport.sendMail({ from: fromAddress(), to, subject, html, text });
}

async function sendViaResend(to: string, subject: string, html: string, text: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: fromAddress(), to: [to], subject, html, text }),
  });

  if (!response.ok) {
    throw new Error(`resend_failed: ${response.status} ${await response.text()}`);
  }
}

/**
 * Giriş kodyny ibermek.
 * Ýalňyşlyk ýüze çyksa ol ÝOKARY galdyrylýar (leads-däki Telegram
 * bildirişinden tapawutlylykda): hat barmasa, ulanyjy girip bilmeýär —
 * ony «hemme zat gowy» diýip aldamak nädogry bolardy.
 */
export async function sendLoginCode(to: string, code: string, locale: Locale): Promise<MailDriver> {
  const copy = COPY[locale];
  const subject = copy.subject(code);
  const html = renderHtml(code, locale);
  const text = renderText(code, locale);
  const driver = resolveDriver();

  if (driver === 'console') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Poçta sazlanmadyk: önümçilikde `console` sürüjisi ulanylyp bilinmeýär. ' +
          'SMTP_HOST ýa-da RESEND_API_KEY goşuň.',
      );
    }
    /* eslint-disable no-console */
    console.info(
      [
        '',
        '  ┌─ NEXT STEP · GIRIŞ KODY ─────────────────────',
        `  │  ${to}`,
        `  │  KOD:  ${code}`,
        '  │  (poçta sazlanmadyk — MAIL_DRIVER=console)',
        '  └──────────────────────────────────────────────',
        '',
      ].join('\n'),
    );
    /* eslint-enable no-console */
    return 'console';
  }

  if (driver === 'resend') await sendViaResend(to, subject, html, text);
  else await sendViaSmtp(to, subject, html, text);

  return driver;
}
