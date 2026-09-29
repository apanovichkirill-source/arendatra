import type { Metadata } from "next";
import { getCategories, getCities, getVehicles } from "@/lib/vehicles";
import { VehicleCard } from "@/components/catalog/VehicleCard";
import { CATEGORY_GROUP_LABELS } from "@/lib/format";
import { GROUP_SEO, CATEGORY_SEO } from "@/lib/seo";
import type { CategoryGroup } from "@prisma/client";
import { PageHero } from "@/components/PageHero";

type SearchParams = {
  group?: string;
  category?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  start?: string;
  end?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;

  const seo =
    (sp.category && CATEGORY_SEO[sp.category]) ||
    (sp.group && GROUP_SEO[sp.group as CategoryGroup]) ||
    null;

  if (seo) {
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      alternates: {
        canonical:
          sp.category && CATEGORY_SEO[sp.category]
            ? `/arenda/${sp.category}`
            : sp.group
              ? `/catalog?group=${sp.group}`
              : "/catalog",
      },
    };
  }

  return {
    alternates: { canonical: "/catalog" },
    title: "Каталог техники в аренду",
    description:
      "Автокраны, автовышки, экскаваторы, бульдозеры, вахтовые автобусы и легковой транспорт в Республике Коми и НАО. Фильтры по датам, городу и цене.",
    keywords: [
      "аренда спецтехники Коми",
      "аренда спецтехники НАО",
      "аренда автокрана",
      "аренда экскаватора",
      "аренда вахтового автобуса",
    ],
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const group = (sp.group as CategoryGroup) || undefined;

  const pageTitle =
    (sp.category && CATEGORY_SEO[sp.category]?.title) ||
    (sp.group && GROUP_SEO[sp.group as CategoryGroup]?.title) ||
    "Каталог";

  const startAt = sp.start ? new Date(`${sp.start}T00:00:00`) : undefined;
  const endAt = sp.end ? new Date(`${sp.end}T23:59:59`) : undefined;
  const hasValidDateRange = startAt && endAt && startAt < endAt;

  const [categories, cities, vehicles] = await Promise.all([
    getCategories(),
    getCities(),
    getVehicles({
      group,
      categorySlug: sp.category,
      city: sp.city,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      query: sp.q,
      startAt: hasValidDateRange ? startAt : undefined,
      endAt: hasValidDateRange ? endAt : undefined,
    }),
  ]);

  const groupedCategories = categories.filter((c) => !group || c.group === group);

  return (
    <>
      <PageHero title={pageTitle} eyebrow="Каталог" compact />
      <div className="mx-auto max-w-6xl px-4 py-8">

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-xl border border-black/10 bg-white p-4">
          <form method="get" className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Поиск
              </label>
              <input
                type="text"
                name="q"
                defaultValue={sp.q}
                placeholder="Название транспорта"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Даты с
                </label>
                <input
                  type="date"
                  name="start"
                  defaultValue={sp.start}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  по
                </label>
                <input
                  type="date"
                  name="end"
                  defaultValue={sp.end}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Категория
              </label>
              <select
                name="group"
                defaultValue={sp.group ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Все категории</option>
                {Object.entries(CATEGORY_GROUP_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Тип
              </label>
              <select
                name="category"
                defaultValue={sp.category ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Все типы</option>
                {groupedCategories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Город
              </label>
              <select
                name="city"
                defaultValue={sp.city ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Все города</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Цена от / час
                </label>
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={sp.minPrice}
                  min={0}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Цена до / час
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={sp.maxPrice}
                  min={0}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy"
            >
              Применить
            </button>
            <a
              href="/catalog"
              className="text-center text-sm text-gray-500 hover:text-brand-blue"
            >
              Сбросить фильтры
            </a>
          </form>
        </aside>

        <div>
          <p className="mb-4 text-sm text-gray-500">Найдено: {vehicles.length}</p>
          {vehicles.length === 0 ? (
            <p className="rounded-xl border border-black/10 bg-white p-8 text-center text-gray-500">
              По вашему запросу ничего не найдено
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v) => (
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
          )}
        </div>
      </div>
      </div>
    </>
  );
}
