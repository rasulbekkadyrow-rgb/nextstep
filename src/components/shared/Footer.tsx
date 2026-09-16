import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { WhatsAppMark } from '@/components/ui/BrandIcons';
import { CONTACTS } from '@/lib/contacts';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const proof = useTranslations('proof');
  const locale = useLocale();

  const services = t.raw('services') as string[];
  const year = new Date().getFullYear();

  // hat ýok bolsa «Netijeler» bölümi hem ýok
  const hasProof = (proof.raw('letters') as unknown[]).length > 0;

  const links = [
    { href: '#kynçylyk', label: nav('links.problem') },
    { href: '#tertip', label: nav('links.process') },
    { href: '#uniwersitetler', label: nav('links.universities') },
    ...(hasProof ? [{ href: '#netijeler', label: nav('links.proof') }] : []),
    { href: '#soraglar', label: nav('links.faq') },
  ];

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
    <footer className="on-deep">
      <div className="container py-12 md:py-14">
        <div className="grid-12 gap-y-10">
          <div className="col-span-4 lg:col-span-4">
            <Logo size="md" />
            <p className="mt-5 max-w-[34ch] text-body-sm leading-relaxed text-deep-muted">
              {t('tagline')}
            </p>
          </div>

          <nav className="col-span-2 lg:col-span-2">
            <h2 className="text-label font-extrabold uppercase tracking-[0.14em] text-azure">
              {t('columns.nav')}
            </h2>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-body-sm text-deep-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-3">
            <h2 className="text-label font-extrabold uppercase tracking-[0.14em] text-azure">
              {t('columns.services')}
            </h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service} className="text-body-sm text-deep-muted">{service}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 lg:col-span-3">
            <h2 className="text-label font-extrabold uppercase tracking-[0.14em] text-azure">
              {t('columns.contact')}
            </h2>
            <ul className="mt-5 space-y-3.5">
              {contacts.map(({ icon: Icon, label, value, href, iconClass }) => (
                <li key={value} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.07] text-azure">
                    <Icon className={iconClass} aria-hidden />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-body-sm font-semibold text-deep-muted transition-colors hover:text-white"
                    >
                      <span className="sr-only">{label}: </span>
                      {value}
                    </a>
                  ) : (
                    <span className="text-body-sm text-deep-muted">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.09] pt-7 sm:flex-row">
          <p className="text-body-sm text-deep-muted/80">
            © {year} Next Step Consulting. {t('rights')}
          </p>
          <Link
            href={`/${locale}/admin/satuw`}
            className="text-body-sm text-deep-muted/80 transition-colors hover:text-white"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
