'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Compass, FileX2, CalendarClock, ShieldCheck, TriangleAlert, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';
import { AuroraField } from '@/components/ui/AuroraField';

const ICONS = {
  compass: Compass,          // ugur saýlamak
  'file-x': FileX2,          // resminamanyň yzyna gaýtarylmagy
  'calendar-clock': CalendarClock, // möhletler
  shield: ShieldCheck,       // araçylara ynam
} as const;

/**
 * KARTALARYŇ REŇKLERI
 * ------------------------------------------------------------------
 * Dört kartanyň her biri öz reňkini alýar — bölüm bir öwüşginli
 * däl-de reňkli bolýar. Reňkler markanyň paletinden: benewşe, gök,
 * ýaşyl we altyn.
 *
 * ⚠️ Synplar doly ýazylýar (`border-brand/30` we ş.m.). Tailwind
 * synp atlaryny kodda GÖRÜP tapýar — `border-${x}/30` görnüşinde
 * ýazylsa, ol synp CSS-e asla düşmeýär.
 *
 * ⚠️ Gök ÝAZGY üçin `text-azure` däl-de `text-azure-ink` ulanylýar:
 * asyl gök ak fonda 2,7:1 berýär, garaldylany bolsa 4,6:1.
 */
const ACCENTS = [
  { rim: '--c-brand', card: 'border-brand/30 bg-brand/[0.05]',  glow: 'bg-brand/25', chip: 'border-brand/30 bg-brand/10 text-brand' },
  { rim: '--c-azure', card: 'border-azure/35 bg-azure/[0.06]',  glow: 'bg-azure/25', chip: 'border-azure/40 bg-azure/10 text-azure-ink' },
  { rim: '--c-ok',    card: 'border-ok/30 bg-ok/[0.05]',        glow: 'bg-ok/25',    chip: 'border-ok/30 bg-ok/10 text-ok' },
  { rim: '--c-gold',  card: 'border-gold/35 bg-gold/[0.06]',    glow: 'bg-gold/25',  chip: 'border-gold/40 bg-gold/10 text-gold' },
] as const;

interface Item {
  icon: keyof typeof ICONS;
  before: { title: string; text: string };
  after: { title: string; text: string };
}

/**
 * AGYRY WE ÇÖZGÜT BÖLÜMI (Problem vs Solution)
 * ------------------------------------------------------------------
 * UX pikiri: müşderi özüni tanamaly. Şonuň üçin ilki «agyry» görkezilýär,
 * soňra bir hereket bilen çözgüde geçilýär.
 *
 * Çalyşmagyň iki derejesi bar:
 *  · Umumy çeňňek (master switch) — ähli kartalary birbada çalyşýar.
 *  · Her kartanyň öz üstüne basmak — diňe şol kartany çalyşýar.
 * Bu ulanyja gözegçiligi berýär we bölüm bilen «oýnamaga» iterýär.
 */
export function ProblemSolution() {
  const t = useTranslations('problem');
  const items = t.raw('items') as Item[];
  const [globalState, setGlobalState] = useState<'before' | 'after'>('before');
  const [overrides, setOverrides] = useState<Record<number, 'before' | 'after'>>({});

  const setGlobal = (next: 'before' | 'after') => {
    setGlobalState(next);
    setOverrides({}); // Umumy çeňňek basylanda aýratyn saýlawlar arassalanýar
  };

  return (
    <section id="kynçylyk" className="relative isolate scroll-mt-24 overflow-hidden py-24 md:py-32">
      {/* Fonda haýal aýlanýan reňkli şekiller. Olar diňe bezeg däl:
          kartalaryň aýna ýüzi AŞAGYNDAKY reňki görkezýär, şonuň üçin
          fon hereket edende materialyň içi hem janlanýar. */}
      <AuroraField intensity="soft" className="absolute inset-x-[-12%] -top-[10%] -z-10 h-[52rem]" />

      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">{t('eyebrow')}</p>
            <h2 className="mt-5 text-h2">{t('title')}</h2>
            <p className="mx-auto mt-5 max-w-[58ch] text-body-lg text-muted">{t('subtitle')}</p>
          </div>
        </Reveal>

        {/* ---- Umumy çeňňek ---- */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <div
              role="group"
              aria-label={t('switchAria')}
              className="relative inline-flex items-center rounded-full border border-line/12 bg-surface/70 p-1.5 backdrop-blur-md"
            >
              {(['before', 'after'] as const).map((state) => (
                <button
                  key={state}
                  onClick={() => setGlobal(state)}
                  aria-pressed={globalState === state}
                  className={cn(
                    'relative z-10 rounded-full px-6 py-2.5 text-body-sm font-semibold transition-colors duration-300',
                    globalState === state ? 'text-brand-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {state === 'before' ? t('switchBefore') : t('switchAfter')}
                </button>
              ))}
              {/* Süýşýän görkeziji — düwmeleriň arasynda ýumşak geçiş */}
              <motion.span
                aria-hidden
                layout
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={cn(
                  'absolute inset-y-1.5 rounded-full',
                  globalState === 'before' ? 'left-1.5 bg-slate' : 'bg-ok',
                )}
                style={
                  globalState === 'before'
                    ? { width: 'calc(50% - 0.375rem)' }
                    : { left: '50%', width: 'calc(50% - 0.375rem)' }
                }
              />
            </div>
          </div>
        </Reveal>

        {/* ---- Kartalar ---- */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <FlipCard
                item={item}
                accent={ACCENTS[i % ACCENTS.length]}
                state={overrides[i] ?? globalState}
                onToggle={() =>
                  setOverrides((prev) => ({
                    ...prev,
                    [i]: (prev[i] ?? globalState) === 'before' ? 'after' : 'before',
                  }))
                }
                labels={{ before: t('switchBefore'), after: t('switchAfter') }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({
  item,
  accent,
  state,
  onToggle,
  labels,
}: {
  item: Item;
  accent: (typeof ACCENTS)[number];
  state: 'before' | 'after';
  onToggle: () => void;
  labels: { before: string; after: string };
}) {
  const Icon = ICONS[item.icon] ?? Compass;
  const isAfter = state === 'after';
  const content = isAfter ? item.after : item.before;
  const reduceMotion = useReducedMotion();

  return (
    <button
      onClick={onToggle}
      aria-pressed={isAfter}
      /* `--rim` — gyranyň aýlanýan şöhlesiniň reňki (globals.css). */
      style={{ ['--rim' as string]: `var(${accent.rim})` }}
      data-rim={isAfter ? 'on' : undefined}
      className={cn(
        'rim group relative h-full w-full overflow-hidden rounded-3xl border p-7 text-left',
        'transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift',
        /* «Öň» — bitarap we sowuk; «soň» — kartanyň öz reňki */
        isAfter ? accent.card : 'border-line/10 bg-surface/60 hover:border-line/20',
      )}
    >
      {/* Reňkli şöhle. «Soň» ýagdaýynda ol ulalýar we haýal demleýär —
          kartanyň janlanandygy şondan duýulýar. */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl transition-all duration-700',
          isAfter ? cn(accent.glow, 'scale-125 animate-glow-pulse') : 'scale-100 bg-slate/[0.10]',
        )}
      />
      {/* Ikinji şöhle aşaky-çepde — reňk kartanyň iki burçundan gelýär */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-700',
          'bg-brand/20',
          isAfter ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition-all duration-500',
            isAfter ? cn(accent.chip, 'scale-105') : 'border-line/12 bg-base/60 text-muted',
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>

        {/* Kartanyň öz ýagdaý belgisi */}
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.1em] transition-colors duration-500',
            isAfter ? accent.chip : 'border-slate/35 bg-slate/[0.08] text-slate',
          )}
        >
          {isAfter ? <Check className="h-3 w-3" /> : <TriangleAlert className="h-3 w-3" />}
          {isAfter ? labels.after : labels.before}
        </span>
      </div>

      {/* Mazmunyň çalyşmagy — ýokardan aşak «kart öwrülýän» ýaly */}
      <div className="relative mt-6 min-h-[9.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={state}
            initial={reduceMotion ? false : { opacity: 0, y: 14, rotateX: -12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -14, rotateX: 12 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
          >
            <h3 className="text-h4">{content.title}</h3>
            <p className="mt-3 text-body-sm leading-relaxed text-muted">{content.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </button>
  );
}
