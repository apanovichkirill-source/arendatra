import Link from "next/link";
import { getBuyerSession } from "@/lib/session";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?group=LIFTING", label: "Грузоподъёмная" },
  { href: "/catalog?group=EARTHMOVING", label: "Землеройная" },
  { href: "/catalog?group=PASSENGER", label: "Перевозки" },
];

export async function Header() {
  const session = await getBuyerSession();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        <Link href="/" aria-label="Арендатра — на главную">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-navy/80 transition hover:bg-brand-blue-light hover:text-brand-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {session ? (
            <Link
              href="/account"
              className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue"
            >
              Кабинет
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
