import type { Metadata } from "next";
import Link from "next/link";
import { getVehicles, getCities, getCategories } from "@/lib/vehicles";
import { VehicleCard } from "@/components/catalog/VehicleCard";
import { CategoryPicker } from "@/components/catalog/CategoryPicker";
import { PRICING_NOTE } from "@/lib/format";
import { getLandingCombos, landingPath } from "@/lib/landing";
import { CATEGORY_SEO } from "@/lib/seo";
import { CITY_INFO, SERVICE_CITIES } from "@/lib/cities";
import { LogoMark } from "@/components/Logo";
import { VehicleIcon } from "@/components/catalog/VehicleIcon";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const GROUPS = [
  {
    group: "LIFTING",
    title: "Грузоподъёмная техника",
    description: "Автокраны 25 и 50 т, автовышки (АГП)",
  },
  {
    group: "EARTHMOVING",
    title: "Землеройная техника",
    description: "Гусеничные экскаваторы, бульдозеры",
  },
  {
    group: "PASSENGER",
    title: "Пассажирские перевозки",
    description: "Вахтовые автобусы, легковой транспорт до 8 мест",
  },
] as const;

const FACTS = [
  { value: "9", label: "городов региона" },
  { value: "0 ₽", label: "предоплата онлайн" },
  { value: "от 1 ч", label: "почасовая аренда" },
  { value: "24/7", label: "заявки на сайте" },
];

const STEPS = [
  {
    title: "Выберите транспорт",
    description: "Отфильтруйте каталог по датам, городу и цене — увидите только свободные варианты",
  },
  {
    title: "Забронируйте даты",
    description: "Отметьте нужный период в календаре занятости и оставьте заявку",
  },
  {
    title: "Дождитесь подтверждения",
    description: "Менеджер свяжется с вами по телефону, оплата — без предоплаты онлайн",
  },
];

export default async function HomePage() {
  const [vehicles, cities, categories, combos] = await Promise.all([
    getVehicles(),
    getCities(),
    getCategories(),
    getLandingCombos(),
  ]);
  const featured = vehicles.slice(0, 6);
  const categoryGroups = GROUPS.map((g) => ({
    group: g.group,
    categories: categories
      .filter((c) => c.group === g.group)
      .map((c) => ({ slug: c.slug, name: c.name })),
  }));

  return (
    <div>
      <section className="bg-brand-navy">
        <div className="mx-auto max-w-6xl px-4 py-16 text-white">
          <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Аренда спецтехники и транспорта в Республике Коми и НАО
          </h1>
          <p className="mt-4 max-w-xl text-white/80">
            Автокраны, автовышки, экскаваторы, бульдозеры, вахтовые автобусы и легковой
            транспорт — почасовая аренда с прозрачными тарифами, без предоплаты. Работаем в
            Сыктывкаре, Ухте, Усинске, Печоре, Воркуте, Нарьян-Маре и других городах региона.
          </p>

          <form
            action="/catalog"
            method="get"
            className="mt-8 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <input
              type="text"
              name="q"
              placeholder="Что ищете? Например, автокран или экскаватор"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400"
            />
            <CategoryPicker groups={categoryGroups} />
            <select
              name="city"
              defaultValue=""
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900"
            >
              <option value="">Любой город</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-brand-orange px-6 py-2.5 font-semibold text-white hover:bg-brand-orange-dark"
            >
              Найти
            </button>
          </form>
        </div>
      </section>

      <section className="border-b border-black/5 bg-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-6 text-center sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="px-2 py-2">
              <dt className="font-display text-2xl font-extrabold text-brand-blue">{f.value}</dt>
              <dd className="mt-0.5 text-xs text-gray-500 sm:text-sm">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {GROUPS.map((g) => (
            <Link
              key={g.group}
              href={`/catalog?group=${g.group}`}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10"
            >
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-blue transition-transform duration-300 group-hover:scale-x-100" />
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                <VehicleIcon group={g.group} className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-brand-navy">{g.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{g.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-blue transition group-hover:translate-x-1">
                Смотреть →
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">{PRICING_NOTE}</p>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-brand-navy">Популярный транспорт</h2>
            <Link href="/catalog" className="text-sm font-medium text-brand-blue">
              Весь каталог →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard
                key={v.id}
                slug={v.slug}
                title={v.title}
                pricePerHour={v.pricePerHour}
                city={v.city}
                ownerName={v.owner.name}
                categoryName={v.category.name}
                categoryGroup={v.category.group}
                attributes={v.attributes as Record<string, string> | null}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-extrabold text-brand-navy">Аренда спецтехники по городам</h2>
        <div className="flex flex-wrap gap-2">
          {SERVICE_CITIES.map((c) => (
            <Link
              key={c}
              href={`/spetstehnika/${CITY_INFO[c].slug}`}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
            >
              Спецтехника {CITY_INFO[c].in}
            </Link>
          ))}
        </div>
      </section>

      {combos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-4 text-2xl font-extrabold text-brand-navy">Аренда техники по городам</h2>
          <div className="flex flex-wrap gap-2">
            {combos.map((c) => (
              <Link
                key={`${c.categorySlug}-${c.city}`}
                href={landingPath(c.categorySlug, c.city)}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
              >
                {(CATEGORY_SEO[c.categorySlug]?.title ?? c.categorySlug)} {CITY_INFO[c.city].in}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="relative mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-8 text-2xl font-extrabold text-brand-navy">Как это работает</h2>
        <div className="relative grid gap-4 sm:grid-cols-3">
          <div
            className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-brand-blue/25 sm:block"
            aria-hidden
          />
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <span className="font-display flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-lg font-extrabold text-white ring-4 ring-brand-blue-light">
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold text-brand-navy">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy p-8 sm:p-10">
          <div className="bg-blueprint absolute inset-0" aria-hidden />
          <div
            className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-blue/30 blur-3xl"
            aria-hidden
          />
          <div className="absolute -bottom-1 right-6 hidden h-40 w-40 items-end justify-center overflow-hidden rounded-t-full bg-white sm:flex md:h-48 md:w-48">
            <LogoMark className="h-[88%] w-auto translate-y-1" />
          </div>
          <div className="relative flex flex-col items-start gap-5 sm:pr-56">
            <div>
              <h2 className="max-w-xl text-xl font-extrabold text-white sm:text-2xl">
                Не нашли нужную технику или нужен расчёт под ваш объект?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Свяжитесь с менеджером — подберём технику и посчитаем итоговую стоимость.
              </p>
            </div>
            <a
              href="tel:+74951234567"
              className="shrink-0 rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
            >
              Позвонить: +7 495 123-45-67
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
