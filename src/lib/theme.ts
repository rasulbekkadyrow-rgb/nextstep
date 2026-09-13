/**
 * TEMA — ÝEKE-TÄK HAKYKAT ÇEŞMESI
 * ==================================================================
 * Saýtda temany ÜÇ ýer bilýär: `<head>`-däki başlangyç skript, tema
 * çalşyryjy düwme we her geçişde temany dikeldýän `ThemeSync`.
 * Şol üçüsi hem şu faýla daýanýar — ýogsam biri beýlekisinden
 * tapawutly netije berýär.
 *
 * ⚠️ NÄME ÜÇIN `ThemeSync` GEREK?
 * `data-theme` atributy `<html>` elementine EL BILEN goýulýar. React
 * ol atributy öz çyzýan zadynyň bir bölegi hasaplamaýar. Dil
 * çalşanda (`/tm` → `/ru`) Next.js `<html>` elementini gaýtadan
 * çyzýar we React özüniň goýmadyk atributyny AÝYRÝAR.
 *
 * Netijesi görnüp duran näsazlykdy: ulanyjy ýagty temany saýlaýar,
 * dili çalyşýar — saýt garaňka bökýär. Sebäbi atribut ýitenden soň
 * `globals.css`-däki `prefers-color-scheme` ätiýaçlyk düzgüni
 * işleýär, ol bolsa ulgamyň temasyny alýar.
 *
 * Şonuň üçin her geçişden soň atribut dikeldilýär.
 */

export type Theme = 'light' | 'dark';

/** Ulanyjynyň saýlawy saklanýan açar */
export const THEME_KEY = 'ns-theme';

/** Ulgamyň temasy (ulanyjy hiç zat saýlamadyk bolsa) */
export function systemTheme(): Theme {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** Ulanyjynyň öz saýlawy bar bolsa — şol, ýogsam ulgamyňky */
export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    /* Gizli rejimde `localStorage` gadagan bolup biler */
    return null;
  }
}

export function resolveTheme(): Theme {
  return storedTheme() ?? systemTheme();
}

/** Temany ekrana ulanmak. `remember: false` — diňe görkezmek, saklamazlyk. */
export function applyTheme(theme: Theme, remember = true): void {
  document.documentElement.setAttribute('data-theme', theme);
  if (!remember) return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* saklanmasa-da ekranda dogry görünýär */
  }
}

/**
 * SAHYPA ÇYZYLMAZDAN ÖŇKI SKRIPT.
 * `<head>`-de, ähli stillerden öň işleýär — şonuň üçin garaňky temada
 * ak «ýalpyldama» (flash) bolmaýar.
 *
 * Bu ýerde ýokardaky funksiýalar ÇAGYRYLYP BILINMEÝÄR: skript React
 * ýüklenmezden has öň, aýratyn gurşawda işleýär. Şonuň üçin mantyk
 * gysga görnüşde gaýtalanýar — açaryň ady welin şol bir üýtgeýjiden
 * alynýar, ýagny iki ýerde dürli ýazylmagy mümkin däl.
 */
export const THEME_BOOT_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', stored === 'light' || stored === 'dark' ? stored : system);
  } catch (e) {}
})();
`;
