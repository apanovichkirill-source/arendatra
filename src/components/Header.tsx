import Link from "next/link";
import { getBuyerSession } from "@/lib/session";
import { Logo } from "@/components/Logo";

export async function Header() {
  const session = await getBuyerSession();

  return (
    <header className="bg-brand-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-white">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/catalog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Каталог
          </Link>
          <Link
            href="/catalog?group=LIFTING"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Грузоподъёмная
          </Link>
          <Link
            href="/catalog?group=EARTHMOVING"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Землеройная
          </Link>
          <Link
            href="/catalog?group=PASSENGER"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Перевозки
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          {session ? (
            <Link
              href="/account"
              className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Кабинет
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
