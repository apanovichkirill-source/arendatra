import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CATEGORY_SEO } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
        <div className="text-brand-navy">
          <Logo />
        </div>
        <p className="mt-3">
          Аренда грузоподъёмной, землеройной техники и пассажирского транспорта в Республике
          Коми и Ненецком автономном округе.
        </p>
        <nav aria-label="Виды техники" className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          {Object.entries(CATEGORY_SEO).map(([slug, seo]) => (
            <Link key={slug} href={`/arenda/${slug}`} className="hover:text-brand-blue">
              {seo.title}
            </Link>
          ))}
        </nav>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p>© {new Date().getFullYear()} Арендатра. Все права защищены.</p>
          <Link href="/privacy" className="text-brand-blue hover:underline">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
