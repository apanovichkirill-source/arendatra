import Link from "next/link";
import { Logo, LogoMark } from "@/components/Logo";
import { CATEGORY_SEO } from "@/lib/seo";
import { CITY_INFO, SERVICE_CITIES } from "@/lib/cities";
import { PHONES, WORK_HOURS } from "@/lib/contacts";

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-brand-navy text-white/70">
      <div className="bg-blueprint absolute inset-0" aria-hidden />
      <LogoMark
        silhouette
        className="pointer-events-none absolute -bottom-10 -right-4 h-[120%] w-auto opacity-[0.06]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-12 text-sm">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-3 text-white/90">
              {PHONES.map((p, i) => (
                <span key={p.tel}>
                  {i > 0 && " · "}
                  <a href={`tel:${p.tel}`} className="font-semibold hover:text-white">
                    {p.display}
                  </a>
                </span>
              ))}
              <span className="block text-xs text-white/60">Звонки {WORK_HOURS}</span>
            </p>
            <p className="mt-4 max-w-md leading-relaxed">
              Аренда грузоподъёмной, землеройной техники и пассажирского транспорта в
              Республике Коми и Ненецком автономном округе.
            </p>
          </div>
          <nav aria-label="Виды техники">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
              Техника в аренду
            </p>
            <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {Object.entries(CATEGORY_SEO).map(([slug, seo]) => (
                <li key={slug}>
                  <Link href={`/arenda/${slug}`} className="transition hover:text-white">
                    {seo.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <nav aria-label="Спецтехника по городам" className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <Link href="/spetstehnika" className="hover:text-white">
              Аренда спецтехники по городам
            </Link>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
            {SERVICE_CITIES.map((c) => (
              <li key={c}>
                <Link href={`/spetstehnika/${CITY_INFO[c].slug}`} className="transition hover:text-white">
                  Спецтехника {CITY_INFO[c].in}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6">
          <p>© {new Date().getFullYear()} Арендатра. Все права защищены.</p>
          <Link href="/stati" className="text-white/90 underline-offset-4 hover:underline">
            Статьи
          </Link>
          <Link href="/o-nas" className="text-white/90 underline-offset-4 hover:underline">
            О сервисе
          </Link>
          <Link href="/kontakty" className="text-white/90 underline-offset-4 hover:underline">
            Контакты
          </Link>
          <Link href="/privacy" className="text-white/90 underline-offset-4 hover:underline">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
