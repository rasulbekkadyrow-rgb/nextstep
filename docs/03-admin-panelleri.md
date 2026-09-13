# 03 — Iki admin paneliniň binagärligi

Taslamada **bir ulgam, iki aýratyn iş ýeri** bar. Her dolandyryjy diňe öz
wezipesine degişli gurallary görýär.

```
                    ┌─────────────────────┐
                    │   Landing page      │
                    │   (TM / RU / TR)    │
                    └──────────┬──────────┘
                               │ ýüztutma
                               ▼
                    ┌─────────────────────┐
                    │  POST /api/leads    │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
     ┌────────────────────┐        ┌────────────────────┐
     │  Maglumat gory     │        │  Telegram bildiriş │
     └─────────┬──────────┘        └────────────────────┘
               │
     ┌─────────┴──────────┐
     ▼                    ▼
┌──────────────┐   ┌──────────────────┐
│  ADMIN 1     │   │  ADMIN 2         │
│  Ýüztutmalar │   │  Seljerme/Mazmun │
└──────────────┘   └──────────────────┘
```

---

## 1. Näme üçin panel ikä bölündi?

| Sebäp | Düşündirişi |
|---|---|
| **Wezipeleriň arassalygy** | Ýüztutma dolandyryjysyna gatnaw grafigi gerek däl, mazmun dolandyryjysyna talybyň telefony gerek däl. |
| **Şahsy maglumatlaryň goragy** | Talyplaryň pasport we habarlaşyk maglumatlary **diňe Admin 1-de**. Mazmun bilen işleýän adam olary görmeýär. |
| **Ýalňyşlyklaryň azalmagy** | Mazmun redaktoryna elýeterliligi bolmadyk adam saýtyň ýazgysyny tötänden bozup bilmeýär. |
| **Öwrenişmegiň tizligi** | Az düwme — çalt öwrenmek. |

Umumy gabyk (`AdminShell.tsx`) bolsa bir — kod iki gezek ýazylmaýar we
iki panel bir ulgam ýaly duýulýar.

---

## 2. Rollar we gorag

`src/middleware.ts` faýlynda:

| Rol | Elýeterli bölüm |
|---|---|
| `sales` | `/[dil]/admin/satuw` |
| `analytics` | `/[dil]/admin/analitika` |
| `owner` | Ikisi-de |

Barlagyň mantygy:

1. Giriş edilmedik bolsa → giriş sahypasyna ugrukdyrylýar.
2. Rol gabat gelmese → öz paneline gaýtarylýar.

> **Bellik:** häzirki barlag kuki esasly **görkezmedir**. Önümçilikde
> NextAuth ýa-da Supabase Auth bilen çalşyrylmalydyr. Şertiň mantygy
> üýtgemeýär — diňe maglumatyň çeşmesi üýtgeýär.

---

## 3. ADMIN 1 — Talyp ýüztutmalarynyň dolandyryjysy

### Ekranyň gurluşy

```
┌──────────────────────────────────────────────────────┐
│  Dört esasy görkeziji (KPI)                          │
├───────────────────────────────────┬──────────────────┤
│   KANBAN TAGTASY                  │  TELEGRAM        │
│   (günüň esasy iş meýdany)        │  WIDGETI         │
└───────────────────────────────────┴──────────────────┘
```

### Görkezijileriň saýlanyşy

| Görkeziji | Näme üçin şu |
|---|---|
| Şu günki täze ýüztutmalar | Jogap berilmedik adam galmaly däl |
| Iş alnyp barylýan | Häzirki ýüküň göwrümi |
| Şu aýda alnan kabul haty | Hakyky netije |
| **Resminamasy ýetmeýän** | **Bu işde iň ýygy gijikdiriji sebäp** |

Dördünji görkeziji bilkastlaýyn öňe çykaryldy: kabul prosesiniň togtamagynyň
esasy sebäbi hyzmatyň hili däl-de, ýygnalmadyk resminama.

### Kanban tagtasynyň ýedi tapgyry

Tertip hakyky prosesi yzarlaýar — her tapgyr diňe özünden öňkiden soň
gelip bilýär:

| № | Tapgyr | Manysy | Reňki |
|---|---|---|---|
| 1 | Täze ýüztutma | Entek habarlaşylmadyk | Çal (bitarap) |
| 2 | Maslahat berildi | Uniwersitetleriň sanawy iberildi | Ýuwaş gyzyl |
| 3 | Resminamalar ýygnalýar | Bukja doldurylýar | Sary |
| 4 | Arza tabşyryldy | Uniwersitete iberildi | Gyzyl |
| 5 | Kabul haty geldi | Esasy maksada ýetildi | Ýuwaş ýaşyl |
| 6 | Ýazgy tamamlandy | Iş üstünlikli jemlendi | Ýaşyl |
| 7 | Ýitirilen | Sebäbi bellenýär | Solgun çal |

Reňkleriň tertibi prosesiň «temperaturasyny» görkezýär: bitarapdan
işjeňlige, soňra üstünlige.

### Kartadaky maglumat

Her kartada diňe **karar bermek üçin zerur** maglumat bar:

```
┌────────────────────────────────┐
│ Gurbanmyrat A.            🇹🇲  │  ← at + haýsy dilde jogap bermeli
│ 🎓 Inženerçilik                │  ← isleýän ugry
│                                │
│ Resminamalar            75%    │  ← ESASY GÖRKEZIJI
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░              │
│                                │
│ [Ýokary] [Instagram] [2026]    │  ← ilerlik, çeşme, gutarýan ýyl
│ ─────────────────────────────  │
│ 🕐 19 gün          📞  💬      │  ← möhlete çenli + çalt hereketler
└────────────────────────────────┘
```

**Resminamalaryň ilerlemesi** kartanyň merkezinde. Dolandyryjy kartany
açman, bukjanyň näderejede taýýardygyny görýär.

**Möhlet duýduryşy:** 21 günden az galan bolsa, kartanyň gyrasy sary
reňke geçýär (`.urgent`). Bu «kabul möwsümi ýapylyp barýar» diýen
duýduryşdyr.

### Ilerlik derejesiniň awtomatik kesgitlenmegi

`api/leads/route.ts` faýlynda:

```
Şu ýyl gutarýan          → ÝOKARY   (möhlet gysga)
Geçen ýyl gutaran        → ORTA
Öňki ýyllaryň uçurymy    → PES      (adatça indiki ýyla taýýarlanýar)
```

Býujet boýunça däl-de **möhlet boýunça** ileri tutulýar — bu bilim
hyzmatynyň aýratynlygy: möwsüm ýapylsa, pul hem peýda bermeýär.

### Süýşürip-taşlamagyň tehniki kararlary

**1. `@dnd-kit` saýlandy** (`react-beautiful-dnd` däl):
- React 19 bilen doly işleýär;
- klawiatura bilen süýşürmegi goldaýar (elýeterlilik talaby);
- gurluşyk göwrümi kiçi.

**2. Optimistik täzeleme:**

```
Karta goýberildi
  → ekranda derrew täze sütüne geçýär   (ulanyjy garaşmaýar)
  → PATCH /api/leads/{id}/stage         (arka planda)
  → şowsuz bolsa → öňki ýagdaýa dolanýar
```

**3. 6px aktiwleşdiriş çägi.** Süýşürmek diňe kursor 6 pikselden köp
hereket edende başlaýar — şeýle bolmasa, kartadaky jaň we WhatsApp
düwmelerine basmak mümkin bolmazdy.

---

## 4. Telegram integrasiýasy

### Näme üçin Telegram?

Talyplar we ene-atalar bilen habarlaşyk esasan **WhatsApp** we
**Instagram** arkaly geçýär. Emma toparyň öz içindäki iş bildirişleri
üçin Telegram amatly: kanala goşulan her işgär täze ýüztutmany şobada
telefonynda görýär.

Bu möhüm, sebäbi **kabul möwsümi gysga**. Ilkinji sagatlarda jogap berlen
ýüztutmanyň kabul hatyna ýetmek ähtimallygy has ýokary.

### Işleýiş zynjyry

```
Saýtdaky forma
  → POST /api/leads                (barlag + gora ýazmak)
  → renderTemplate()               (nusga boýunça habar düzülýär)
  → sendTelegramMessage()          (Bot API-e iberilýär)
  → Kanalda habar peýda bolýar
```

### Habaryň nusgasy

```
🎓 Täze ýüztutma
👤 {name}
📞 {phone}
📚 Ugry: {program}
🗓 Gutarýan ýyly: {gradYear}
🌐 Çeşme: {source} · Dil: {locale}
🕒 {time}
```

Elýeterli ýerler: `{name}` `{phone}` `{gradYear}` `{program}`
`{university}` `{source}` `{message}` `{locale}` `{time}` `{id}`.

Nusga **admin panelinde üýtgedilýär** — kody täzeden ýazmak gerek däl.

`{locale}` bilkastlaýyn goşuldy: dolandyryjy haýsy dilde jogap
bermelidigini habaryň özünde görýär.

### Haýsy wakalarda habar iberilýär

| Waka | Görnüşi |
|---|---|
| Täze ýüztutma gelende | Sesli bildiriş |
| Tapgyr üýtgände | Sessiz (`disable_notification: true`) |
| **Kabul haty gelende** | Sesli — topar üçin gowy habar |
| Ýüztutma ýitirilende | Islege görä |
| Günlük jemleýji hasabat | Her agşam |

### Howpsuzlyk

> **Bot açary (`TELEGRAM_BOT_TOKEN`) diňe serwerde saklanýar.**
> Ol hiç haçan brauzere iberilmeýär. Admin paneldäki widget diňe
> sazlamalary görkezýär — açaryň özüni däl.

Telegram-yň näsazlygy ýüztutmanyň ykbalyna täsir etmeýär:
`sendTelegramMessage` hiç haçan «ýykylmaýar», diňe `false` gaýtarýar
we žurnala ýazýar. Ýüztutma eýýäm gora ýazyldy.

---

## 5. ADMIN 2 — Seljerme we mazmun dolandyryjysy

### Ekranyň mantygy: «gördüm → düşündim → düzetdim»

```
┌──────────────────────────────────────────────────────┐
│  1. Dört esasy görkeziji                             │
├───────────────────────────────┬──────────────────────┤
│  2. Gatnawyň dinamikasy       │  Janly myhmanlar     │
├──────────────┬────────────────┼──────────────────────┤
│  3. Tapgyrlar│  Çeşmeler      │  Enjamlar            │
├──────────────┴────────────────┴──────────────────────┤
│  4. MAZMUN REDAKTORY (üç dil gapdal-gapdal)          │
└──────────────────────────────────────────────────────┘
```

Bu tertip zynjyry bir ekranda ýapýar: dolandyryjy mesele görýär, sebäbini
tapýar we şol ýerde düzedýär.

### Öwrülme tapgyrlary — iň gymmatly grafik

Her tapgyryň gapdalynda **öňki tapgyrdan näçe göterim geçendigi** bar:

```
Saýta giriş              6 480
Bölümler bilen tanyşmak  3 910   60,3%  ← ýaşyl
Forma açyldy               812   20,8%  ← gyzyl (gowşak halka!)
Forma iberildi             294   36,2%  ← sary
Maslahat geçirildi         138   46,9%  ← sary
```

Reňk kody: `<30%` gyzyl, `30–60%` sary, `>60%` ýaşyl.

Ýokarky mysalda mesele aýdyň: adamlar bölümleri okaýar, ýöne forma
açmaýar. Diýmek, CTA düwmesi ýa-da teklip güýçlendirilmeli.

### Enjamlar barada

Myhmanlaryň **78%-i telefonda**. Talyplar üçin bu adaty ýagdaý. Şonuň
üçin:

- dizaýn ilki mobil ekran üçin gurulýar;
- öndürijilik ölçegleri hem mobil enjamda barlanmalydyr;
- forma telefonda bir el bilen doldurylar ýaly bolmalydyr.

### Hakyky wagtdaky myhmanlar

Önümçilikde maglumat **Server-Sent Events** (SSE) arkaly gelmeli:

```js
const stream = new EventSource('/api/analytics/live');
stream.onmessage = (e) => setCount(JSON.parse(e.data).visitors);
```

SSE saýlandy, WebSocket däl — maglumat diňe bir tarapa akýar (serwerden
brauzere) we SSE gaýtadan birikmegi özi dolandyrýar.

---

## 6. Mazmun dolandyryş paneli

Esasy mesele: **saýt üç dilde işleýär, emma mazmuny üýtgedýän adam
programmist däl.**

### Üç düzgün

**1. Diller gapdal-gapdal görkezilýär.**
Terjime üçin aýratyn ekrana geçmeli däl — türkmençe ýazgyny görüp durkaň
rusçasyny ýazýarsyň. Bu terjimäniň manysynyň üýtgemeginiň öňüni alýar.

**2. Terjimäniň dolulygy hemişe görünýär.**
Boş meýdan gyzyl bilen bellenýär, ýokardaky göterim peselýär. Şeýlelikde
«bir dilde ýarym galan» sahypa çap edilmeýär.

**3. Taslama → Öňünden görmek → Çap etmek.**
Üýtgetmeler derrew saýta geçmeýär. Ýalňyş ýazgynyň janly saýta düşmegi
mümkin däl.

### Kabul hatlaryny dolandyrmak

| Meýdan | Görnüşi |
|---|---|
| Talybyň ady | Bir dilde, **gysgaldylan görnüşde**: «A. Myradow» |
| Uniwersitet | Resmi at — terjime edilmeýär |
| Ugry | Üç dilde |
| Okuw ýyly | San |
| Hatyň şekili | Şahsy maglumatlar bulaşdyrylan (blur) |
| **Razylyk alyndy** | **Çeňňek — hökmany** |
| Saýtda görkezilýärmi | Çeňňek |

> **`consentGiven` meýdany hökmany edildi** (`types.ts`). Talybyň ýazmaça
> razylygy bolmasa, hat saýtda görkezilmeýär. Bu diňe etiki däl, hukuk
> taýdan hem zerur şert.

---

## 7. Maglumat gory üçin teklip edilýän gurluş

Önümçilige geçilende `mock-data.ts` faýlynyň ýerine hakyky gor
birikdirilmeli. Teklip edilýän tablisalar:

```sql
leads              -- ýüztutmalar (id, name, phone, gradYear, program,
                   --              stage, locale, documents JSONB, ...)
lead_notes         -- ýüztutma degişli bellikler
team_members       -- işgärler we rollar
universities       -- uniwersitetler (JSONB üç dilli `note`)
acceptance_letters -- kabul hatlary (consent_given BOOLEAN NOT NULL)
testimonials       -- talyplaryň pikirleri (consent_given BOOLEAN NOT NULL)
content_blocks     -- saýtyň üýtgedilýän ýazgylary
analytics_events   -- saýtdaky hereketler
telegram_config    -- integrasiýanyň sazlamalary
```

Üç dilli meýdanlar üçin `JSONB` maslahat berilýär:

```sql
program JSONB NOT NULL DEFAULT '{"tm":"","ru":"","tr":""}'
```

Täze dil goşulanda tablisanyň gurluşyny üýtgetmek gerek bolmaýar —
diňe JSON-a täze açar goşulýar.

Resminamalaryň barlag sanawy hem `JSONB`:

```sql
documents JSONB NOT NULL
  DEFAULT '{"passport":false,"diploma":false,"transcript":false,"photo":false}'
```

### Şahsy maglumatlaryň goragy

Talyplaryň maglumatlary (pasport, telefon, attestat) **şahsy
maglumatlardyr**. Iň az talaplar:

1. Gora girişiň rollar boýunça çäklendirilmegi (RLS — Row Level Security).
2. Resminamalaryň şekilleriniň açyk elýeterli bukjada saklanmazlygy.
3. Ulanylmaýan maglumatlaryň möhleti gutaransoň pozulmagy.
