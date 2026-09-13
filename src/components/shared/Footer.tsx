import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { WhatsAppMark } from '@/components/ui/BrandIcons';
import { CONTACTS } from '@/lib/contacts';

/**
 * AŞAKY BÖLÜM (Footer)
 * Baglanyşyk maglumatlary we bölümleriň gaýtalanan sanawy.
 * Instagram hasaby esasy habarlaşyk kanaly hökmünde ileri tutulýar.
 */
export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const proof = useTranslations('proof');
  const locale = useLocale();

  const services = t.raw('services') as string[];
  const year = new Date().getFullYear();

  /* «Netijeler» bölümi hakyky kabul hatlary bolmasa görkezilmeýär */
  const hasProof = (proof.raw('letters') as unknown[]).length > 0;

  const links = [
    { href: '#kynçylyk', label: nav('links.problem') },
    { href: '#tertip', label: nav('links.process') },
    { href: '#uniwersitetler', label: nav('links.universities') },
    ...(hasProof ? [{ href: '#netijeler', label: nav('links.proof') }] : []),
    { href: '#soraglar', label: nav('links.faq') },
  ];

  /* Baglanyşyk maglumatlary `lib/contacts.ts`-den gelýär — Hero bilen
     bir çeşme. Öň bu ýerde bahalar göni ýazylgydy we e-poçta hakyky
     däldi (`info@nextstep.tm`), indi profildäki Gmail salgysy dur. */
  const contacts = [
    {
      icon: Instagram, label: t('contactLabels.instagram'),
      value: CONTACTS.instagram.handle,
      href: CONTACTS.instagram.href,
      iconClass: 'h-4 w-4',
    },
    ...CONTACTS.whatsapp.map((w) => ({
      icon: WhatsAppMark, label: t('contactLabels.whatsapp'),
      value: w.display,
      href: w.href,
      /* Doldurgyly nyşan çyzyklylardan agyr görünýär — bir basgançak kiçi */
      iconClass: 'h-3.5 w-3.5',
    })),
    {
      icon: Mail, label: t('contactLabels.email'),
      value: CONTACTS.email.display,
      href: CONTACTS.email.href,
      iconClass: 'h-4 w-4',
    },
  ];

  return (
    <footer className="border-t border-line/10 bg-surface/40">
      <div className="container py-16">
        <div className="grid-12 gap-y-10">
          {/* Marka we şygar */}
          <div className="col-span-4 lg:col-span-4">
            <Logo size="md" />
            <p className="mt-4 max-w-[34ch] text-body-sm leading-relaxed text-muted">{t('tagline')}</p>
          </div>

          {/* Bölümler */}
          <nav className="col-span-2 lg:col-span-2">
            <h2 className="text-micro font-semibold uppercase tracking-[0.14em] text-faint">
              {t('columns.nav')}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-body-sm text-muted transition-colors hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hyzmatlar */}
          <div className="col-span-2 lg:col-span-3">
            <h2 className="text-micro font-semibold uppercase tracking-[0.14em] text-faint">
              {t('columns.services')}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service} className="text-body-sm text-muted">{service}</li>
              ))}
            </ul>
          </div>

          {/* Baglanyşyk */}
          <div className="col-span-4 lg:col-span-3">
            <h2 className="text-micro font-semibold uppercase tracking-[0.14em] text-faint">
              {t('columns.contact')}
            </h2>
            <ul className="mt-4 space-y-3">
              {/* Açar `value` boýunça: iki WhatsApp setiriniň ady birmeňzeş */}
              {contacts.map(({ icon: Icon, label, value, href, iconClass }) => (
                <li key={value} className="flex items-center gap-3">
                  <span className="grid h-4 w-4 shrink-0 place-items-center text-faint">
                    <Icon className={iconClass} aria-hidden />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-body-sm text-muted transition-colors hover:text-brand"
                    >
                      <span className="sr-only">{label}: </span>
                      {value}
                    </a>
                  ) : (
                    <span className="text-body-sm text-muted">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line/10 pt-7 sm:flex-row">
          <p className="text-body-sm text-faint">
            © {year} Next Step Consulting. {t('rights')}
          </p>
          <Link
            href={`/${locale}/admin/satuw`}
            className="text-body-sm text-faint transition-colors hover:text-brand"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
