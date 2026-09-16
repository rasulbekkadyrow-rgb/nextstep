/** Banner suraty ýok wagty ulanylýan SVG fon. */
export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity="0.14" />
          <stop offset="52%" stopColor="rgb(var(--c-azure))" stopOpacity="0.10" />
          <stop offset="100%" stopColor="rgb(var(--c-azure))" stopOpacity="0.04" />
        </linearGradient>

        <radialGradient id="hb-sun" cx="0.72" cy="0.24" r="0.42">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="55%" stopColor="rgb(var(--c-azure))" stopOpacity="0.14" />
          <stop offset="100%" stopColor="rgb(var(--c-azure))" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="hb-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity="0.20" />
          <stop offset="100%" stopColor="rgb(var(--c-brand))" stopOpacity="0.07" />
        </linearGradient>

        <linearGradient id="hb-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity="0.34" />
          <stop offset="100%" stopColor="rgb(var(--c-brand))" stopOpacity="0.16" />
        </linearGradient>

        <linearGradient id="hb-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-azure))" stopOpacity="0.22" />
          <stop offset="100%" stopColor="rgb(var(--c-azure))" stopOpacity="0.02" />
        </linearGradient>

        <pattern id="hb-dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.6" fill="rgb(var(--c-brand))" fillOpacity="0.10" />
        </pattern>
      </defs>

      <rect width="1600" height="900" fill="url(#hb-sky)" />
      <rect width="1600" height="900" fill="url(#hb-sun)" />
      <rect y="120" width="1600" height="420" fill="url(#hb-dots)" opacity="0.5" />

      {/* uzakdaky binalar */}
      <g fill="url(#hb-far)">
        <rect x="60" y="392" width="88" height="188" rx="6" />
        <rect x="166" y="430" width="62" height="150" rx="6" />
        <rect x="246" y="356" width="104" height="224" rx="8" />
        <rect x="1180" y="404" width="76" height="176" rx="6" />
        <rect x="1274" y="368" width="96" height="212" rx="8" />
        <rect x="1388" y="424" width="68" height="156" rx="6" />
        <rect x="1474" y="390" width="86" height="190" rx="6" />
      </g>

      {/* metjit, Galata, uniwersitet */}
      <g fill="url(#hb-near)">
        <path d="M672 470 a128 128 0 0 1 256 0 Z" />
        <rect x="660" y="468" width="280" height="112" rx="10" />
        <path d="M604 512 a68 68 0 0 1 136 0 Z" />
        <rect x="598" y="510" width="148" height="70" rx="8" />
        <path d="M860 512 a68 68 0 0 1 136 0 Z" />
        <rect x="854" y="510" width="148" height="70" rx="8" />
        <rect x="796" y="312" width="8" height="34" rx="4" />

        <rect x="574" y="292" width="20" height="288" rx="10" />
        <path d="M584 256 l16 44 h-32 Z" />
        <rect x="1006" y="292" width="20" height="288" rx="10" />
        <path d="M1016 256 l16 44 h-32 Z" />
        <rect x="518" y="352" width="16" height="228" rx="8" />
        <path d="M526 322 l13 36 h-26 Z" />
        <rect x="1066" y="352" width="16" height="228" rx="8" />
        <path d="M1074 322 l13 36 h-26 Z" />

        <rect x="362" y="356" width="74" height="224" rx="12" />
        <rect x="350" y="344" width="98" height="20" rx="10" />
        <path d="M399 268 l44 74 h-88 Z" />

        <rect x="1104" y="452" width="200" height="128" rx="8" />
        <path d="M1204 404 l112 56 h-224 Z" />
        <g fill="rgb(var(--c-base))" fillOpacity="0.5">
          <rect x="1128" y="480" width="13" height="80" rx="6" />
          <rect x="1164" y="480" width="13" height="80" rx="6" />
          <rect x="1200" y="480" width="13" height="80" rx="6" />
          <rect x="1236" y="480" width="13" height="80" rx="6" />
          <rect x="1272" y="480" width="13" height="80" rx="6" />
        </g>
      </g>

      <rect x="0" y="578" width="1600" height="322" fill="url(#hb-water)" />
      <g stroke="rgb(var(--c-azure))" strokeLinecap="round" strokeWidth="3">
        <line x1="120"  y1="622" x2="268"  y2="622" opacity="0.20" />
        <line x1="1290" y1="640" x2="1452" y2="640" opacity="0.18" />
        <line x1="420"  y1="664" x2="596"  y2="664" opacity="0.16" />
        <line x1="900"  y1="690" x2="1104" y2="690" opacity="0.14" />
        <line x1="180"  y1="718" x2="332"  y2="718" opacity="0.12" />
        <line x1="1180" y1="746" x2="1400" y2="746" opacity="0.10" />
        <line x1="560"  y1="774" x2="760"  y2="774" opacity="0.08" />
      </g>
    </svg>
  );
}
