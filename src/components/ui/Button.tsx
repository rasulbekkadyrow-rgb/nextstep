import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'white' | 'ghost';
type Size = 'md' | 'lg';

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  external?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-brand-ink shadow-brand hover:bg-brand-deep hover:shadow-brand-lg border border-transparent',
  outline:
    'bg-transparent text-brand border border-brand/35 hover:border-brand hover:bg-brand-soft',
  white:
    'bg-white text-ink border border-transparent shadow-soft hover:shadow-lift',
  ghost:
    'bg-surface text-ink border border-line/10 hover:border-brand/30 hover:text-brand',
};

const SIZES: Record<Size, string> = {
  md: 'px-6 py-3 text-body-sm',
  lg: 'px-8 py-4 text-body',
};

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  type = 'button',
  disabled,
  external,
}: Props) {
  const classes = cn(
    'group inline-flex items-center justify-center gap-2.5 rounded-full font-bold tracking-tight',
    'transition-[background-color,border-color,box-shadow,color] duration-300 ease-out-expo',
    'active:scale-[0.98]',
    SIZES[size],
    VARIANTS[variant],
    disabled && 'pointer-events-none opacity-55',
    className,
  );

  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    // daşarky we #anchor salgylar üçin Link gerek däl
    if (external || href.startsWith('http') || href.startsWith('#')) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {inner}
    </button>
  );
}
