import { useTranslations } from 'next-intl';
import { ArrowRight, MessageCircle, Percent, Rocket, Search } from 'lucide-react';

const ICONS = {
  rocket: Rocket,          // derrew başlamak
  search: Search,          // uniwersitet gözlemek
  percent: Percent,        // ýeňillik we arzanladyş
  message: MessageCircle,  // WhatsApp goldawy
} as const;

interface Item {
  icon: keyof typeof ICONS;
  title: string;
  text: string;
  cta: string;
  href: string;
}

export function QuickActions() {
  const t = useTranslations('quickActions');
  const items = t.raw('items') as Item[];

  return (
    <section className="relative z-10 -mt-16 pb-4 md:-mt-20 md:pb-6">
      <div className="container">
        <div className="paper overflow-hidden rounded-4xl">
          <div className="grid grid-cols-2 gap-px bg-line/10 lg:grid-cols-4">
            {items.map((item) => {
              const Icon = ICONS[item.icon] ?? Rocket;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group flex flex-col bg-white p-4 transition-colors duration-300 hover:bg-surface sm:p-5 md:p-6"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>

                  <h3 className="mt-3 text-h4 leading-snug">{item.title}</h3>
                  <p className="mt-1.5 hidden flex-1 text-body-sm leading-relaxed text-muted sm:block">
                    {item.text}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-bold text-brand">
                    {item.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
