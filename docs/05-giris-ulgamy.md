# 05 — Giriş ulgamy (parolsyz, e-poçta kody bilen)

Admin panele giriş **parol bilen däl**, e-poçta iberilýän bir gezeklik
6 sanly kod bilen amala aşyrylýar — Instagram, Telegram we banklaryň
ulanýan usuly.

```
┌──────────────────┐   e-poçta   ┌──────────────────────┐
│  Giriş sahypasy  │────────────▶│ POST /auth/kod       │
└──────────────────┘             │  · sanawda barmy?    │
         ▲                       │  · 6 sanly kod       │
         │                       │  · SHA-256 ýygyndy   │
         │                       └──────────┬───────────┘
         │                                  │ hat
         │                                  ▼
         │                       ┌──────────────────────┐
         │                       │  Dolandyryjynyň      │
         │                       │  poçtasy (islendik)  │
         │                       └──────────┬───────────┘
         │            kod                   │
         └──────────────────────────────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │ POST /auth/barla     │
            │  · kod dogrumy?      │
            │  · HMAC gol çekilen  │
            │    seans kukisi      │
            └──────────┬───────────┘
                       ▼
              rola görä öz paneli
```

---

## 1. Näme üçin parol ýok?

| Parolly ulgam | Kodly ulgam |
|---|---|
| Parol paýlaşylýar, depderçä ýazylýar | Paýlaşyp bolmaýar — kod 10 minutlyk |
| Işgär gidende parol çalşyrylmaly | Salgy sanawdan aýrylýar — hemmesi şol |
| Ogurlanan parol hemişelik açar | Ogurlanan kod eýýäm öçen bolýar |
| «Paroly ýatdan çykardym» akymy gerek | Gerek däl — her giriş şol bir akym |
| Täze işgäre parol döretmeli, ibermeli | E-poçtasyny ýazmak ýeterlik |

Iki dolandyryjyly topar üçin bu tapawut kesgitleýji: **täze adam goşmak
bir meýdany doldurmakdan ybarat**, aýyrmak bolsa bir düwmeden.

Alyjy tarapynda hiç hili çäklendirme ýok: Gmail, iCloud, Outlook,
Yandex, Mail.ru ýa-da öz domeni — hemmesi adaty hat alýar we ol
iPhone-da hem, Android-da hem, kompýuterde hem açylýar.

---

## 2. Faýllaryň paýlanyşy

| Faýl | Wezipesi |
|---|---|
| `lib/auth/session.ts` | Kukä gol çekmek we barlamak (HMAC-SHA256) |
| `lib/auth/otp.ts` | Kod döretmek, ýygyndysyny saklamak, barlamak |
| `lib/auth/mailer.ts` | Haty düzmek we ibermek (SMTP / Resend / konsol) |
| `lib/auth/admins.ts` | Dolandyryjylaryň sanawy |
| `lib/auth/store.ts` | Kiçi gor: faýl (`.data/*.json`) ýa-da Redis |
| `lib/auth/current.ts` | «Häzir kim girdi?» — serwer sahypalary üçin |
| `api/admin/auth/kod` | Ädim 1: kod ibermek |
| `api/admin/auth/barla` | Ädim 2: kody barlamak, seans açmak |
| `api/admin/auth/cykys` | Seansy ýapmak |
| `api/admin/topar[/id]` | Dolandyryjylary goşmak / üýtgetmek / aýyrmak |
| `middleware.ts` | Her sorag üçin golyň we rolyň barlagy |

---

## 3. Seans: näme üçin gol, näme üçin tablisa däl?

Kuki şeýle görnüşde:

```
base64url({"sub":"adm-…","email":"…","role":"owner","iat":…,"exp":…})
  . base64url(HMAC-SHA256(şol maglumat, AUTH_SECRET))
```

Maglumat **şifrlenmeýär** — ol diňe gol bilen goralýar. Şonuň üçin oňa
syrly zat ýazylmaýar. Kukiniň bir nyşany üýtgese, gol gabat gelmeýär we
ol ret edilýär.

> **Öň nähilidi:** `ns_session=demo` we `ns_role=owner`. Brauzeriň
> gurallaryny açyp bilýän islendik adam şol iki setiri ýazyp panele
> girip bilerdi. Bu ulgamyň iň uly deşigi idi we ilkinji nobatda ýapyldy.

Näme üçin serwerde «seanslar tablisasy» ýok? Sebäbi her sahypa açylanda
gora ýüz tutmaly bolardy. Gol bolsa matematiki barlag — maglumat gory
gerek däl, hatda **Edge gurşawynda** hem işleýär.

Munuň bir gowşak tarapy bar: gol çekilen kuki möhleti gutaýança
hereket edýär, hatda adam sanawdan aýrylan bolsa-da. Şonuň üçin
**ikinji gatlak** goşuldy:

| Gatlak | Nirede | Näme barlanýar |
|---|---|---|
| 1 | `middleware.ts` (Edge) | Golyň dogrulygy, möhleti, rol |
| 2 | Sahypanyň özi (`getCurrentAdmin`) | Adam sanawda barmy, işjeňmi |

Birinji gatlak çalt we arzan — ol hüjümleriň 99%-ini kesýär. Ikinji
gatlak haýal, ýöne hakykaty bilýär.

---

## 4. Kodyň howpsuzlygy

| Gorag | Bahasy |
|---|---|
| Kod uzynlygy | 6 san (1 000 000 mümkinçilik) |
| Möhleti | 10 minut |
| Synanyşyk | 5 gezek, soňra kod ýatyrylýar |
| Gaýtadan ibermek | 60 sekuntda bir gezek |
| Bir salga sagatda | 5 kod |
| Bir IP-den 15 minutda | 12 sorag |
| Saklanyşy | Diňe SHA-256 ýygyndysy + duz (salt) |

Kod **açyk saklanmaýar**: `.data/otp.json` faýlyny okan adam hem ony
bilip bilmeýär. Dogry girizilen kod şobada pozulýar — ikinji gezek
ulanyp bolmaýar.

Tötänlik `Math.random()` bilen däl, `crypto.getRandomValues()` bilen
alynýar, üstesine «ret etmek» usuly bilen sanlaryň paýlanyşy deň
saklanýar. `Math.random()` çak edip bolýar — giriş kody üçin ýaramaýar.

### Salgynyň barlygy äşgär edilmeýär

`POST /auth/kod` **hemişe** `{ ok: true }` gaýtarýar — salgy sanawda
bar bolsa-da, ýok bolsa-da. Ýogsam nätanyş adam salgylary birin-birin
synap, kimiň dolandyryjydygyny anyklap bilerdi; bu bolsa nyşana alnan
hüjümiň (phishing) ilkinji ädimi.

Munuň öwezine giriş sahypasynda «Hat gelmedimi?» bölümi bar.

---

## 5. Dolandyryjylaryň sanawy: iki çeşme

**1. `ADMIN_EMAILS` gurşaw üýtgeýjisi — ätiýaçlyk açar.**

```bash
ADMIN_EMAILS="ali@gmail.com:owner:Aly M., vepa@icloud.com:owner:Wepa G."
```

Bu ýazgylar **panelden pozulmaýar**. Sebäbi: panelde ýalňyşlyk bilen
ähli dolandyryjy pozulsa, ulgama girip bolmajak ýagdaý dörärdi.

**2. Panelden goşulanlar** — «Topar we rugsatlar» bölüminde;
`.data/admins.json` faýlynda saklanýar.

### Rollar

| Rol | Elýeterli |
|---|---|
| `sales` | Arzalar paneli — Kanban, telefonlar, resminamalar |
| `analytics` | Seljerme we mazmun — şahsy maglumatlary görmeýär |
| `owner` | Ikisi-de + topary dolandyrmak |

### Gapyny özüňe ýapmakdan gorag

Serwer üç zada rugsat bermeýär:

1. Eýe öz rolyny üýtgedip ýa-da özüni pozup bilmeýär.
2. Iň soňky işjeň `owner` ýapylyp bilmeýär.
3. Gurşaw üýtgeýjisinden gelen ýazgy panelden pozulmaýar.

---

## 6. Poçta: üç sürüji

`MAIL_DRIVER` goýulmasa, awtomatik saýlanýar.

| Sürüji | Haçan | Sazlama |
|---|---|---|
| `smtp` | Adaty ýagdaý | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` |
| `resend` | Serwersiz gurşaw (Vercel) | `RESEND_API_KEY` |
| `console` | Diňe işläp düzüş | — (kod terminalda çykýar) |

> Gmail üçin adaty parol işlemeýär: hasapda iki basgançakly barlag
> açylyp, **App password** döredilmelidir.

`console` sürüjisi önümçilikde **ýalňyşlyk berýär** — ýogsam giriş kody
serweriň žurnalyna düşerdi.

### Hatyň şekili

Hat tablisa we içki stiller bilen ýazyldy. Bu «köne usul» däl: Gmail,
Outlook we Apple Mail döwrebap CSS-i (flex, grid, daşarky stil faýly)
goldamaýar. Kod uly, monoşrift we giň aralykly — telefonda okamak we
göçürmek aňsat bolmaly. Hat ulanyjynyň diline görä üç dilde gelýär.

---

## 7. Interfeýs kararlary

**Alty aýratyn öýjük, bir meýdan däl.** Adam kody nirä çenli
ýazandygyny sanamazdan görýär, telefonda her sanyň ýeri uly.

**Üç ýagdaý bilkastlaýyn işlenildi** — köplenç şular ýatdan çykýar:

1. *Göçürip goýmak* — kod poçtadan doly göçürilende alty san
   öýjüklere bölünýär.
2. *Awtomatik doldurma* — `autocomplete="one-time-code"` sebäpli iOS we
   Android kody klawiaturanyň üstünde teklip edýär; ol bir öýjüge
   gelende hem bölünýär.
3. *Yza pozmak* — boş öýjükde «backspace» öňki öýjüge geçirýär.

**Alty san dolan badyna barlag awtomatik başlaýar.** Düwme ýene-de bar:
awtomatik hereket şowsuz bolsa, ýol ýapyk galmaly däl.

**«Entek garaş» ýalňyşlyk hasaplanmaýar.** Kod eýýäm iberilen bolsa,
adam kod ekranyna geçirilýär — ýogsam sahypany täzeländen soň öz
kodyny girizip bilmän galardy.

**Ýalňyş kodda gysga sarsgyn** (`animate-shake`, 6px) — ýazgy
okalmanka-da düşnükli signal. `prefers-reduced-motion` saýlananda
animasiýa öçýär.

**Reňk:** ýalňyşlyk üçin gyzyl däl-de, `warn` (sary) ulanylýar.
Dizaýn ulgamynda gyzyl ýok (ol bilkastlaýyn aýryldy), şonuň üçin
duýduryş reňki hem ulgamyň öz reňki bolmaly.

---

## 8. Önümçilige çykmazdan öň

1. `AUTH_SECRET` hökman goýulmaly (`openssl rand -base64 32`).
   Ol bolmasa gol ynamsyz bolýar.
2. `ADMIN_EMAILS` — iki eýäniň salgysy.
3. SMTP ýa-da Resend sazlanmaly.
4. `.data/` bukjasy ätiýaçlyk nusgasyna goşulmaly (dolandyryjylaryň
   sanawy şol ýerde).
5. **Vercel-de KV gory hökman.** Sebäbi ol ýerde faýl ulgamy diňe
   okalýar we her sorag başga nusgada işläp bilýär.

---

## 9. Vercel-e goýmak

`lib/auth/store.ts` iki sürüjini goldaýar we olary **awtomatik**
saýlaýar — kody üýtgetmek gerek däl:

| Gurşaw | Sürüji | Şert |
|---|---|---|
| Noutbuk, VPS | `.data/*.json` faýllary | goşmaça sazlama ýok |
| Vercel | Redis (HTTP) | `KV_REST_API_URL` + `KV_REST_API_TOKEN` |

Redis üçin aýratyn kitaphana goşulmady: Upstash/Vercel KV adaty HTTP
arkaly işleýär, ýagny `fetch` ýeterlik.

Eger Vercel-de gor birikdirilmese, `/api/admin/auth/kod` düşnüksiz 500
bermän, `503 { error: 'storage' }` gaýtarýar we serweriň žurnalynda
näme etmelidigi ýazylýar. Bu bilkastlaýyn: sazlama ýalňyşlygy
«näbelli näsazlyk» bolup gizlenmeli däl.

### Poçta barada bellik

Serwersiz gurşawda **Resend** (HTTP) SMTP-den ygtybarlyrak: SMTP
baglanyşygy her çagyryşda täzeden açylýar we käbir üpjünçiler ony
haýalladýar. SMTP hem işleýär, ýöne hat gijä galsa, ilki şoňa serediň.
