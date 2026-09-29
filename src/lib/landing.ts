import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCategories, getVehicles } from "@/lib/vehicles";
import { CATEGORY_LANDING } from "@/lib/seo";
import { CITY_INFO, SERVICE_CITIES, cityBySlug } from "@/lib/cities";
import { formatPrice } from "@/lib/format";

export type ServiceCity = (typeof SERVICE_CITIES)[number];

export const getLandingCombos = unstable_cache(loadLandingCombos, ["landing-combos"], {
  revalidate: 600,
  tags: ["vehicles"],
});

async function loadLandingCombos() {
  const rows = await prisma.vehicle.findMany({
    where: { isActive: true },
    select: { city: true, category: { select: { slug: true } } },
  });
  const combos = new Map<string, { categorySlug: string; city: ServiceCity; count: number }>();
  for (const r of rows) {
    const city = SERVICE_CITIES.find((c) => c === r.city);
    if (!city || !CATEGORY_LANDING[r.category.slug]) continue;
    const key = `${r.category.slug}|${city}`;
    const entry = combos.get(key) ?? { categorySlug: r.category.slug, city, count: 0 };
    entry.count += 1;
    combos.set(key, entry);
  }
  return [...combos.values()];
}

export async function getLandingData(categorySlug: string, citySlug?: string) {
  const content = CATEGORY_LANDING[categorySlug];
  if (!content) return null;

  const category = (await getCategories()).find((c) => c.slug === categorySlug);
  if (!category) return null;

  let city: ServiceCity | null = null;
  if (citySlug) {
    city = cityBySlug(citySlug);
    if (!city) return null;
  }

  const [inCity, all] = await Promise.all([
    getVehicles({ categorySlug, city: city ?? undefined }),
    city ? getVehicles({ categorySlug }) : null,
  ]);
  const vehicles = inCity;
  const otherVehicles = all ? all.filter((v) => v.city !== city) : [];

  const prices = vehicles
    .map((v) => (v.pricePerHour === null ? null : Number(v.pricePerHour)))
    .filter((p): p is number => p !== null);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const minHours = vehicles.length ? Math.min(...vehicles.map((v) => Math.max(1, v.minHours))) : null;

  return { category, content, city, vehicles, otherVehicles, minPrice, minHours };
}

export function landingPath(categorySlug: string, city?: ServiceCity | null) {
  return city
    ? `/arenda/${categorySlug}/${CITY_INFO[city].slug}`
    : `/arenda/${categorySlug}`;
}

export function landingMeta(
  data: NonNullable<Awaited<ReturnType<typeof getLandingData>>>
) {
  const { content, city, vehicles, minPrice } = data;
  const where = city ? CITY_INFO[city].in : "в Республике Коми и НАО";
  const title = `Аренда ${content.genitive} ${where}${
    minPrice !== null ? ` — от ${formatPrice(minPrice)}/час` : ""
  }`;
  const description = `Аренда ${content.genitive} ${where}: ${
    vehicles.length > 0
      ? `${vehicles.length} ${pluralize(vehicles.length, ["вариант", "варианта", "вариантов"])} в наличии`
      : "подберём технику под ваш объект"
  }${minPrice !== null ? `, от ${formatPrice(minPrice)} в час без НДС` : ""}. Почасовые тарифы, бронирование онлайн без предоплаты.`;
  return { title, description, indexable: vehicles.length > 0 };
}

export function pluralize(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
