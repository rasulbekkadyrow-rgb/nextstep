/**
 * HABARLAŞMAK MAGLUMATLARY — ÝEKE-TÄK ÇEŞME
 * ==================================================================
 * Bahalar markanyň Instagram profilinden (@nextstep.consultancyy)
 * göçürildi. Belgi ýa-da salgy üýtgände DIŇE şu faýl düzedilýär —
 * Hero, Footer we beýleki bölümler şu ýerden okaýar.
 *
 * NÄME ÜÇIN IKI BELGI HEM WhatsApp?
 * Profiliň düşündirişinde iki belginiň ÜSTÜNDE «DM&Whatsapp» ýazgysy
 * dur, ýagny ikisi hem şol kanala degişli. Öň ikinjisi saýtda adaty
 * `tel:` salgysy hökmünde durdy — bu ýalňyşdy.
 *
 * `wa.me` diňe sanlary kabul edýär: jaýsyz, `+` belgisiz.
 */
export const CONTACTS = {
  instagram: {
    handle: '@nextstep.consultancyy',
    href: 'https://instagram.com/nextstep.consultancyy',
  },

  whatsapp: [
    { display: '+90 539 602 07 99', href: 'https://wa.me/905396020799' },
    { display: '+90 505 069 07 59', href: 'https://wa.me/905050690759' },
  ],

  email: {
    display: 'nextstep.consultancyy@gmail.com',
    href: 'mailto:nextstep.consultancyy@gmail.com',
  },
} as const;
