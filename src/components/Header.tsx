import Link from "next/link";
import { getBuyerSession } from "@/lib/session";
import { Logo } from "@/components/Logo";
import { PHONES, WORK_HOURS } from "@/lib/contacts";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?group=LIFTING", label: "Грузоподъёмная" },
  { href: "/catalog?group=EARTHMOVING", label: "Землеройная" },
  { href: "/catalog?group=PASSENGER", label: "Перевозки" },
  { href: "/stati", label: "Статьи" },
  { href: "/kontakty", label: "Контакты" },
];

export async function Header() {
  const session = await getBuyerSession();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        <Link href="/" aria-label="Арендатра — на главную">
          <Logo priority />
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

        <div className="flex items-center gap-2">
          {/* Телефон — главный канал заявок, поэтому он в шапке на всех экранах шире телефона */}
          <a
            href={`tel:${PHONES[0].tel}`}
            className="hidden flex-col items-end whitespace-nowrap leading-tight sm:flex md:hidden xl:flex"
          >
            <span className="font-display text-[15px] font-extrabold text-brand-navy">{PHONES[0].display}</span>
            <span className="text-[11px] text-gray-500">звонки {WORK_HOURS}</span>
          </a>
          <a
            href={`tel:${PHONES[0].tel}`}
            aria-label={`Позвонить: ${PHONES[0].display}`}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange text-white md:flex xl:hidden"
          >
            <PhoneIcon />
          </a>
          <Link
            href={session ? "/account" : "/login"}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy/80 transition hover:bg-brand-blue-light hover:text-brand-blue"
          >
            {session ? "Кабинет" : "Войти"}
          </Link>
        </div>
      </div>
    </header>
  );
}
