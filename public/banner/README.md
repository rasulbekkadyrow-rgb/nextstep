# Girişiň arka fon suraty (hero banner)

Sahypanyň iň ýokarsyndaky bölümiň arkasynda görünýän surat şu ýerden
okalýar. **Faýly şu papka taşlamak ýeterlik — başga hiç zat etmeli däl.**

## Nähili goşmaly

1. Suraty şu papka taşlaň: `public/banner/`
2. Ady islendik bolup biler, mysal üçin `talyplar.jpg`
3. Sahypany täzeläň — surat öz-özünden peýda bolýar

Papka boş wagty sahypada çyzylan ätiýaçlyk şekil görünýär
(Stambulyň kenary — `src/components/landing/HeroBackdrop.tsx`).
Ýagny saýt surat goşulmanka-da doly we gutarylan görünýär.

## Talaplar

| Zat | Baha |
| --- | --- |
| Giňeltme | `.jpg`, `.png`, `.webp` ýa-da `.avif` |
| Ölçeg | iň azy **1920×1080**, has gowusy **2400×1350** |
| Göwrüm | **400 KB-dan az** (`.webp` maslahat berilýär) |
| Nisbat | giň, keseleýin (16:9 töweregi) |

## ⚠️ KOMPOZISIÝA — IŇ MÖHÜM ŞERT

Suratyň **ÇEP ÝARYMY** ak perde bilen örtülýär: şol ýerde sözbaşy,
düşündiriş we düwmeler durýar. Şonuň üçin:

- **Talyplaryň ýüzleri SAG ÝARYMDA bolmaly.** Çepde durýan adam ak
  perdäniň aşagynda ýitýär.
- Suratyň sag tarapy gaty garaňky bolmaly däl — ol perdesiz görünýär.
- Merkezde köp detal bolmasyn: telefonda surat dik kesilýär.

## Birden köp surat bar bolsa

Atlar boýunça tertipleşdirilip **birinjisi** alynýar. Ýagny haýsynyň
ulanyljagyny at bilen dolandyryp bolýar:

```
01-talyplar.webp   ← şu ulanylýar
02-kampus.webp
```

## ⚠️ Hukuk

Talyplaryň suraty goýulýan bolsa, olaryň **ýazmaça razylygy**
alynmalydyr. Razylyk ýok bolsa stok suraty ulanylmalydyr (mysal üçin
Unsplash, Pexels — täjirçilik ulanyşyna rugsatly lisenziýa bilen).

## Häzirki surat

`talyplar.jpg`: kitaplaryň üstünde şapka, arkada uniwersitet binasy.
Ulanyjy berdi (Downloads, `upscalemedia-transformed (1).jpeg`, 5888×3312).
Çeşmesi we lisenziýasy saýtyň eýesi tarapyndan tassyklanmaly.

## Aşaky bölümiň banneri

`public/footer/talyplar.jpg`: «Malacca graduates», awtory Baim Hanif (Unsplash).
Lisenziýa: **CC0**. Çeşme: https://commons.wikimedia.org/wiki/File:Malacca_graduates_(Unsplash).jpg
