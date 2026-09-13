# Next Step Consulting — köpdilli saýt we iki admin paneli

**Next Step Consulting** — türkmen talyplaryny Türkiýäniň uniwersitetlerine
ýerleşdirýän maslahat beriş gullugy (Instagram: `@nextstep.consultancyy`).

Bu taslama şol gulluk üçin taýýarlanan doly binagärlikdir: üç dilli landing
page, mazmun ulgamy we iki sany aýratyn dolandyryş paneli.

---

## 1. Hyzmatyň gerimi

Saýt **diňe esasy hyzmaty** görkezýär:

| ✅ Görkezilýär | ⚪️ Diňe ugrukdyryjy maslahat |
|---|---|
| Uniwersitet we ugur saýlamak | Wiza resmileşdirilişi |
| Resminamalary taýýarlamak we barlamak | Ýaşaýyş jaýy / umumy ýaşaýyş jaýy |
| Arzalary uniwersitetlere tabşyrmak | Uçar peteki we garşylamak |
| Kabul hatyny (Letter of Acceptance) almak | |

Bu gerim `process.scopeNote` açarynda açyk ýazylýar — müşderi nämä
garaşmalydygyny öňünden bilýär.

---

## 2. Taslamanyň düzümi

| Bölek | Wezipesi |
|---|---|
| **Landing page** | Talyby (ýa-da onuň ene-atasyny) ýüztutma öwürmek. Ynandyryş zynjyry + çalt hereket kartalary. |
| **Admin 1 — Ýüztutmalar** | Talyp ýüztutmalaryny dolandyrmak, Kanban tagtasy, resminama barlagy, Telegram bildirişleri. |
| **Admin 2 — Seljerme** | Saýtyň görkezijileri we üç dilli mazmun redaktory. |
| **i18n ulgamy** | Türkmen, rus we türk dilleri. Her dilde **270 açar**, doly gabat gelýär. |

---

## 3. Dizaýn ugry

> **Esasy pikir — «KABUL HATY», markanyň öz reňklerinde.**

**Reňkler markanyň Instagram logosyndan ölçenildi** — toslanylmady:

| Reňk | Bahasy | Hue |
|---|---|---|
| Benewşe (esasy) | `#8400FC` | 271° |
| Gök (gradientiň ikinji ujy) | `#0CA8F0` | 199° |

### Logo

Nyşan Instagram profilindäki **hakyky logodan yzarlanyp** wektora
geçirildi — [`Logo.tsx`](src/components/shared/Logo.tsx):

| Näme üçin SVG, asyl surat däl |
|---|
| Instagram CDN salgylarynyň möhleti gutarýar (`oe=` parametri) |
| Asyl surat 150×150 piksel — Retina ekranda bulaşyk çykýar |
| SVG islendik ölçegde arassa, göwrümi ~0,6 KB |
| Reňkleri tema boýunça sazlap bolýar |

**Ölçenen geometriýa** (40×45 piksel): iki sany 180° simmetrik şekil —
ýokarky-çep benewşe, aşaky-sag gök, aralarynda 3 piksellik ak jaý.
Netijede negatiw giňişlikde «N» harpy okalýar.

Logo şu ýerlerde ulanylýar: menýu, aşaky bölüm, iki admin paneli,
brauzeriň nyşany ([`icon.svg`](src/app/icon.svg)) we paýlaşmak üçin
aýratyn faýl ([`public/logo.svg`](public/logo.svg)).

> ⚠️ Sizde logonyň **asyl wektor faýly** (SVG / AI / PDF) bar bolsa,
> ony `Logo.tsx`-e goýuň — yzarlama diňe wagtlaýyn çözgüt.

### Gradient

- **Logonyň özünde gradient ÝOK** — ol iki düz reňkli şekilden ybarat.
- Gradient şol reňk geçişiniň dowamy hökmünde **diňe üç ýerde**
  ulanylýar: esasy CTA, sözbaşydaky nyşan söz we karta gyralary.
- **Esasy tema — ÝAGTY**. Garaňky tema (Instagram postlaryňyzyň indigo
  äheňinde) doly işleýän ikinji görnüş.
- **Gök reňk ýazgy üçin ulanylmaýar** — ak fonda 2,7:1 kontrast berýär.
  Diňe doldurgy we gradient hökmünde.
- «Öň/soň» deňeşdirmesinde nyşan reňki **ulanylmaýar**: bitarap çal
  (`--c-slate`) durýar. Bir reňk — bir many.
- **Hero-nyň wizualy** stok surat däl: ol talybyň almak isleýän zadynyň özi —
  sahypa açylanda hat ýazylýar we üstüne möhür basylýar.

Jikme-jik: [`docs/01-dizayn-ulgamy.md`](docs/01-dizayn-ulgamy.md)

---

## 3.1. Bäsdeş seljermesi — `alibabaacademy.com`

| Olarda bar | Bizde nähili |
|---|---|
| Hero-nyň aşagynda dört çalt hereket kartasy | **Alyndy** — `QuickActions.tsx` |
| WhatsApp goldawynyň öňe çykarylmagy | **Alyndy** — kartada we hero-nyň aşagynda |
| Ýeňillik/burs çagyryşy | **Alyndy**, ýöne göterimsiz: «ýeňillik mümkinçilikleri barada anyk maglumat» |
| «%99,8 kabul», «%75-e çenli burs», «10117+ talyp» | **Alynmady** — barlanmaýan san ýazylmaýar |
| Giňeldilen hyzmat sanawy (wiza, denklik, terjime) | Gerimden daşarda — `scopeNote` arkaly açyk aýdylýar |
| Saýtda galan `lorem ipsum` ýazgylary | — (olaryň açyk gowşaklygy) |

**Biziň artykmaçlygymyz:** aç-açanlyk. Olarda barlanmaýan sanlar we
doldurylmadyk bölümler bar; bizde her tassyklama ýa barlanýar, ýa-da
«görkezme maglumat» diýlip bellenýär.

---

## 4. Tehnologiýalar

| Tehnologiýa | Näme üçin şu saýlandy |
|---|---|
| **Next.js 15 (App Router)** | Serwer komponentleri sahypany çalt ýükleýär; SEO üç dilde-de işleýär. |
| **Tailwind CSS** | Dizaýn tokenleri CSS üýtgeýjilerde — tema çalyşmak bir gatlakda. |
| **next-intl** | Dil URL-de görünýär (`/tm`, `/ru`, `/tr`) — SEO we paýlaşmak üçin möhüm. |
| **Framer Motion** | Mikro-animasiýalar we `prefers-reduced-motion` goldawy. |
| **@dnd-kit** | Kanban tagtasy; klawiatura bilen hem işleýär. |
| **Recharts** | Seljerme grafikleri; SVG esasly, islendik ölçegde arassa. |
| **Zod + React Hook Form** | Formanyň barlagy brauzerde we serwerde bir shema boýunça. |

### Şriftler

Üçüsi hem `cyrillic` we `latin-ext` toplumlaryny doly goldaýar
(fonts.googleapis.com boýunça barlanyldy) — türkmençäniň **ä ň ö ş ü ý ž**
harplary hem rus kirillisi bir stilde çykýar.

| Wezipesi | Şrift |
|---|---|
| Sözbaşylar | **Wix Madefor Display** 600–800 |
| Esasy ýazgy | **Golos Text** 400–600 |
| Sanlar we bellikler | **JetBrains Mono** 400/600 |

---

## 5. Bukjalaryň gurluşy

```
Next_step/
├── messages/                    # Üç dildäki ähli ýazgylar
│   ├── tm.json                  #   Türkmen dili (ESASY NUSGA)
│   ├── ru.json                  #   Rus dili
│   └── tr.json                  #   Türk dili
│
├── public/
│   └── logo.svg                 # Logo — paýlaşmak we daşarky ulanyş üçin
│
├── preview/
│   └── dizayn-ulgamy.html       # Interaktiw dizaýn görkezmesi
│
├── src/
│   ├── middleware.ts            # Dil kesgitlemesi + admin goragy
│   │
│   ├── app/
│   │   ├── icon.svg             # Brauzeriň nyşany (logo)
│   │   ├── globals.css          # Tema gatlagy: Ýagty / Garaňky tokenler
│   │   ├── [locale]/
│   │   │   ├── layout.tsx       # Şriftler, metadata, tema skripti
│   │   │   ├── page.tsx         # Landing — bölümleriň tertibi
│   │   │   └── admin/
│   │   │       ├── satuw/       # ADMIN 1 — ýüztutmalar
│   │   │       └── analitika/   # ADMIN 2 — seljerme we mazmun
│   │   └── api/
│   │       └── leads/route.ts   # Ýüztutmany kabul etmek + Telegram
│   │
│   ├── components/
│   │   ├── landing/             # Hero, QuickActions, ProblemSolution,
│   │   │                        # HowItWorks, Universities, SocialProof,
│   │   │                        # FinalCta, Faq, LeadForm
│   │   ├── admin/               # AdminShell, KanbanBoard, TelegramWidget,
│   │   │                        # AnalyticsCharts, ContentManager, LiveVisitors
│   │   ├── ui/                  # MagneticButton, Reveal, PaperGlow, ScrollProgress
│   │   └── shared/              # Logo, Header, Footer
│   │
│   └── lib/
│       ├── i18n.ts              # Dilleriň merkezi sazlamasy
│       ├── types.ts             # Maglumat nusgalary + resminama barlagy
│       ├── telegram.ts          # Bot API (diňe serwerde)
│       ├── utils.ts             # Kömekçi funksiýalar
│       └── mock-data.ts         # Görkezme maglumatlar
│
└── docs/                        # Jikme-jik dokumentasiýa (türkmen dilinde)
```

---

## 6. Işe girizmek

```bash
npm install
```

`.env.local` faýlyny dörediň:

```bash
TELEGRAM_BOT_TOKEN=123456:AAE...      # @BotFather-den alynýar
TELEGRAM_CHAT_ID=-1002xxxxxxxxx       # Kanalyň ýa-da toparyň ID belgisi
```

```bash
npm run dev
```

| Salgy | Sahypa |
|---|---|
| `localhost:3000/tm` | Türkmen dilindäki saýt |
| `localhost:3000/ru` | Rus dilindäki saýt |
| `localhost:3000/tr` | Türk dilindäki saýt |
| `localhost:3000/tm/admin/satuw` | Admin 1 — ýüztutmalar |
| `localhost:3000/tm/admin/analitika` | Admin 2 — seljerme |

---

## 7. Dokumentasiýa

| Faýl | Mazmuny |
|---|---|
| [`docs/01-dizayn-ulgamy.md`](docs/01-dizayn-ulgamy.md) | Reňkler, tipografiýa, tor, animasiýa düzgünleri |
| [`docs/02-landing-arkitektura.md`](docs/02-landing-arkitektura.md) | Her bölümiň maksady we konwersiýa mantygy |
| [`docs/03-admin-panelleri.md`](docs/03-admin-panelleri.md) | Iki paneliň binagärligi, kabul tapgyrlary, maglumat akymy |
| [`docs/04-kopdillilik.md`](docs/04-kopdillilik.md) | i18n gurluşy, terjime tertibi, SEO |

---

## 8. ⚠️ Işe girizmezden öň hökman ediljek işler

### Etika we hukuk

1. **Kabul hatlary we talyplaryň pikirleri** häzir **görkezme (demo)
   maglumatlardyr** we saýtda sary bellik bilen açyk görkezilýär.
   Çap etmezden öň:
   - her talypdan **ýazmaça razylyk** alynmalydyr (`consentGiven` meýdany
     `types.ts`-de hökmany edildi);
   - hatyň şekilindäki **şahsy maglumatlar bulaşdyrylmalydyr** (pasport
     belgisi, doly at, e-poçta);
   - toslama seslenmäni hakyky hökmünde ýerleşdirmek — kanuny töwekgelçilik.

2. **Uniwersitetleriň logotipleri ulanylmaýar.** Olar hukuk taýdan goralan
   nyşanlardyr. Häzir her uniwersitet bitewi stildäki gysgaltma bilen
   görkezilýär (BAU, IGU…). Rugsat alnandan soň `University.logoUrl`
   arkaly hakyky logotip goşulyp bilner.

3. **Uniwersitetler bilen hyzmatdaşlygyň derejesi** barada tassyklama
   ýazylmady («göni hyzmatdaşlyk», «resmi wekil» ýaly sözler ýok) —
   sebäbi ol maglumat barlanmady. Resmi şertnama bar bolsa, ony
   `universities.subtitle` açarynda goşup bolar.

### Tehniki

4. **Baglanyşyk maglumatlary** ([Footer.tsx](src/components/shared/Footer.tsx))
   — Instagram profilinden alnan telefonlar goýuldy, e-poçta salgysy
   (`info@nextstep.tm`) **çalşyrylmaly**.

5. **Maglumat gory** — häzir [`mock-data.ts`](src/lib/mock-data.ts);
   hakyky gor (Supabase / PostgreSQL) birikdirilmelidir.

6. **Giriş ulgamy** — [`middleware.ts`](src/middleware.ts)-däki rol barlagy
   kuki esasly görkezmedir; NextAuth ýa-da Supabase Auth goşulmaly.

7. **Sanly tassyklamalar.** Häzirki sanlar barlanýan zatlar: 5 uniwersitet,
   4 ädim, 3 dil. «98% kabul» ýaly barlanmaýan görkeziji **bilkastlaýyn
   ýazylmady** — şeýle san goşuljak bolsa, ol hakyky hasabata esaslanmalydyr.
