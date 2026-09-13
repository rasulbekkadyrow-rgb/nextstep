# 04 — Köpdillilik (i18n): gurluş, terjime tertibi we SEO

Saýt üç dilde doly işleýär: **türkmen**, **rus** we **türk**. Bu diňe
terjime meselesi däl — ol binagärlik kararydyr.

---

## 1. Esasy düzgün: bir hakykat çeşmesi

Ähli ýazgylar `messages/` bukjasyndaky üç JSON faýlda saklanýar.
Komponentlerde ýazgy **göni ýazylmaýar** — hemişe `t('açar')` arkaly alynýar.

```tsx
// ❌ Ýalňyş
<h1>Türkiýäniň uniwersitetine kabul hatyny almagyň dogry ýoly</h1>

// ✅ Dogry
const t = useTranslations('hero');
<h1>{t('titleLead')} {t('titleAccent')} {t('titleTail')}</h1>
```

Näme üçin? Sebäbi ýazgy kodda bolsa:

- ony üýtgetmek üçin programmist gerek;
- bir dilde üýtgedilip, beýlekisinde ýatdan çykarylýar;
- mazmun paneli ony görüp bilmeýär.

---

## 2. Faýllaryň gurluşy

```
messages/
├── tm.json   ← ESASY NUSGA (türkmen dili)
├── ru.json   ← rus dili
└── tr.json   ← türk dili
```

**`tm.json` esasy nusgadyr.** Täze ýazgy ilki şoňa goşulýar, soňra
beýleki iki dile terjime edilýär. Açarlaryň gurluşy üç faýlda-da
**doly meňzeş** bolmalydyr.

### Açarlaryň ierarhiýasy

```json
{
  "meta":    { "title": "...", "description": "..." },
  "nav":     { "links": { "problem": "...", "process": "..." } },
  "hero":    { "titleAccent": "...", "letterRows": {...}, "stats": [ ... ] },
  "problem": { "items": [ { "before": {...}, "after": {...} } ] },
  "process": { "steps": [ ... ], "scopeNote": "..." },
  "universities": { "items": [ { "name": "...", "short": "...", "note": "..." } ] },
  "proof":   { "letters": [ ... ], "testimonials": [ ... ] },
  "offer":   { "includes": [ ... ] },
  "faq":     { "items": [ { "q": "...", "a": "..." } ] },
  "form":    { "fields": {...}, "errors": {...} },
  "footer":  { ... },
  "admin":   { "common": {...}, "sales": {...}, "analytics": {...} }
}
```

Häzirki ýagdaý: **268 açar**, üç dilde-de doly gabat gelýär.

### Açarlaryň gabat gelşini barlamak

Bu buýruk terjimede ýetmeýän ýa-da artykmaç açary tapýar:

```bash
node -e "const fs=require('fs');const keys=o=>{const out=[];(function w(p,v){if(v&&typeof v==='object'&&!Array.isArray(v)){for(const k of Object.keys(v))w(p?p+'.'+k:k,v[k])}else out.push(p)})('',o);return out.sort()};const m={};['tm','ru','tr'].forEach(l=>m[l]=JSON.parse(fs.readFileSync('messages/'+l+'.json','utf8')));const base=keys(m.tm);for(const l of ['ru','tr']){const k=keys(m[l]);console.log(l,'ýetmeýän:',base.filter(x=>!k.includes(x)),'artykmaç:',k.filter(x=>!base.includes(x)))}"
```

Bu barlagy CI ulgamyna goşmak maslahat berilýär — şonda ýetmeýän
terjime bilen taslama çap edilip bilinmez.

---

## 3. URL gurluşy

| Salgy | Mazmuny |
|---|---|
| `/` | Brauzeriň diline görä awtomatik ugrukdyrylýar |
| `/tm` | Türkmen dilindäki saýt |
| `/ru` | Rus dilindäki saýt |
| `/tr` | Türk dilindäki saýt |
| `/tm/admin/satuw` | Admin 1 |
| `/tm/admin/analitika` | Admin 2 |

### Näme üçin dil URL-de?

- **SEO** — her dil aýratyn sahypa hökmünde indekslenýär.
- **Paýlaşmak** — salgyny iberen adam haýsy dilde açylýandygyny bilýär.
- **Statik generasiýa** — sahypalar öňünden taýýarlanýar, şonuň üçin
  çalt ýüklenýär.

Kukä esaslanýan dil saýlawy bu üç artykmaçlygy hem ýitirýär.

---

## 4. Diliň awtomatik kesgitlenmegi

`src/lib/i18n.ts` faýlyndaky `resolveLocaleFromHeader` funksiýasy
brauzeriň `Accept-Language` başlygyny okaýar we biziň dillerimize öwürýär:

| Brauzeriň dili | Saýlanýan dil | Sebäbi |
|---|---|---|
| `tk`, `tm`, `tuk` | **TM** | Türkmen dili |
| `ru`, `be`, `uk`, `kk`, `uz` | **RU** | Rus dili umumy düşünişmek dili |
| `tr`, `az` | **TR** | Türk dili has ýakyn |
| Beýlekiler | **TM** | Esasy dil |

Ulanyjy dili el bilen çalyşsa, saýlawy `localStorage`-da saklanýar we
indiki gezek awtomatik kesgitleme ulanylmaýar.

---

## 5. SEO sazlamalary

### `hreflang` bellikleri

Her sahypada beýleki dil görnüşlerine salgy berilýär:

```html
<link rel="alternate" hreflang="tk" href="https://nextstep.tm/tm" />
<link rel="alternate" hreflang="ru" href="https://nextstep.tm/ru" />
<link rel="alternate" hreflang="tr" href="https://nextstep.tm/tr" />
<link rel="alternate" hreflang="x-default" href="https://nextstep.tm/tm" />
```

Bu Google-a sahypalaryň **gaýtalanma däl-de, terjime** bolandygyny
düşündirýär. Bolmasa gözleg ulgamy olary «göçürme mazmun» hasaplap biler.

### `lang` atributy

Türkmen dili üçin HTML-de **`tk`** ulanylýar (`tm` däl!).

- `tk` — ISO 639-1 boýunça **türkmen diliniň** kody;
- `tm` — ISO 3166 boýunça **Türkmenistan ýurdunyň** kody.

URL-de `tm` ulanylýar, sebäbi ol ýerli ulanyjylara has tanyş. Emma
HTML-iň `lang` atributynda hökman `tk` bolmaly — ekran okaýjylar we
gözleg ulgamlary şoňa garaşýar. Bu öwrülme `localeMeta` obýektinde
ýerine ýetirilýär.

---

## 6. Terjimäniň hil düzgünleri

### Sözme-söz terjime edilmeýär

Marketing ýazgysynda esasy zat — **many we täsir**, sözleriň gabat
gelmegi däl.

| Dil | Sözbaşy |
|---|---|
| **TM** | Türkiýäniň uniwersitetine **kabul hatyny** almagyň dogry ýoly |
| **RU** | Верный путь к **письму о зачислении** в университет Турции |
| **TR** | Türkiye'deki üniversiteden **kabul mektubu** almanın doğru yolu |

Üçüsi hem bir manyny berýär, ýöne her dilde tebigy eşidilýär. Sözleriň
tertibi hem üýtgeýär: rusçada «путь» başda, türkmençede we türkçede
iň soňunda — sebäbi her diliň öz sözlem gurluşy bar.

### Türkmen dili üçin aýratyn bellikler

1. **Adalgalar (terminler) yzygiderli ulanylýar.** Bir düşünje üçin
   saýtyň dowamynda bir söz — «öwrülme derejesi» ýazylan bolsa,
   başga ýerde «konwersiýa» ýazylmaýar.

2. **Işewürlik diline eýerilýär.** Gündelik gepleşik däl-de, resmi
   ýazuw dili: «kesgitlenýär», «ornaşdyrylýar», «seljerilýär».

3. **Ulanylýan esasy adalgalar:**

   | Türkmençe | Rusça | Türkçe |
   |---|---|---|
   | Kabul haty | Письмо о зачислении | Kabul mektubu |
   | Ýüztutma | Обращение / заявка | Başvuru |
   | Attestat | Аттестат | Diploma |
   | Transkript (baha sahypasy) | Транскрипт (лист оценок) | Transkript (not belgesi) |
   | Ugur / hünär | Направление / специальность | Bölüm |
   | Taýýarlyk ýyly | Подготовительный год | Hazırlık yılı |
   | Ýazgy (kaýyt) | Запись / зачисление | Kayıt |
   | Möhlet | Срок | Son tarih |
   | Hususy uniwersitet | Частный университет | Vakıf üniversitesi |
   | Öwrülme derejesi | Конверсия | Dönüşüm oranı |

4. **Terjime edilmeýän zatlar.** Uniwersitetleriň resmi atlary
   (`Bahçeşehir Üniversitesi`), gysgaltmalar (BAU, IGU), «Letter of
   Acceptance» we okuw ýyly (`2026/2027`) üç dilde-de bir görnüşde galýar.
   Emma **ugurlaryň atlary terjime edilýär**: `Kompýuter inženerligi` /
   `Компьютерная инженерия` / `Bilgisayar Mühendisliği`.

5. **Sanlaryň ýazylyşy.** Onluk bölegi **otur** bilen: `4,6%`.
   Müňlükler **boşluk** bilen: `15 000`.

6. **Çekimli sazlaşyk** berjaý edilýär: «işiňiz**iň**», «netije**siniň**»,
   «uniwersitet**ine**» — goşulmalar sözüň soňky çekimlisine görä saýlanýar.

---

## 7. Täze dil goşmak

Meselem, iňlis dilini goşmak üçin:

1. `messages/en.json` döredilýär (`tm.json`-yň nusgasy esasynda).
2. `src/lib/i18n.ts`-de:
   ```ts
   export const locales = ['tm', 'ru', 'tr', 'en'] as const;
   export const localeMeta = {
     // ...
     en: { label: 'English', short: 'EN', flag: '🇬🇧', htmlLang: 'en' },
   };
   ```
3. `src/middleware.ts`-däki admin salgysynyň nusgasy täzelenýär:
   `/^\/(tm|ru|tr|en)\/admin\/([^/]+)/`
4. `layout.tsx`-däki `hreflang` sanawyna goşulýar.

**Komponentlere degilmeýär.** Şu gurluşyň esasy artykmaçlygy şunda.
