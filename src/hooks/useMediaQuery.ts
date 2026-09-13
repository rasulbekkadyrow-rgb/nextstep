'use client';

import { useEffect, useState } from 'react';

/**
 * CSS SORAGYNY JAVASCRIPT-DE OKAMAK
 * ==================================================================
 * Köp zady CSS-iň özi çözýär (`md:`, `lg:` öňlükleri). Emma
 * animasiýanyň bahasy JavaScript-de hasaplanýanda — mysal üçin
 * Framer Motion-yň `useTransform`-y — ölçegi CSS bilen üýtgedip
 * bolmaýar: içki stil (inline style) hemişe güýçli bolýar.
 *
 * Şeýle ýagdaýda soragy şu ýerden okamaly.
 *
 * ⚠️ SERWERDE HEMIŞE `false`.
 * Serwer brauzeriň ekranyny bilmeýär. Eger başlangyç baha çak edilse,
 * ilkinji çyzgy bilen hakyky ýagdaý gabat gelmän, React duýduryş
 * berýär (hydration mismatch). Şonuň üçin başlangyç baha hemişe
 * `false`, hakyky baha bolsa ilkinji effektde gelýär.
 *
 * Bu — animasiýa üçin howpsuz: hereket birinji kadrda başlamasa-da
 * hiç zat bozulmaýar, diňe bir pursat gijä galýar.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
