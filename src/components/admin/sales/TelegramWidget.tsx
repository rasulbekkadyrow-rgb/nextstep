'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Bot, Radio } from 'lucide-react';
import type { TelegramSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * TELEGRAM BILDIRIŞ WIDGETI
 * ==================================================================
 * Näme üçin Telegram? Talyplar we ene-atalar bilen habarlaşyk esasan
 * WhatsApp we Instagram arkaly geçýär, emma toparyň öz içindäki iş
 * bildirişleri üçin Telegram amatly: kanala goşulan her işgär täze
 * ýüztutmany şobada telefonynda görýär.
 *
 * Bu möhüm, sebäbi kabul möwsümi gysga: ilkinji sagatlarda jogap
 * berlen ýüztutmanyň kabul hatyna ýetmek ähtimallygy has ýokary.
 *
 * Işleýiş zynjyry:
 *   Saýtdaky forma
 *     → POST /api/leads          (ýüztutma gora ýazylýar)
 *     → sendTelegramNotification (nusga boýunça habar düzülýär)
 *     → Telegram Bot API         (kanala iberilýär)
 *
 * HOWPSUZLYK: bot açary (token) diňe serwerde, `TELEGRAM_BOT_TOKEN`
 * gurşaw üýtgeýjisinde saklanýar. Ol hiç haçan brauzere iberilmeýär —
 * bu widget diňe sazlamalary görkezýär, açaryň özüni däl.
 */
export function TelegramWidget({ settings }: { settings: TelegramSettings }) {
  const t = useTranslations('admin.sales.telegram');
  const [events, setEvents] = useState(settings.events);
  const [testState, setTestState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const sendTest = async () => {
    setTestState('sending');
    try {
      await fetch('/api/integrations/telegram/test', { method: 'POST' });
      setTestState('sent');
      setTimeout(() => setTestState('idle'), 2600);
    } catch {
      setTestState('idle');
    }
  };

  const eventKeys = ['newLead', 'stageChange', 'accepted', 'lost', 'dailyDigest'] as const;

  return (
    <section className="rounded-2xl border border-line/10 bg-surface/50 p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#229ED9]/12 text-[#229ED9]">
            <Send className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-h4">{t('title')}</h2>
            <p className="mt-1 text-body-sm text-muted">{t('subtitle')}</p>
          </div>
        </div>

        {/* Birikme ýagdaýy — janly nokat bilen */}
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold',
            settings.connected
              ? 'border-ok/30 bg-ok/10 text-ok'
              : 'border-brand/30 bg-brand/10 text-brand',
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            {settings.connected && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
            )}
            <span className={cn('relative h-1.5 w-1.5 rounded-full', settings.connected ? 'bg-ok' : 'bg-brand')} />
          </span>
          {settings.connected ? t('statusConnected') : t('statusDisconnected')}
        </span>
      </header>

      {/* --- Bot maglumatlary --- */}
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line/10 bg-base/60 p-3.5">
          <dt className="flex items-center gap-1.5 text-micro uppercase tracking-[0.1em] text-faint">
            <Bot className="h-3 w-3" aria-hidden /> {t('botLabel')}
          </dt>
          <dd className="mt-1.5 font-mono text-body-sm">{settings.botUsername}</dd>
        </div>
        <div className="rounded-xl border border-line/10 bg-base/60 p-3.5">
          <dt className="flex items-center gap-1.5 text-micro uppercase tracking-[0.1em] text-faint">
            <Radio className="h-3 w-3" aria-hidden /> {t('chatLabel')}
          </dt>
          <dd className="mt-1.5 font-mono text-body-sm">{settings.chatId}</dd>
        </div>
      </dl>

      {/* --- Wakalaryň saýlawy --- */}
      <div className="mt-6">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{t('events')}</p>
        <ul className="mt-3 space-y-1">
          {eventKeys.map((key) => (
            <li key={key}>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-line/[0.04]">
                <span className="text-body-sm">{t(`eventOptions.${key}`)}</span>

                {/* Çeňňek (toggle) — ýumşak süýşýän nokat bilen */}
                <button
                  role="switch"
                  aria-checked={events[key]}
                  onClick={() => setEvents((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={cn(
                    'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300',
                    events[key] ? 'bg-ok' : 'bg-line/15',
                  )}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={cn(
                      'absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm',
                      events[key] ? 'left-6' : 'left-1',
                    )}
                  />
                </button>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Habaryň nusgasy --- */}
      <div className="mt-6">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
          {t('templateLabel')}
        </p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-line/10 bg-base/70 p-4 font-mono text-body-sm leading-relaxed text-muted">
{settings.template}
        </pre>
      </div>

      {/* --- Synag habary --- */}
      <button
        onClick={sendTest}
        disabled={testState !== 'idle'}
        className={cn(
          'mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-body-sm font-semibold transition-all duration-300',
          testState === 'sent'
            ? 'bg-ok text-base'
            : 'border border-line/12 bg-base hover:border-brand/40 hover:text-brand',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={testState}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {testState === 'sent' ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {testState === 'sending' ? t('testSending') : testState === 'sent' ? t('testSent') : t('testSend')}
          </motion.span>
        </AnimatePresence>
      </button>
    </section>
  );
}
