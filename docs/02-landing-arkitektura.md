# 02 — Landing page-iň binagärligi we konwersiýa mantygy

Landing page tötänleýin bölümleriň ýygyndysy däl. Ol **ynandyryş zynjyry**:
her bölüm öňki bölümde döreýän soraga jogap berýär.

Bu taslamada ýene bir aýratynlyk bar: **okaýan adam iki sany**. Talybyň özi
we onuň ene-atasy. Ikisiniň soragy tapawutly:

| Talyp soraýar | Ene-ata soraýar |
|---|---|
| Haýsy uniwersitet gowy? | Puly ýitirmerinmi? |
| Türk dilini bilemok, bolarmy? | Bu adamlar ynamlymy? |
| Dostlarym nirede okaýar? | Çagam ýeke galmazmy? |

Şonuň üçin sahypada duýgy (talyp üçin) we delil (ene-ata üçin) gezekleşip
gelýär: Hero we Uniwersitetler — talyp üçin; Iş tertibi, Kabul hatlary we
Kepillik — ene-ata üçin.

```
1. HERO ............. «Bu näme? Maňa gerekmi?»
2. ÇALT HEREKET ..... «Maňa haýsysy gerek?»
3. NETIJELER ........ «Bu hakykatdan hem işleýärmi?»
4. UNIWERSITETLER ... «Haýsy uniwersitetler barada gürrüň gidýär?»
5. KYNÇYLYK/ÇÖZGÜT .. «Olar meniň ýagdaýymy bilýärmi?»
6. IŞ TERTIBI ....... «Bu nähili işleýär? Näçe wagt gerek?»
7. TEKLIP + FAQ ..... «Ýitirjek zadym barmy?»
```

⚠️ **NETIJELER bölümi ýokary göterildi.** Öň ol iň soňdan üçünji durýardy.
Emma bu işde adamyň ilki görmek isleýän zady WADA däl, **NETIJE**:
hakykatdan-da kabul edilen talyplaryň hatlary. Şonuň üçin olar hero-dan
soň bada-bat gelýär, yzyndan bolsa şol hatlaryň gelen uniwersitetleri.

⚠️ **ÇALT HEREKET paneli hero-dan soň gelmeli — başga ýerde däl.** Onuň ak
paneli hero-nyň aşaky gyrasyna **münýär** (`-mt-24`), ýagny ikisi bir
kompozisiýa. Aralaryna başga bölüm goýulsa, panel boş ýere münüp, kesişen
iki gatlak bolup galýar.

### Reňk ritmi

```
ak → ak → çal → ak → GOÝY → çal → ak → GOÝY
```

Goýy zolak sahypada takyk iki gezek: ortada (kynçylyk/çözgüt) we ahyrda
(aşaky bölüm). Ol gözi saklaýar we sahypany üç bölege bölýär — ýogsam
7 bölüm biri-birine ýelmeşip, uzyn lenta bolýar.

---

## 1. Hero bölümi

**Maksady:** ilkinji 3 sekuntda «men dogry ýere geldim» duýgusyny bermek.

### Esasy dizaýn pikiri — talyplaryň banneri

Bütin bölümiň arkasynda **talyplaryň suraty** ýatýar, ýazgy bolsa onuň çep
ýarymynda durýar. Bu bilim saýtlarynyň iň synalan kompozisiýasy: surat
duýgy berýär, ýazgy şerti aýdýar.

Surat `public/banner/` papkasyndan awtomat okalýar (şol papkadaky
README-de doly düzgünler). Papka boş bolsa `HeroBackdrop` komponentindäki
çyzylan şekil — Stambulyň kenary — onuň ýerini tutýar, ýagny saýt surat
goşulmanka-da gutarylan görünýär.

#### ⚠️ PERDE (scrim) — iki ölçeg üçin iki görnüş

Suratyň üstündäki ýazgynyň okalmagy üçin ak perde goýulýar. Bir gradient
iki ýagdaýy hem edip bilmeýär, şonuň üçin iki gatlak bar:

| Ekran | Perdäniň ugry | Sebäbi |
|---|---|---|
| Telefon | ÝOKARDAN AŞAK, güýçli | Ýazgy suratyň ÜSTÜNDE dur, gapdalda ýer ýok |
| Uly ekran | ÇEPDEN SAGA, sagda dury | Ýazgy çepde, surat sagda görünmeli |

Şol sebäpden **banner suratynda talyplaryň ýüzleri SAG ÝARYMDA bolmaly** —
çepde durýan adam ak perdäniň aşagynda ýitýär.

#### ⚠️ Öňki görnüşden näme aýryldy

| Näme bardy | Näme üçin aýryldy |
|---|---|
| Aýna «marka paneli» (3D öwrülýän, açylýan kapsula) | Sahypanyň ýarysyny eýeleýärdi we sözbaşy bilen bäsleşýärdi. Marka ýokarky panelde onsuz hem bar |
| Paralaks süýşme | Ilkinji ekranda düwmäniň ýerini durnuksyz edýärdi |
| Harplaryň blur bilen gelmegi | Sözbaşy — sahypanyň iň möhüm ýazgysy. Ol garaşdyrman okalmaly |
| Aurora fon animasiýasy | Suratyň özi onuň wezipesini ýerine ýetirýär |

Netijede bölüm **serwer komponenti** boldy: `framer-motion` ýok,
`'use client'` ýok, ölçeg hasaplamasy ýok. Ilkinji ekran brauzere doly
taýýar gelýär.

### Sözbaşynyň ýazylyş düzgüni

Kör-körän wada berilmeýär:

| ❌ Ýalňyş | ✅ Dogry |
|---|---|
| «Arzuwyňdaky uniwersitete girer ýaly!» | «Türkiýäniň uniwersitetine **kabul hatyny** almagyň dogry ýoly» |
| «Iň gowy bilim maslahaty» | Ýokarky sözbaşy + «Siz diňe okuwa taýýarlanyň» |

Ýokarky kiçi ýazgy (overline) hökmünde gullugyň **öz şygary** ulanylýar:
*«Gelejege tarap ilkinji we iň dogry ädim»*.

### Üç dildäki sözbaşylar

| Dil | Sözbaşy |
|---|---|
| **TM** | Türkiýäniň uniwersitetine **kabul hatyny** almagyň dogry ýoly |
| **RU** | Верный путь к **письму о зачислении** в университет Турции |
| **TR** | Türkiye'deki üniversiteden **kabul mektubu** almanın doğru yolu |

Üç dilde-de many bir; nyşan sözi (gyzyl, asty çyzykly) her dilde iň güýçli
bölege düşýär.

### ⚠️ Sanlar barada — sahypanyň üýtgewsiz düzgüni

Hero-da **hiç hili san ýok**. «%99,8 kabul», «10 000+ talyp», «%75-e
çenli ýeňillik» ýaly görkezijiler bäsdeşleriň saýtlarynda köp, emma biz
olary gaýtalamaýarys.

Sebäbi: **barlanmaýan san — bir gezeklik ynam.** Müşderi ony barlap
bilýär, barlap bilmese-de beýleki wadalary şoňa görä bahalandyrýar.
Şeýle san diňe hakyky hasabata esaslanyp goşulmalydyr.

Onuň deregine sahypada **barlanýan delil** görkezilýär: kabul hatlarynyň
skanlary we uniwersitetleriň anyk atlary.

---

## 2. Agyry we çözgüt bölümi

**Maksady:** müşderi özüni tanamaly.

### Dört agyry nokady

| Agyry (özbaşdak) | Çözgüt (biz bilen) |
|---|---|
| Haýsy uniwersiteti saýlamalydygy belli däl | Size laýyk gelýän anyk sanaw |
| Resminamalar yzyna gaýtarylýar | Barlanan we doly resminama bukjasy |
| Möhletler sypdyrylýar | Möhletler öňünden meýilleşdirilýär |
| Araçylar aýdyň işlemeýär | Aç-açan tertip we hemişelik habarlaşyk |

Dördünji nokat — **iň möhümi**. Bu ugurda müşderiniň esasy gorkusy hyzmatyň
hili däl-de, aldanmak gorkusy. Şonuň üçin ol aýratyn bellendi.

### Bölüm goýy zolakda

Bu — sahypanyň ortasyndaky ýeke-täk garaňky bölüm. Ak sahypada goýy zolak
iň güýçli şekil kontrasty berýär: göz şol ýerde saklanýar. Şonuň üçin
markanyň iň esasy wadasy hut şu ýerde aýdylýar.

### ⚠️ TERTIP: ÖŇKI ÇÖZGÜT, SOŇKY AGYRY

Her kartada ilki **çözgüt** durýar (ýogyn sözbaşy), kynçylyk bolsa aşakda,
inçe setirde bellik hökmünde galýar.

Sebäbi ulanyjy kynçylygyny onsuz hem bilýär — oňa ony ýene bir gezek
okatmak gerek däl. Oňa gerek zat: «bu nähili çözülýär?»

### ⚠️ «Öň / soň» çeňňegi näme üçin aýryldy

Öň bu bölümde çeňňek (switch) bardy: kartalar basylanda 3D öwrülýärdi,
gyrasyndan reňkli şöhle aýlanýardy.

Ol interaktiwdi, ýöne **MAZMUNY GIZLEÝÄRDI**: sahypa açylanda ulanyjy diňe
KYNÇYLYKLARY görýärdi — çözgütleri görmek üçin basmalydy. Basmaýan adam
(köpçüligi) sahypadan **diňe erbet habar** alyp gidýärdi.

Indi iki tarap hem birbada görünýär.

### Reňk barada möhüm karar

Kynçylyk setiri **gyzyl bilen bellenmeýär** — bitarap `deep-muted`
ulanylýar, çözgüt bolsa ýaşyl (`ok`) bellik alýar. Sebäbi reňk many
göterýär: nyşan reňki (benewşe) diňe HEREKETE çagyrýar, gyzyl (`danger`)
diňe forma ýalňyşlaryna degişli. **Bir reňk — bir many.**

---

## 3. Iş tertibi bölümi

**Maksady:** nämälimligi aýyrmak.

### Statik timeline

Dört ädim dik çyzyk boýunça nomerlenen nokatlar bilen baglanýar. Çyzyk
**statik**: ol diňe ädimleriň baglydygyny görkezýär.

### ⚠️ Skroll bilen dolýan çyzyk näme üçin aýryldy

Öň çyzyk skroll bilen dolýardy (`useScroll` + `useSpring`), her ädim
bolsa ekrana girende saga süýşüp gelýärdi. Üç mesele döredýärdi:

1. Skroll her kadrda hasap talap edýärdi — telefonda duýulýardy.
2. Çalt skroll edeniňde ädimler ýarym görünen ýagdaýda galýardy.
3. **Iň esasysy: hereket MAZMUNY gowulandyrmaýardy.** Ulanyja gerek zat —
   näçe wagt gerekdigi we näme aljakdygy, çyzygyň nähili dolýandygy däl.

Bölüm indi serwer komponenti — JavaScript asla gerek däl.

### Her ädimiň gurluşy

| Element | Näme üçin gerek |
|---|---|
| Belgi (01–04) | Hakyky yzygiderligi aňladýar — bezeg däl |
| Möhlet | Iň köp berilýän sorag: «näçe wagt gerek?» |
| Düşündiriş | Näme bolýandygyny beýan edýär |
| Içindäki işler | Jikme-jikligi isleýänler üçin |
| **Eliňize gowşýan netije** | **Iň möhüm ynam nokady** |

«Eliňize gowşýan netije» setiri aýratyn gyzyl çarçuwada. Sebäbi bu ugurda
iň uly gorky: *«pul tölärin, elime hiç zat düşmez»*. Her ädimde anyk
resminamanyň agzalmagy şol gorkyny aýyrýar:

```
01 → Tölegleri görkezilen 3–5 uniwersitetiň sanawy
02 → Barlagdan geçen doly resminama bukjasy
03 → Tabşyrylan arzalaryň hasabaty we yzarlaýyş belgileri
04 → Resmi kabul haty (Letter of Acceptance)
```

### Gerim belligi (scope note)

Bölümiň aşagynda anyk ýazylýar: wiza, ýaşaýyş jaýy we uçuş meseleleri
esasy hyzmata girmeýär, olar boýunça diňe ugrukdyryjy maslahat berilýär.

**Näme üçin bu öňe çykarylýar?** Sebäbi garaşyşyň dogry bolmagy soňra
düşünişmezligiň öňüni alýar. Gizlenen çäk — ýitirilen ynam.

---

## 4. Uniwersitetler bölümi

**Maksady:** hyzmatyň barlanýan bölegini görkezmek.

Bu bölümiň ýeri bilkastlaýyn **Netijelerden soň**: ulanyjy kabul hatlaryny
görüp, «bular haýsy uniwersitetler?» diýip soraýar — jogap bada-bat
gapdalynda dur.

### Logotipler — bar bolsa

Hakyky logo `public/universities/<slug>.png` faýly bar bolsa görkezilýär,
ýok bolsa onuň ýerine bitewi stildäki monogram (BAU, IGU…) galýar. Şol bir
`UniversityLogo` komponenti ikisini hem çözýär.

> ⚠️ **Logotipler hukuk taýdan goralan nyşanlardyr** — olary goýmazdan öň
> uniwersitetden rugsat alynmalydyr. Rugsat ýok bolsa faýly goşmaly däl:
> monogram doly işleýän ätiýaçlyk çözgütdir.

**Ak tegelek tagta.** Uniwersitetleriň logotipleri dürli: gara-gök, goýy
gyzyl, ýaşyl, käbiri aç-açan fonly, käbiri ak gutuly. Ak tegelek olaryň
hemmesine bir hili, tertipli gap berýär — hakyky nyşan tagtalarynda
edilişi ýaly. Şonsuz her logo öz ölçeginde we öz fonunda görnüp, sanaw
dargaýardy.

**Hyzmatdaş uniwersitetler** lentada çep gyrasyndaky benewşe zolak bilen
bellenýär, lentanyň aşagynda bolsa şol belliginiň manysy ýazgy bilen
düşündirilýär — maglumat diňe reňk bilen berilmeýär.

---

## 5. Netijeler bölümi

**Maksady:** töwekgelçiligi peseltmek.

Bu işde iň güýçli subutnama — **kabul haty**. Ol hyzmatyň netijesiniň özi:
görüp bolýan, sanap bolýan zat.

### Üznüksiz lenta (marquee)

Hatlar iki hatarda, garşylyklaýyn ugurda, haýal (62 sek) süýşýär.

| Sebäp | Düşündiriş |
|---|---|
| **San duýgusy** | Statik tor 6 kartany görkezýär. Lenta «bularyň soňy ýok» duýgusyny berýär — hakyky sanyny aýtman, köplügi aňladýar. |
| **Ýer tygşytlylygy** | Az ýer tutýar, köp görkezýär. |
| **Haýal tizlik** | Okamaga ýetişýärsiň. Çalt lenta mahabat bannerine meňzeýär. |

Kursor üstüne gelende lenta saklanýar (`animation-play-state: paused`) —
haýsydyr bir haty okamak islese, ol gaçyp gitmeýär.

### ⚠️ Etika duýduryşy

Häzir hatlar we pikirler **görkezme maglumatlardyr** we bölümiň ýokarsynda
sary bellik bilen açyk görkezilýär. Çap etmezden öň:

1. Her talypdan **ýazmaça razylyk** alynmalydyr. `AcceptanceLetter`
   görnüşinde `consentGiven` meýdany hökmany edildi — razylyk bolmasa,
   hat saýtda görkezilmeýär.
2. Hatyň şekilindäki **şahsy maglumatlar bulaşdyrylmalydyr** (blur):
   pasport belgisi, doly at, e-poçta, salgy.
3. Toslama seslenmäni hakyky hökmünde ýerleşdirmek kanuny töwekgelçilikdir
   we bir gezek ýüze çyksa, gazanylan ähli ynam ýitýär.

---

## 6. Jemleýji bölüm

### Töwekgelçiligi ýapmagyň dört gatlagy

1. **Girişiň bahasy = 0** — ilkinji maslahat tölegsiz.
2. **«Töleg diňe netije boýunça»** — baha diňe uniwersitet saýlanandan soň.
3. **FAQ** — her sorag bir garşylygy ýapýar.
4. **Çäklilik** — «Galan orun: 12» (möwsümiň hakyky kuwwaty).

### FAQ-yň soraglary

Alty soragyň bäşisi bu ugurda hakykatdan hem iň köp berilýän soraglar:

1. Türk dilini bilmesem bolarmy? *(iň ýygy gorky)*
2. Haýsy resminamalar gerek?
3. Attestatym entek elimde ýok, arza berip bilerinmi?
4. Bahasy näçe?
5. Kabul haty näçe wagtda gelýär?
6. Wiza we ýaşaýyş jaýy meselesini hem çözýärsiňizmi? *(gerimi
   aýdyňlaşdyrýan sorag)*

### Formanyň konwersiýa düzgünleri

| Karar | Sebäbi |
|---|---|
| Diňe **3** hökmany meýdan | Her goşmaça meýdan konwersiýany peseldýär |
| «Gutarýan ýyl» hökmany | Ýüztutmanyň gyssaglylygyny kesgitleýär — şu ýyl gutarýan talyp bilen derrew habarlaşmaly |
| «Ugry» islege görä | Talyplaryň bir bölegi entek karar bermedik; hökmany saýlaw olary gorkuzýar |
| WhatsApp ileri tutulýar | Bu diňleýji üçin esasy habarlaşyk kanaly |
| Bal gaby (honeypot) | Robotlary saklaýar, adamlara päsgel bermeýär |

---

## 7. Öndürijilik maksatlary

| Görkeziji | Maksat |
|---|---|
| **LCP** | < 2.5 sek |
| **CLS** | < 0.1 |
| **INP** | < 200 ms |
| JavaScript göwrümi | < 180 KB (gysylan) |

Myhmanlaryň **78%-i telefonda** — talyplar üçin bu adaty. Şonuň üçin
dizaýn ilki mobil ekran üçin gurulýar we öndürijilik ölçegleri hem
mobil enjamda barlanmalydyr.
