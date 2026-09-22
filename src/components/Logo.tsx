// Монограмма "A" (Арендатра): ножки буквы читаются как стойки кузова,
// пунктирная перекладина — как дорожная разметка, точки у основания — как колёса.
export function LogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path
        d="M20 7 L9 31 M20 7 L31 31"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 21 L26 21"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray="3.2 4"
      />
      <circle cx="9" cy="33.5" r="2.6" fill="var(--color-brand-navy)" />
      <circle cx="31" cy="33.5" r="2.6" fill="var(--color-brand-navy)" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange text-white">
        <LogoMark className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold">Арендатра</span>
    </span>
  );
}
