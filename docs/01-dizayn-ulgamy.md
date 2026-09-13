# 01 — Dizaýn ulgamy (Design System)

Bu resminama saýtyň wizual diliniň düzgünlerini beýan edýär. Islendik täze
bölüm ýa-da sahypa goşulanda şu düzgünlere eýerilmelidir — şeýlelikde
interfeýs bir bitewi eser bolup galýar.

---

## 1. Dizaýnyň esasy pelsepesi

> **ESASY PIKIR — «KABUL HATY», MARKANYŇ ÖZ REŇKLERINDE.**
> Wizual dil iki çeşmeden gelýär: mazmun tarapdan — resmi kabul haty
> (kagyz, syýa, möhür); reňk tarapdan — markanyň öz logosy.

Näme üçin resminama ugry? Sebäbi bu hyzmatyň netijesi fiziki resminama.
Saýtyň özi şol resminamanyň dilinde gürleşse, wada bilen netijäniň arasy
ýitýär — ulanyjy eýýäm sahypada öz maksadyny görýär.

### Reňkler nireden alyndy

Reňkler toslanylmady — **markanyň Instagram logosyndan ölçenildi**
(`@nextstep.consultancyy`). Logo — benewşeden gök reňke geçýän gradientli
«N» nyşany:

| Ölçenen reňk | Hue | Paýy |
|---|---|---|
| `#8400FC` benewşe | 271° | agdyklyk edýän |
| `#0CA8F0` gök | 199° | ikinji uç |

Şonuň üçin **gradientiň özi markanyň nyşany**, diňe bezeg däl.

> **Az element — köp many.** Premium duýgy bezegiň köplügi bilen däl-de,
> boş meýdanyň, takyk tipografiýanyň we ölçegli hereketiň hasabyna döreýär.

Dört sütün:

1. **Minimalizm** — her element özüni ödemeli. Ödemeýän aýrylýar.
2. **Ierarhiýa** — ekranda bir wagtda diňe bir esasy zat bolmaly.
3. **Ritm** — aralyklar tötänleýin däl, 4 pikselli şkala boýunça.
4. **Jogapkärçilikli hereket** — animasiýa üns çekmek üçin däl, düşündirmek üçin.

---

## 2. Reňk ulgamy

Ähli reňkler CSS üýtgeýjilerde (`globals.css`) saklanýar. Komponentlerde
göni reňk (`#ffffff` ýaly) ýazmak **gadagan** — diňe token ulanylýar.
Sebäbi tema çalşanda diňe tokenleriň bahasy üýtgeýär, kod bolsa degilmeýär.

### ESASY TEMA — ÝAGTY: «Kagyz»

| Token | Bahasy | Ulanylyşy |
|---|---|---|
| `base` | `#FAF9FE` | Sahypanyň fony — ýeňiljek benewşe öwüşginli ak |
| `surface` | `#FFFFFF` | Kartalar, paneller |
| `ink` | `#14122B` | Indigo öwüşginli gara — esasy ýazgy |
| `muted` | `#58547A` | Ikinji derejeli ýazgy |
| `faint` | `#8A86AA` | Bellikler, kömekçi ýazgylar |
| `brand` | `#8400FC` | **Logonyň benewşesi** — CTA, işjeň ýagdaý, möhür |
| `brand-deep` | `#5C00B8` | Kiçi ýazgy üçin has garaňky görnüşi |
| `azure` | `#0CA8F0` | **Gradientiň ikinji ujy** — diňe doldurgy |
| `ok` | `#0D9468` | Kabul edildi, tamamlandy, «soň» ýagdaýy |
| `warn` | `#B07408` | Möhlet ýakynlaşdy, terjime ýetmeýär |
| `gold` | `#B0843A` | Möhüriň halkasy, premium bellik |
| `slate` | `#767294` | **«Öň» ýagdaýy — bitarap** |

Esasy fon doly ak däl-de `#FAF9FE`. Ol nyşan reňkine tarap örän ýeňil
egilýär — bitarap çal «saýlanmadyk», bu bolsa «saýlanan» duýulýar.
Şol bir düzgün `ink` reňkine-de degişli: ol arassa gara däl-de, indigo
öwüşginli (`#14122B`).

### IKINJI TEMA — GARAŇKY

Instagram postlaryňyzyň fony çuň indigo (`#202060` töweregi) — garaňky
tema şol äheňi dowam etdirýär: `base` `#0D0B1A`, `surface` `#161329`.

`brand` garaňky fonda okalar ýaly ýagtylandyrylýar:
`#8400FC` → `#A985FF`. Sebäbi `#8400FC` garaňky fonda diňe **3,1:1**
kontrast berýär — talapdan pes.

### Kontrast barada hökmany bellik

| Reňk | Ak fonda | Netije |
|---|---|---|
| `#8400FC` benewşe | **6,2:1** | ✅ ýazgy üçin dogry |
| `#0CA8F0` gök | **2,7:1** | ❌ ýazgy üçin ýaramaýar |

Şonuň üçin **gök diňe doldurgy (fill) we gradient hökmünde** ulanylýar —
hiç haçan kiçi ýazgy üçin däl. Bu düzgün bozulsa, sahypanyň bir bölegi
okalmaz bolýar.

### Gradient — nyşan, bezeg däl

Gradient **diňe üç ýerde** ulanylýar:

1. **Logo nyşany** (`.brand-mark`)
2. **Esasy CTA düwmesi** (`MagneticButton variant="primary"`)
3. **Sözbaşydaky nyşan söz** (`.brand-gradient-text`)

Ondan artyk ulanmak nyşany «arzan» edýär: her ýerde gradient bar bolsa,
ol hiç ýerde bellik bolmaýar.

### «Öň / soň» deňeşdirmesi barada düzgün

**«Öň» ýagdaýy nyşan reňki bilen bellenmeýär** — bitarap çal (`slate`)
durýar.

Näme üçin? Eger «erbet ýagdaý» hem benewşe bolsa, ulanyjynyň aňynda ol
reňk «mesele» manysyny alýar we şol bir reňkdäki CTA düwmesine bolan
ynam peselýär. **Bir reňk — bir many.**

### Reňkleriň paýlanyş düzgüni (60–30–10)

- **60%** — bitarap fonlar (`base`, `surface`)
- **30%** — ýazgylar (`ink`, `muted`)
- **10%** — nyşan reňki (`brand`) we many beriji reňkler (`ok`, `warn`)

Nyşan reňki 10%-den geçse, ol öz güýjüni ýitirýär: ähli zat şol reňkde
bolsa, gözüň nirä seretmelidigi belli bolmaýar.

---

## 3. Tipografiýa

### Şriftler

| Wezipesi | Şrift | Agramy |
|---|---|---|
| Sözbaşylar | **Unbounded** | 700–**900** |
| Esasy ýazgy | **Golos Text** | **450**–700 |
| Sanlar, bellikler, açarlar | **JetBrains Mono** | 400/600 |

**Unbounded** — giň, geometrik, örän häsiýetli display şrift. 900
agramda ulanylýar: sahypa «ýogyn we ynamly» duýulýar.

⚠️ Unbounded adaty şriftlerden **has giň**. Şonuň üçin:
- sözbaşylaryň iň uly ölçegi kiçeldildi (`h1`: 5rem → 3,9rem);
- harp aralygy darlaşdyryldy (`-0.05em` — adaty `-0.03em` ýerine).

Esasy ýazgynyň agramy hem **400 däl-de 450**: Unbounded 900-üň
gapdalynda 400 agramly tekst «inçe» we gowşak görünýär.

Üçüsi hem **kirill** (`cyrillic`) we **giňeldilen latyn** (`latin-ext`)
toplumlaryny doly goldaýar — bu fonts.googleapis.com boýunça barlanyldy.

Bu üç dilli taslamada hökmany şert. Türkmen harplarynyň Unicode ýerleri:

| Harp | Kod | Toplum |
|---|---|---|
| ä ö ü ý | U+00E4, U+00F6, U+00FC, U+00FD | `latin` |
| ň | U+0148 | `latin-ext` |
| ş | U+015F | `latin-ext` |
| ž | U+017E | `latin-ext` |

Şrift `latin-ext` toplumyny goldamasa, `ň` we `ž` harplary başga şrifte
düşýär — söz «döwülen» görünýär. Şonuň üçin täze şrift goşulanda bu barlag
hökmanydyr.

### Ölçeg şkalasy

| Ady | Ölçegi | Setir aralygy | Harp aralygy |
|---|---|---|---|
| `h1` | `clamp(2.5rem, 6.4vw, 5rem)` | 0.98 | −0.04em |
| `h2` | `clamp(2rem, 4vw, 3.25rem)` | 1.08 | −0.03em |
| `h3` | 1.75rem | 1.25 | −0.02em |
| `h4` | 1.375rem | 1.3 | −0.015em |
| `body-lg` | 1.125rem | 1.85 | −0.01em |
| `body` | 1rem | 1.7 | −0.005em |
| `micro` | 0.6875rem | 1rem | +0.08em |

### Mikro-tipografiýanyň düzgünleri

1. **Sözbaşy näçe uly bolsa, harp aralygy şonça dar.** Uly ölçegde
   harplaryň arasy tebigy giňelýär — ony el bilen darlaşdyrmaly.
2. **Kiçi ýazgyda harp aralygy giňedilýär** (`+0.08em`). Bu `micro`
   ölçegdäki ýazgyny okalýan edýär.
3. **Sanlar hemişe `tabular-nums`** (`.tnum` synpy). Şeýle bolmasa,
   tablisada sanlar täzelenende «bökýär».
4. **Setiriň uzynlygy 52–64 harp** (`max-w-[58ch]`). Bundan uzyn setir
   okalanda göz indiki setiri tapmakda kynçylyk çekýär.
5. **`text-wrap: balance`** sözbaşylarda — soňky setirde ýeke söz
   galmagynyň öňüni alýar.

---

## 4. Tor ulgamy (12-column grid)

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

## 5. Hereket we animasiýa

### Wagt we egri (easing)

| Ýagdaý | Dowamlylygy | Egri |
|---|---|---|
| Hover, kiçi geçişler | 200–300ms | `ease-out-expo` |
| Element peýda bolmagy | 600–850ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Süýşýän görkeziji | spring | `stiffness: 320, damping: 30` |
| Skroll animasiýasy | spring | `stiffness: 90, damping: 24` |

**Standart `ease` ulanylmaýar.** Ol interfeýsi «arzan» görkezýär.
Biziň esasy egrimiz — `expo-out`: başda çalt, ahyrynda ýumşak. Bu tebigy
fiziki hereketi ýada salýar.

### Animasiýanyň üç düzgüni

1. **Hereket maglumat bermeli.** Element nireden geldi — şol ýerden
   çykmaly. Ýokardan gelen, ýokara gitmeli.
2. **250ms-den gysga — duýulmaýar, 900ms-den uzyn — ýadadýar.**
3. **Bir wagtda 3-den köp element hereket etmeli däl.** Ondan
   ýokarysy hoşamaýlyk däl-de, bulaşyklyk döredýär.

### Elýeterlilik

```css
@media (prefers-reduced-motion: reduce) { /* ähli animasiýa öçürilýär */ }
```

Ulanyjy ulgam sazlamalarynda hereketi azaltmagy saýlan bolsa, saýt muňa
hökman hormat goýmalydyr. Bu diňe rahatlyk meselesi däl — käbir adamlarda
hereket kelle aýlanmagyna sebäp bolýar.

---

## 6. Mikro-özara täsirler (micro-interactions)

| Element | Effekt | Maksady |
|---|---|---|
| **CTA düwmesi** | Magnit ymtylmasy + ýagtylyk tolkuny | Basmaga çagyrmak |
| **Kabul haty** | Kursor boýunça 3D öwrülme | Janlylyk, «elime alaýyn» duýgusy |
| **MÖHÜR** | `cubic-bezier(.34,1.56,.64,1)` bilen basylmagy | **Sahypanyň esasy pursaty** — maksada ýetmek |
| **Agyry/çözgüt kartasy** | Ýokardan aşak öwrülme | Ýagdaýyň üýtgändigini görkezmek |
| **Timeline** | Skroll boýunça çyzygyň dolmagy | Ilerlemäni duýdurmak |
| **Hatlaryň lentasy** | 62 sek haýal, hover-de saklanýar | Köplük duýgusy, okamaga wagt |
| **Uniwersitet kartasy** | Aşakdaky çyzygyň çepden ýaýramagy | Saýlananlygyny bellemek |
| **FAQ akkordeon** | Plýus → 45° aýlanyp krest | Ýagdaýyň açykdygyny aňlatmak |

### LIQUID GLASS — materialyň gurluşy

Apple-yň «suwuk aýna» materialy dört gatlakdan ybarat. Olaryň
diňe birini goýmak ýeterlik däl:

| Gatlak | CSS | Wezipesi |
|---|---|---|
| 1. Süzgüç | `backdrop-filter: blur() saturate(185%)` | Arkadaky şekil bulaşdyrylýar |
| 2. Reňk | `background-color: rgb(255 255 255 / .55)` | Aýnanyň öz öwüşgini |
| 3. **Gyra** | `inset 0 1px 0 rgba(255,255,255,.62)` + içki halka | **Ýagtylygyň döwülmegi** |
| 4. Spekulýar | `radial-gradient` + `--mx/--my` | Kursoryň yzyndan ýalpyldy |

> **Iň möhüm gatlak — üçünjisi.** Aýnany aýna edýän zat bulaşyklyk
> däl, gyrasyndaky ýagtylygyň döwülmegi. Diňe `blur()` goýulsa, ol
> aýna däl-de «hapa aýna» bolup görünýär.

Goşmaça iki jikme-jiklik:

- **Reňkli gyra** (`.lg::after`) — hakyky aýna ýagtylygy reňklere
  böleýär. Bu ýerde ol markanyň benewşesi we gögi bilen aňladylýar.
- **Gysylma** (`.lg-press:active`) — `scale(0.972)` we
  `cubic-bezier(.34, 1.56, .64, 1)`. Egri biraz «aşa gidip» yzyna
  gelýär — fiziki düwmäniň duýgusy.

### Aýna fonsuz işlemeýär

Liquid Glass materialynyň özi görünmeýär — ol diňe AŞAGYNDAKY zady
görkezýär. Fon tegiz ak bolsa, aýna hem tegiz ak bolýar we effekt
ýitýär.

Şonuň üçin fonda hemişe hereket bolmaly: `AuroraField` komponenti
markanyň iki reňkinden bäş sany uly bulaşyk şekil çyzýar we olary
26–44 sekuntlyk aýlawda haýal süýşürýär. Netijede aýnanyň içindäki
şekil hem üýtgäp durýar.

Diňe `transform` we `border-radius` animasiýa edilýär → GPU-da işleýär.

### Hakyky döwülme (refraction)

`AuroraField`-däki SVG süzgüji (`#liquid-refract`) tolkunly şowhun
döredýär we arkadaky şekili şoňa görä süýşürýär — «suwuk» ýoýulma.

```css
@supports (backdrop-filter: url(#f)) {
  .lg-refract { backdrop-filter: url(#liquid-refract) blur(...); }
}
```

Bu häzirlikçe **diňe Chromium** brauzerlerinde işleýär. Beýlekilerde
`@supports` blogy doly taşlanýar we adaty aýna görnüşi galýar —
sahypa hiç zat ýitirmeýär.

### Animasiýa elementi gizlemeli däl

Giriş animasiýasy `opacity: 0` bilen başlaýan bolsa we JavaScript işlemese,
mazmun hemişelik görünmez bolýar.

Dogry usul: element deslapky ýagdaýda **görnüp dur**, animasiýa bolsa diňe
`.anim` ýaly synp goşulanda işleýär — ony JavaScript goşýar.

```css
/* Ýalňyş */
.row { opacity: 0; animation: in .5s forwards; }

/* Dogry */
.rows.anim .row { opacity: 0; animation: in .5s forwards; }
```

---

## 7. Elýeterlilik (Accessibility) — hökmany talaplar

- **Reňk kontrasty:** esasy ýazgy üçin iň azyndan **4.5:1**, uly sözbaşy
  üçin **3:1**.
- **Fokus halkasy:** `:focus-visible` ähli interaktiw elementde görünýär.
  Ony `outline: none` bilen aýyrmak gadagan.
- **Basylýan meýdan:** iň kiçisi **44×44px** (telefonda barmak ölçegi).
- **Semantik bellikler:** düwme üçin `<button>`, salgy üçin `<a>`.
  `<div onClick>` ulanmak klawiatura bilen işleýän adamlar üçin
  interfeýsi ýapýar.
- **Suratlar:** her manyly suratda `alt`, bezeg suratynda `aria-hidden`.
