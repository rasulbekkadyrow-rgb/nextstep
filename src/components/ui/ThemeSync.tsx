'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { applyTheme, resolveTheme, storedTheme, systemTheme } from '@/lib/theme';

/**
 * TEMANY DIKELDIJI
 * ==================================================================
 * Iki wezipesi bar:
 *
 * 1. HER GEÇIŞDEN SOŇ `data-theme` ATRIBUTYNY DIKELTMEK.
 *    Dil çalşanda Next.js `<html>` elementini gaýtadan çyzýar we
 *    React özüniň goýmadyk atributyny aýyrýar — şonda ulanyjynyň
 *    saýlan temasy ýitip, saýt ulgamyň temasyna bökýärdi.
 *
 * 2. ULGAMYŇ TEMASY ÜÝTGÄNDE YZARLAMAK — diňe ulanyjy özi saýlamadyk
 *    bolsa. Telefon agşam garaňky tema geçende saýt hem geçmeli,
 *    ýöne adam «ýagty» diýip saýlan bolsa, onuň saýlawy güýçli.
 *
 * NÄME ÜÇIN `useLayoutEffect`?
 * Adaty `useEffect` ekran çyzylandan SOŇ işleýär — şonda bir kadrlyk
 * ýalpyldama görünýän bolardy. `useLayoutEffect` bolsa DOM üýtgänden
 * soň, ekrana çykmazdan öň işleýär: göz hiç zat duýmaýar.
 * (Serwerde ol ýok, şonuň üçin aşakdaky çalşyk.)
 */

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function ThemeSync() {
  const pathname = usePathname();

  /* Her salgy çalşanda atribut ýerinde barmy — barlanýar we dikeldilýär */
  useIsomorphicLayoutEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    const expected = resolveTheme();
    if (current !== expected) applyTheme(expected, false);
  }, [pathname]);

  /* Ulgamyň temasy üýtgände — diňe öz saýlawy ýok bolsa */
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const onChange = () => {
      if (storedTheme()) return;
      applyTheme(systemTheme(), false);
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return null;
}
