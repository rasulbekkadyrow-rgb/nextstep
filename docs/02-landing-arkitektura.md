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
2. AGYRY/ÇÖZGÜT ..... «Olar meniň ýagdaýymy bilýärmi?»
3. IŞ TERTIBI ....... «Bu nähili işleýär? Näçe wagt gerek?»
4. UNIWERSITETLER ... «Haýsy uniwersitetler barada gürrüň gidýär?»
5. NETIJELER ........ «Bu hakykatdan hem işleýärmi?»
6. TEKLIP + FAQ ..... «Ýitirjek zadym barmy?»
```

---

## 1. Hero bölümi

**Maksady:** ilkinji 3 sekuntda «men dogry ýere geldim» duýgusyny bermek.

### Esasy dizaýn pikiri — hatyň möhürlenmegi

Sagdaky wizual stok surat däl (gülüp duran talyplar, kitaphana, uniwersitetiň
binasy). Ol **talybyň almak isleýän zadynyň özi** — resmi kabul haty.

Sahypa açylanda:

1. Hat peýda bolýar (0.28 sek).
2. Setirler birin-birin «ýazylýar» (0.35 sek-dan başlap, 0.1 sek aralyk).
3. Üstüne **«KABUL EDILDI» möhüri basylýar** (0.78 sek-da).

Möhüriň egrisi `cubic-bezier(0.34, 1.56, 0.64, 1)` — ol biraz «aşa geçip»
yzyna gelýär, ýagny hakyky möhür basylyşyny ýada salýar.

**Näme üçin şeýle?** Sebäbi maksadyň şekilini görkezmek, hyzmaty
suratlandyrmakdan güýçli. Ulanyjy 1,5 sekuntda öz gelejegini görýär.

> **Tehniki bellik:** setirler we möhür deslapky ýagdaýda **görnüp dur**.
> Animasiýa diňe `.anim` synpy goşulanda işleýär, ony bolsa JavaScript
> goşýar. Şeýlelikde skript işlemese-de mazmun okalýar. `opacity: 0`
> bilen «garaşyp duran» element — elýeterlilik taýdan ýalňyşlyk.

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

### Sanlar barada

Hero-daky üç san **barlanýan** zatlar: 5 uniwersitet, 4 ädim, 3 dil.
«98% kabul», «500+ talyp» ýaly barlanmaýan görkezijiler bilkastlaýyn
ýazylmady — şeýle san diňe hakyky hasabata esaslanyp goşulmalydyr.

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

### Reňk barada möhüm karar

«Öň» ýagdaýy **gyzyl bilen bellenmeýär** — bitarap çal (`--c-slate`)
ulanylýar.

Sebäbi nyşan reňkimiz gyzyl. Eger «erbet ýagdaý» hem gyzyl bolsa, ulanyjynyň
aňynda gyzyl reňk «howp» manysyny alýar we CTA düwmesine bolan ynam peselýär.
Bir reňk bir many bilen baglanmalydyr.

### Çalyşmagyň iki derejesi

- **Umumy çeňňek** — ähli kartalary birbada çalyşýar.
- **Her kartanyň özi** — üstüne basylanda diňe şol karta çalyşýar.

Sebäbi ulanyjylar iki topara bölünýär: käbiri umumy göz aýlaýar, käbiri her
nokady aýratyn öwrenýär.

---

## 3. Iş tertibi bölümi

**Maksady:** nämälimligi aýyrmak.

### Skroll bilen dolýan timeline

```
useScroll    → bölümiň içindäki ilerlemäni 0–1 aralygynda berýär
useSpring    → hereketi ýumşadýar
useTransform → 0–1 sany çyzygyň beýikligine öwürýär
useInView    → her ädimi aýratyn yzarlaýar
```

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

Bu bölümiň ýeri bilkastlaýyn Iş tertibinden **soň**, Netijelerden **öň**:
tanalýan uniwersitetiň ady prosese ynamy berkidýär we indiki bölümdäki
kabul hatlaryny has manyly edýär.

### Logotip ulanylmaýar

Uniwersitetleriň logotipleri hukuk taýdan goralan nyşanlardyr; olary
rugsatsyz ýerleşdirmek töwekgelçilikdir. Onuň deregine her uniwersitet öz
gysgaltmasy (BAU, IGU, ISU, IAU, MED) bilen, bir bitewi stilde görkezilýär.

Bu karar hem hukuk taýdan arassa, hem wizual taýdan tertipli: dürli hilli
we dürli reňkli logotipler sahypanyň sazlaşygyny bozýar.

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
