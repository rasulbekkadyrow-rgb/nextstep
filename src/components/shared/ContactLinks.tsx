'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Instagram, Mail } from 'lucide-react';
import { WhatsAppMark } from '@/components/ui/BrandIcons';
import { CONTACTS } from '@/lib/contacts';
import { cn } from '@/lib/utils';

/**
 * HABARLAŞMAK NYŞANLARY
 * ==================================================================
 * Instagram, iki WhatsApp belgisi we e-poçta — diňe tegelek nyşanlar.
 *
 * NÄME ÜÇIN BELGILER GÖRÜNMEÝÄR, ÝÖNE ÝITENOK?
 * Dört sany doly belgi bir hatarda köp ýer tutýardy we sözbaşy bilen
 * bäsleşýärdi. Indi her nyşan tegelek gerşde dur, kursor golaýlanda
 * bolsa gerş SAGA AÇYLYP belgini görkezýär. Ýagny maglumat ýitmeýär —
 * ol diňe soralýança gizlenip durýar.
 *
 * AÇYLYŞ NÄHILI EDILDI?
 * `width: auto` animasiýa edilmeýär. Onuň deregine CSS grid ulanylýar:
 * sütüniň ini `0fr`-dan `1fr`-a geçýär, içindäki ýazgy bolsa
 * `overflow: hidden` bilen kesilýär. Bu brauzeriň özi hasaplaýan,
 * ýumşak we ölçeg bilmegi talap etmeýän ýeke-täk arassa usul.
 *
 * ELÝETERLILIK
 *  · `aria-label` hemişe kanalyň adyny we belgini doly okaýar —
 *    ýazgy görünmese-de ekran okaýjy ony bilýär.
 *  · Klawiatura bilen fokusa düşende hem gerş açylýar
 *    (`focus-visible:` — hoveriň deňi).
 *  · Hereketi azaltmak islegi saýlanan bolsa geçişler globals.css-däki
 *    umumy düzgün arkaly öçýär.
 */
export function ContactLinks({ className }: { className?: string }) {
  const t = useTranslations('footer.contactLabels');

  const items = [
    {
      key: 'instagram',
      label: t('instagram'),
      value: CONTACTS.instagram.handle,
      href: CONTACTS.instagram.href,
      external: true,
      icon: <Instagram className="h-[1.15rem] w-[1.15rem]" aria-hidden />,
    },
    ...CONTACTS.whatsapp.map((w, i) => ({
      key: `whatsapp-${i}`,
      label: t('whatsapp'),
      value: w.display,
      href: w.href,
      external: true,
      /* Doldurgyly nyşan — çyzykly goňşularyndan bir basgançak kiçi */
      icon: <WhatsAppMark className="h-4 w-4" />,
    })),
    {
      key: 'email',
      label: t('email'),
      value: CONTACTS.email.display,
      href: CONTACTS.email.href,
      external: false,
      icon: <Mail className="h-[1.15rem] w-[1.15rem]" aria-hidden />,
    },
  ];

  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      {items.map((item, i) => (
        <motion.li
          key={item.key}
          initial={{ opacity: 0, y: 10, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.08 * i,
            ease: [0.34, 1.56, 0.64, 1], // ýaýly: biraz aşa geçip ýerine gelýär
          }}
        >
          <a
            href={item.href}
            aria-label={`${item.label}: ${item.value}`}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={cn(
              'lg lg-press group flex h-11 items-center rounded-full pl-[0.8rem] pr-[0.8rem]',
              'text-muted transition-[color,transform,padding] duration-500 ease-out-expo',
              'hover:-translate-y-0.5 hover:pr-4 hover:text-brand',
              'focus-visible:-translate-y-0.5 focus-visible:pr-4 focus-visible:text-brand',
            )}
          >
            {/* Nyşan: hemişe görünýär, üstüne gelende ýeňiljek ulalýar */}
            <span className="grid h-5 w-5 shrink-0 place-items-center text-brand transition-transform duration-500 ease-out-expo group-hover:scale-110">
              {item.icon}
            </span>

            {/* Belgi: `0fr → 1fr` bilen açylýan sütün */}
            <span
              aria-hidden
              className={cn(
                'grid grid-cols-[0fr] transition-[grid-template-columns] duration-[550ms] ease-out-expo',
                'group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]',
              )}
            >
              <span className="overflow-hidden">
                <span className="block whitespace-nowrap pl-2.5 text-body-sm font-medium">
                  {item.value}
                </span>
              </span>
            </span>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}
