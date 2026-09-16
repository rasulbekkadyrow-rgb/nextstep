'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * ALTY ÖÝJÜKLI KOD MEÝDANY
 * ==================================================================
 * Näme üçin bir meýdanyň ýerine alty öýjük?
 *  · Adam kody nirä çenli ýazandygyny SANAMAZDAN görýär.
 *  · Telefonda her sanyň ýeri uly — barmak bilen düşmek aňsat.
 *  · Bu görnüş Instagram, banklar we Telegram arkaly eýýäm
 *    öwrenişilen: düşündiriş gerek däl.
 *
 * ÜÇ ÝAGDAÝ BILKASTLAÝYN IŞLENDI — köplenç şular ýatdan çykýar:
 *
 *  1. GÖÇÜRIP GOÝMAK. Adam kody poçtadan doly göçürýär. Islendik
 *     öýjüge goýlanda alty san bölünip ýerleşdirilýär.
 *  2. AWTOMATIK DOLDURMA. iPhone we Android kody klawiaturanyň
 *     üstünde teklip edýär (`autocomplete="one-time-code"`). Şonda
 *     alty san BIR öýjüge gelýär — ol hem bölünýär.
 *  3. YZA POZMAK. Boş öýjükde «backspace» basylanda öňki öýjüge
 *     geçilýär we ol pozulýar — ýogsam adam iki gezek basmaly bolýar.
 */
export function CodeInput({
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
  length = 6,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  length?: number;
  label: string;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  /* Ekran açylan badyna birinji öýjük işjeň bolýar — adam el degirmeli däl */
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const setAt = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean) return;

    /* Bir öýjüge birnäçe san gelse (awtomatik doldurma ýa-da göçürme) —
       olar yzygiderli paýlanýar */
    const next = (value.slice(0, index) + clean + value.slice(index + clean.length))
      .replace(/\D/g, '')
      .slice(0, length);

    onChange(next);

    const cursor = Math.min(index + clean.length, length - 1);
    refs.current[cursor]?.focus();

    if (next.length === length) onComplete?.(next);
  };

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        refs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
    if (pasted.length === length) onComplete?.(pasted);
  };

  return (
    <div
      role="group"
      aria-label={label}
      dir="ltr"
      className={cn(
        'flex justify-between gap-2 sm:gap-2.5',
        /* Ýalňyş kodda ýeňil sarsgyn — ýazgy okalmanka-da düşnükli signal.
           `prefers-reduced-motion` hormatlanýar (globals.css). */
        invalid && 'animate-shake',
      )}
    >
      {digits.map((digit, index) => {
        const filled = digit.trim() !== '';
        return (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            value={filled ? digit : ''}
            onChange={(event) => setAt(index, event.target.value)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
            disabled={disabled}
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`${label} ${index + 1}`}
            maxLength={length}
            className={cn(
              'h-14 w-full min-w-0 rounded-2xl border bg-surface/70 text-center font-mono text-[1.35rem] font-bold tabular-nums text-ink',
              'transition-all duration-300 ease-out-expo',
              'focus:outline-none focus:ring-4',
              invalid
                ? 'border-warn/55 focus:border-warn focus:ring-warn/15'
                : filled
                  ? 'border-brand/45 shadow-[0_0_0_1px_rgb(var(--c-brand)/0.12)] focus:border-brand focus:ring-brand/15'
                  : 'border-line/14 focus:border-brand focus:ring-brand/15',
              disabled && 'opacity-55',
            )}
          />
        );
      })}
    </div>
  );
}
