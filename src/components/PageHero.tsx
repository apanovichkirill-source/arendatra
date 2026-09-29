import type { ReactNode } from "react";
import { LogoMark } from "@/components/Logo";

export function PageHero({
  title,
  eyebrow,
  children,
  compact = false,
}: {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <div className="bg-blueprint absolute inset-0" aria-hidden />
      <div
        className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-brand-blue/30 blur-3xl"
        aria-hidden
      />
      <LogoMark
        silhouette
        className="pointer-events-none absolute -bottom-6 right-4 hidden h-[110%] w-auto opacity-[0.07] sm:block"
      />
      <div className={`relative mx-auto max-w-6xl px-4 ${compact ? "py-8" : "py-10 sm:py-12"}`}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-2xl font-extrabold text-white sm:text-4xl">{title}</h1>
        {children}
      </div>
    </section>
  );
}
