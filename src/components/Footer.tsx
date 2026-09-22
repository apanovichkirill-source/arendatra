import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
        <div className="text-brand-navy">
          <Logo />
        </div>
        <p className="mt-3">
          Аренда грузоподъёмной, землеройной техники и пассажирского транспорта.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} Арендатра. Все права защищены.</p>
      </div>
    </footer>
  );
}
