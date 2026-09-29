import Image from "next/image";

export function LogoMark({
  className = "h-10 w-auto",
  silhouette = false,
  priority = false,
}: {
  className?: string;
  silhouette?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={540}
      height={640}
      className={`${className} ${silhouette ? "logo-silhouette" : ""}`}
      priority={priority}
      sizes="(max-width: 640px) 160px, 320px"
    />
  );
}

export function Wordmark({ className = "text-xl", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={`font-display font-extrabold uppercase tracking-tight ${className}`}>
      <span className={onDark ? "text-white" : "text-brand-navy"}>Аренда</span>
      <span className={onDark ? "text-[#4d94ff]" : "text-brand-blue"}>тра</span>
    </span>
  );
}

export function Logo({
  className = "",
  onDark = false,
  priority = false,
}: {
  className?: string;
  onDark?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {onDark ? (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          <LogoMark className="h-8 w-auto" priority={priority} />
        </span>
      ) : (
        <LogoMark className="h-11 w-auto" priority={priority} />
      )}
      <Wordmark onDark={onDark} className="text-[1.35rem] leading-none" />
    </span>
  );
}
