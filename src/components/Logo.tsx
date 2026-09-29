import Image from "next/image";

export function LogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <Image
      src="/logo-icon.png"
      alt=""
      width={64}
      height={64}
      className={className}
      priority
    />
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white p-1">
        <LogoMark className="h-full w-full" />
      </span>
      <span className="text-xl font-bold">Арендатра</span>
    </span>
  );
}
