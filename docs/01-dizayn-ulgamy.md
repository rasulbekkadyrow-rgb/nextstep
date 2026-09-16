# 01 — Dizaýn ulgamy (Design System)

Bu resminama saýtyň wizual diliniň düzgünlerini beýan edýär. Islendik täze
bölüm ýa-da sahypa goşulanda şu düzgünlere eýerilmelidir — şeýlelikde
interfeýs bir bitewi eser bolup galýar.

---

## 1. Dizaýnyň esasy pelsepesi

> **ESASY PIKIR — YNAM BEROJEK ARASSA BILIM SAÝTY.**
> Ak fon, ýumşak çal zolaklar, arassa ak kartalar, doly tegelek düwmeler
> we hakyky suratlar. Bezeg däl — **MAZMUN** öňde.

Näme üçin şeýle? Sahypanyň okyjysy bir adam däl, **iki adam**: talyp we
onuň ene-atasy. Töleg baradaky karary köplenç ikinjisi berýär. Ene-ata
üçin bolsa «täsirli» saýt däl-de **DÜŞNÜKLI** saýt ynam berýär: nämäniň
näçe wagt aljakdygy, nämäniň eline gowuşjakdygy we kimiň jogapkärdigi
bir bakyşda görünmeli.

### Dört sütün

1. **Aýdyňlyk** — her bölüm bir soraga jogap berýär. Jogap bermeýän aýrylýar.
2. **Ierarhiýa** — ekranda bir wagtda diňe bir esasy zat bolmaly.
3. **Ritm** — aralyklar tötänleýin däl, 4 pikselli şkala boýunça.
4. **Jogapkärçilikli hereket** — animasiýa üns çekmek üçin däl, düşündirmek üçin.

### ⚠️ Öňki dizaýndan näme aýryldy we näme üçin

Saýtyň ilkinji görnüşi doly **Liquid Glass** materialynda gurlupdy: aýna
paneller, arkada hereket edýän reňkli şekiller (aurora), aýlanýan reňkli
gyralar, skrolla bagly «dynamic island» panel, magnit düwmeler we tolkun
süzgüji.

Ol tehniki taýdan owadandy, emma hyzmatyň wezipesine garşydy:

| Näme bardy | Näme zyýan berýärdi |
|---|---|
| «Öň / soň» çeňňegi | Sahypa açylanda diňe KYNÇYLYKLAR görünýärdi, çözgütler gizlidi |
| Aýna kartalar | Ýazgy fondan geçýän şekiliň üstünde durýardy — okamak kyn |
| Aurora fon animasiýasy | 15 sany uly bulaşyk şekil, telefonda skroll agyrlaşýardy |
| Garaňky tema | Kabul hatlarynyň skanlary we ak fonly logotipler ýamaly görünýärdi |
| Magnit düwmeler | Her düwme aýratyn `framer-motion` komponentidi — 20-den gowragy |

Bular aýryldy. Skroll bilen ýygrylýan aýna header ulanyjynyň islegi bilen
yzyna getirildi (`lg lg-thin`). Başga ýerde aýna material diňe admin
giriş sahypasynda bar (8-nji bölüm).

### Reňkler nireden alyndy

Reňkler toslanylmady — **markanyň Instagram logosyndan ölçenildi**
(`@nextstep.consultancyy`):

| Ölçenen reňk | Hue | Paýy |
|---|---|---|
| `#8400FC` benewşe | 271° | agdyklyk edýän |
| `#0CA8F0` gök | 199° | ikinji uç |

Stil çalyşdy, emma **reňk markanyň özüniňki bolup galdy**: saýt bilen
logo bir dilde gepleýär.

---

## 2. Reňk ulgamy

Ähli reňkler CSS üýtgeýjilerde (`globals.css`) saklanýar. Komponentlerde
göni reňk (`#ffffff` ýaly) ýazmak **gadagan** — diňe token ulanylýar.

### ⚠️ TEMA BIRDIR: DIŇE ÝAGTY

Saýtda **garaňky tema ýok**. `prefers-color-scheme` diňlenmeýär,
`data-theme` atributy ýok, ulanyjy saýlawy ýok, tema düwmesi ýok.

Sebäbi: bu saýtyň mazmunynyň esasy bölegi — talyplaryň banner suraty,
uniwersitetleriň **ak fonly** logotipleri we kabul hatlarynyň skanlary.
Olaryň hemmesi ýagty materialda ýasalan. Garaňky fonda olar ýamaly ýaly
görünýärdi we her biri üçin aýratyn çözgüt gerek bolýardy.

> Garaňky tema goşmak — palitrany iki esse köpeltmek diýmek. Ol diňe
> mazmun hem oňa uýgunlaşyp bilýän bolsa özüni ödeýär.

### Meýdanlar

| Token | Bahasy | Ulanylyşy |
|---|---|---|
| `base` | `#FFFFFF` | Sahypanyň öz fony — arassa ak |
| `surface` | `#F6F7FB` | Çal zolak — bölümleriň gezekleşmesi |
| `elevated` | `#FFFFFF` | Kartalaryň ýüzi |

**Bölümler gezekli-gezegine ak we çal bolýar.** Şol çal zolak bölüm
serhedini **çyzyksyz** görkezýär — sahypa dem alýan ýaly bolýar.

### Ýazgylar

| Token | Bahasy | Ak fonda kontrast |
|---|---|---|
| `ink` | `#14122B` | 16,8:1 — sözbaşylar we esasy ýazgy |
| `muted` | `#565474` | 7,1:1 — düşündirişler |
| `faint` | `#8683A4` | 3,6:1 — **diňe uly ölçegde**, bellikler |

### Nyşan reňkleri

| Token | Bahasy | Ulanylyşy |
|---|---|---|
| `brand` | `#8400FC` | **Logonyň benewşesi** — ähli düwmeler, işjeň ýagdaý |
| `brand-deep` | `#5C00B8` | Hover we basylan ýagdaý |
| `brand-soft` | `#F5EEFF` | Ýeňil doldurgy: bellikler, nyşan gaplary |
| `azure` | `#0CA8F0` | **Gradientiň ikinji ujy** — diňe doldurgy |
| `azure-ink` | `#0774A8` | Gögüň ÝAZGY üçin garaldylan görnüşi |

### Goýy zolak

| Token | Bahasy | Ulanylyşy |
|---|---|---|
| `deep` | `#180E38` | Goýy bölümiň fony |
| `deep-soft` | `#261852` | Onuň içindäki kartalar |
| `deep-ink` | `#F0EEFA` | Goýy fonda sözbaşy we ýazgy |
| `deep-muted` | `#B2ACD2` | Goýy fonda ikinji derejeli ýazgy |

> ⚠️ **Bu garaňky tema DÄL.** Bu — bir bölümiň öz reňki. Ak sahypada goýy
> zolak iň güýçli şekil kontrasty berýär: göz şol ýerde saklanýar.
> Şonuň üçin markanyň iň esasy wadasy hut şol ýerde aýdylýar.

`.on-deep` synpy bir gezek goýulýar we içindäki ähli ýazgy reňklerini
awtomatik çalyşýar (`globals.css`).

**Goýy zolak sahypada takyk IKI gezek:** ortada (kynçylyk/çözgüt) we
ahyrda (aşaky bölüm). Ondan köp bolsa ol bellik bolmagyny bes edýär.

### Many beriji reňkler

| Token | Bahasy | Manysy |
|---|---|---|
| `ok` | `#0D9468` | Kabul edildi, tamamlandy, çözgüt |
| `warn` | `#B07408` | Möhlet ýakynlaşdy |
| `danger` | `#C82A3E` | **Forma ýalňyşlary** |
| `slate` | `#767294` | Bitarap — «öň» ýagdaýy |

> ⚠️ **Ýalňyş habarlary `danger`, `brand` DÄL.** Öň forma ýalňyşlary
> benewşede çykýardy — ol duýduryş däl-de «bellik» ýaly okalýardy we
> şol bir reňkdäki «Ibermek» düwmesi bilen garyşýardy. **Bir reňk — bir many.**

### Kontrast barada hökmany bellik

| Reňk | Ak fonda | Netije |
|---|---|---|
| `#8400FC` benewşe | **6,2:1** | ✅ ýazgy üçin dogry |
| `#0CA8F0` gök | **2,7:1** | ❌ ýazgy üçin ýaramaýar |
| `#0774A8` garaldylan gök | **4,6:1** | ✅ ýazgy üçin dogry |

Şonuň üçin **gök diňe doldurgy (fill) we gradient hökmünde** ulanylýar —
ak fonda hiç haçan ýazgy üçin däl. (Goýy zolakda gök onsuz hem ýeterlik
kontrast berýär, şonuň üçin ol ýerde `azure` ýazgy üçin dogry.)

### Gradient ýok

Saýtyň ýüzünde gradient tekst we gradient zolak ulanylmaýar: olar şablon
saýtlaryň iň tanalýan alamaty. Sözbaşydaky nyşan söz düz açyk benewşe
(`#C4A1FF`), düwmeler düz `brand`, hover `brand-deep`. `.brand-gradient`
diňe admin panelindäki düwmelerde galdy.

### Reňkleriň paýlanyş düzgüni (60–30–10)

- **60%** — bitarap fonlar (`base`, `surface`)
- **30%** — ýazgylar (`ink`, `muted`)
- **10%** — nyşan reňki (`brand`) we many beriji reňkler

Nyşan reňki 10%-den geçse, ol öz güýjüni ýitirýär.

---

## 3. Tipografiýa

### Şriftler

| Wezipesi | Şrift | Agramy |
|---|---|---|
| Sözbaşylar | **Geologica** | 600–800 (esasy 700) |
| Esasy ýazgy | **Onest** | 400–700 |
| Sanlar, kod (diňe admin) | **JetBrains Mono** | 400/600 |

**Geologica** sözbaşylar üçin: häsiýetli, ýöne agras. Inter/Manrope ýaly
her şablonda duş gelýän şriftlerden tapawutlanýar.

**Onest** tekst üçin: kirillisa üçin taslanan, uzyn abzaslarda arassa
okalýar, türkmen harplary tebigy görünýär.

Saýlaw alty görnüşiň deňeşdirmesinden soň edildi (Manrope + Mulish,
Onest, Geologica + Onest, Rubik, Unbounded + Onest, Golos Text).
Unbounded sözbaşyny üç setire bölýärdi, Rubik gaty çagajykdy.

Üçüsi hem **kirill** (`cyrillic`) we **giňeldilen latyn** (`latin-ext`)
toplumlaryny doly goldaýar. Bu üç dilli taslamada hökmany şert. Türkmen
harplarynyň Unicode ýerleri:

| Harp | Kod | Toplum |
|---|---|---|
| ä ö ü ý | U+00E4, U+00F6, U+00FC, U+00FD | `latin` |
| ň | U+0148 | `latin-ext` |
| ş | U+015F | `latin-ext` |
| ž | U+017E | `latin-ext` |

Şrift `latin-ext` toplumyny goldamasa, `ň` we `ž` harplary başga şrifte
düşýär — söz «döwülen» görünýär. **Täze şrift goşulanda bu barlag hökmanydyr.**

### Ölçeg şkalasy

| Ady | Ölçegi | Setir aralygy | Harp aralygy |
|---|---|---|---|
| `h1` | `clamp(2.3rem, 5vw, 3.7rem)` | 1.14 | −0.028em |
| `h2` | `clamp(1.9rem, 3.6vw, 2.75rem)` | 1.18 | −0.022em |
| `h3` | `clamp(1.5rem, 2.6vw, 2.25rem)` | 1.22 | −0.02em |
| `h4` | 1.25rem | 1.35 | −0.02em |
| `body-lg` | 1.1875rem (19px) | 1.95rem | −0.005em |
| `body` | **1.0625rem (17px)** | 1.8rem | 0 |
| `body-sm` | 0.9375rem (15px) | 1.6rem | 0 |
| `label` | 0.75rem | 1.1rem | +0.03em |
| `micro` | 0.6875rem | 1rem | +0.06em |

**Esasy ýazgy 17px** — adaty 16px-den bir basgançak uly. Sebäbi okyjylaryň
bir bölegi ene-atalar: uly ýazgy olar üçin ynam we rahatlyk berýär.

### Mikro-tipografiýanyň düzgünleri

1. **⚠️ Sözbaşylaryň setir aralygy 1,1-den pes goýulmaýar.** Türkmen, rus
   we türk dillerinde harplaryň ÜSTÜNDE we AŞAGYNDA belgi köp: Ý, Ň, Ä, Ö,
   Ü, Ş, Ç, Й, Ё. Dar aralykda ýokarky setiriň guýrugy bilen aşaky setiriň
   belgisi biri-birine degýär. Iňlis dilinde bildirmeýär — biziň üç
   dilimizde-de bildirýär.
2. **Kiçi ýazgyda harp aralygy giňedilýär** (`+0.06em`).
3. **Sanlar hemişe `tabular-nums`** (`.tnum` synpy).
4. **Setiriň uzynlygy 52–64 harp** (`max-w-[58ch]`).
5. **`text-wrap: balance`** sözbaşylarda, **`pretty`** abzaslarda.

---

## 4. Gurluş bölekleri

### `.card` — stiliň esasy bölegi

```css
.card {
  background-color: rgb(var(--c-elevated));
  border: 1px solid rgb(var(--c-line) / 0.08);
  box-shadow: 0 1px 2px …, 0 12px 32px -14px …;
}
```

Ak ýüz, ýeňil serhet we **iki gatlakly** kölege: golaýdaky gysga kölege
kartany ýüzden galdyrýar, uzak ýumşak kölege bolsa agram berýär. Bir
gatlakly kölege hemişe «ýelmeşen ýaly» görünýär.

`.card-hover` goşmaça: kursor degende karta 4px galýar, gyrasy nyşan
reňkine geçýär we kölegesi çuňlaşýar.

### `.eyebrow` — bölümiň belligi

Gysga dik çyzyk + uly harply nyşan reňkli ýazgy. Sözbaşynyň üstünde
durup, bölümiň nämedigini bir söz bilen aýdýar. Merkezleşdirilen
sözbaşylarda `.eyebrow-center` goşulýar — çyzyk iki tarapda bolýar.

### `Button` — doly tegelek (pill) düwme

Radius 999px, jaý giň, agram 700. **Adaty serwer komponenti** —
JavaScript ýok, geçişler diňe CSS-de.

| Görnüşi | Haçan |
|---|---|
| `primary` | Sahypadaky IŇ MÖHÜM hereket — benewşe doldurgy |
| `outline` | Ikinji derejeli hereket — benewşe serhet |
| `white` | Diňe suratyň ýa-da goýy zolagyň üstünde |
| `ghost` | Kartalaryň içindäki kiçi baglanyşyklar |

Ölçegi: `md` (adaty) we `lg` (diňe hero).

---

## 5. Tor ulgamy (12-column grid)

```
Maksimal giňlik : 1280px
Sütün sany      : 12 (uly ekran) / 8 (planşet) / 4 (telefon)
Sütünara aralyk : 24px (uly) / 20px (kiçi)
Gyra aralygy    : 40px (uly) / 32px (orta) / 20px (telefon)
```

`.grid-12` synpy şu düzgünleri awtomatik ulanýar.

### Aralyk şkalasy

Ähli aralyklar **4px**-iň esasynda: `4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 128`.
Arasynda bahalar ulanylmaýar (meselem `18px`) — bu ritmi bozýar.

Bölümleriň arasyndaky dik aralyk: **96px** (telefon) → **128px** (uly ekran).

---

## 6. Hereket we animasiýa

### Wagt we egri (easing)

| Ýagdaý | Dowamlylygy | Egri |
|---|---|---|
| Hover, kiçi geçişler | 200–300ms | `ease-out-expo` |
| Karta galmagy | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Element peýda bolmagy (`Reveal`) | 750ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Akkordeon açylmagy | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` |

**Standart `ease` ulanylmaýar.** Biziň esasy egrimiz — `expo-out`: başda
çalt, ahyrynda ýumşak.

### Animasiýanyň üç düzgüni

1. **Hereket maglumat bermeli.** Element nireden geldi — şol ýerden çykmaly.
2. **250ms-den gysga — duýulmaýar, 900ms-den uzyn — ýadadýar.**
3. **Bir wagtda 3-den köp element hereket etmeli däl.**

### ⚠️ Skrolla bagly animasiýa ulanylmaýar

Öň iki ýerde skrollyň her pikseline bagly hasap bardy: ýokarky panel we
iş tertibiniň dik çyzygy. Ikisi hem aýryldy. Sebäp:

- Her kadrda hasap — telefonda duýulýar.
- Çalt skroll edeniňde elementler ýarym ýagdaýda galýar.
- **Iň esasysy: hereket MAZMUNY gowulandyrmaýardy.**

Galan ýeke-täk skroll animasiýasy — `Reveal`: element ekrana girende bir
gezek ýumşak peýda bolýar (`once: true`).

### Elýeterlilik

```css
@media (prefers-reduced-motion: reduce) { /* ähli animasiýa öçürilýär */ }
```

Ulanyjy ulgam sazlamalarynda hereketi azaltmagy saýlan bolsa, saýt muňa
hökman hormat goýmalydyr. Bu diňe rahatlyk meselesi däl — käbir adamlarda
hereket kelle aýlanmagyna sebäp bolýar.

---

## 7. Mikro-özara täsirler (micro-interactions)

| Element | Effekt | Maksady |
|---|---|---|
| **CTA düwmesi** | Reňk çuňlaşýar, kölege ulalýar, nyşan öňe süýşýär | Basmaga çagyrmak |
| **Karta** | 4px galýar, gyrasy nyşan reňkine geçýär | Basylýandygyny aýtmak |
| **Çalt hereket paneli** | Sütüniň fony çal bolýar, nyşan benewşä öwrülýär | Dört gapynyň haýsysyndadygyny görkezmek |
| **Hatlaryň lentasy** | 96 sek haýal, hover-de saklanýar | Köplük duýgusy, okamaga wagt |
| **Uniwersitet tagtasy** | Karta galýar; hyzmatdaşlarda çep gyra benewşe | Saýlananlygyny bellemek |
| **FAQ akkordeon** | Plýus → 45° aýlanyp krest, karta reňklenýär | Ýagdaýyň açykdygyny aňlatmak |
| **Ýokarky panel** | Skroll başlanda ýeňil kölege alýar | Gatlagy aýyrmak |

### Animasiýa elementi gizlemeli däl

Giriş animasiýasy `opacity: 0` bilen başlaýan bolsa we JavaScript
işlemese, mazmun hemişelik görünmez bolýar. `Reveal` komponenti muny
`prefers-reduced-motion` ýagdaýynda gapdaldan aýlanyp geçýär: ol şonda
hiç hili stil goşmaýar.

---

## 8. Aýna material — diňe admin giriş sahypasy

`.lg` synpy sahypada **bir ýerde** ulanylýar:
`app/[locale]/admin/giris/page.tsx`.

Näme üçin ol ýerde galdyryldy? Giriş sahypasy boş ekran, ortasynda ýeke
karta. Fonda `AuroraField` ýumşak reňk tegeleklerini haýal süýşürýär —
dury material şol reňki içinden geçirýär we sahypa janly bolýar. Sahypada
ýeke karta bolany üçin `backdrop-filter` gymmat hem däl.

| Gatlak | CSS | Wezipesi |
|---|---|---|
| 1. Süzgüç | `backdrop-filter: blur(28px) saturate(150%)` | Arkadaky şekil bulaşdyrylýar |
| 2. Reňk | `background-color: rgb(255 255 255 / .95)` | Içindäki ýazgy okalar ýaly |
| 3. **Gyra** | `inset 0 1.5px 0 rgba(255,255,255,.9)` + içki halka | **Ýagtylygyň döwülmegi** |

> **Iň möhüm gatlak — üçünjisi.** Aýnany aýna edýän zat bulaşyklyk däl,
> gyrasyndaky ýagtylygyň döwülmegi. Diňe `blur()` goýulsa, ol aýna
> däl-de «hapa aýna» bolup görünýär.

> ⚠️ **TÄZE BÖLÜM ÝAZYLANDA `.card` ULANYLMALY, `.lg` DÄL.**

---

## 9. Elýeterlilik (Accessibility) — hökmany talaplar

- **Reňk kontrasty:** esasy ýazgy üçin iň azyndan **4.5:1**, uly sözbaşy
  üçin **3:1**.
- **Fokus halkasy:** `:focus-visible` ähli interaktiw elementde görünýär.
  Ony `outline: none` bilen aýyrmak gadagan.
- **Basylýan meýdan:** iň kiçisi **44×44px** (telefonda barmak ölçegi).
- **Semantik bellikler:** düwme üçin `<button>`, salgy üçin `<a>`.
  `<div onClick>` ulanmak klawiatura bilen işleýän adamlar üçin
  interfeýsi ýapýar.
- **Suratlar:** her manyly suratda `alt`, bezeg suratynda `aria-hidden`.
- **Maglumat diňe reňk bilen berilmeýär.** Mysal: hyzmatdaş uniwersitetler
  diňe benewşe gyra bilen däl, lentanyň aşagyndaky ýazgy bilen hem
  düşündirilýär.
