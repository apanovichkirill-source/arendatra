import { getVehicles } from "@/lib/vehicles";
import { SITE_URL } from "@/lib/site";
import { CATEGORY_SEO, CATEGORY_LANDING } from "@/lib/seo";
import { landingPath } from "@/lib/landing";
import { CITY_INFO, SERVICE_CITIES, type ServiceCityName } from "@/lib/cities";
import { PHONES, PROFILES } from "@/lib/contacts";
import { vehiclePhoto } from "@/content/vehicle-photos";

// YML-фид для Вебмастера: «Услуги и предложения в поиске» → категория «Исполнители».
// Сет = страница «техника × город», предложение = машина. Формат: справка Вебмастера «Исполнители».
export const dynamic = "force-dynamic";

// Категории из справочника Яндекса: 1 «Исполнитель», 16 «Перевозки и курьеры», 20 «Аренда»
const TRANSPORT = new Set(["vahtovyy-avtobus", "legkovye-ts"]);
const NAO = new Set<string>(["Нарьян-Мар", "Харьягинский"]);

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function param(name: string, value: string | number | boolean) {
  return `<param name="${esc(name)}">${esc(String(value))}</param>`;
}

// Дата генерации по Москве в формате YYYY-MM-DD hh:mm
function stamp() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Moscow",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

export async function GET() {
  const vehicles = (await getVehicles()).filter(
    (v) => CATEGORY_LANDING[v.category.slug] && v.pricePerHour !== null
  );

  const sets = new Map<string, { url: string; name: string }>();
  const offers: string[] = [];

  for (const v of vehicles) {
    const cat = v.category.slug;
    const city = SERVICE_CITIES.find((c) => c === v.city) as ServiceCityName | undefined;
    const title = CATEGORY_SEO[cat]?.title ?? v.category.name;

    const setIds = [`c-${cat}`];
    sets.set(`c-${cat}`, { url: `${SITE_URL}${landingPath(cat)}`, name: title });
    if (city) {
      const id = `c-${cat}-${CITY_INFO[city].slug}`;
      setIds.push(id);
      sets.set(id, { url: `${SITE_URL}${landingPath(cat, city)}`, name: `${title} ${CITY_INFO[city].in}` });
    }

    const photo = vehiclePhoto(v.slug);
    // Яндекс требует уникальный URL картинки у каждого предложения, а одна и та же
    // машина в разных городах показана одним фото — различаем адрес по slug
    const picture = photo ? `${SITE_URL}${photo.src}?offer=${encodeURIComponent(v.slug)}` : null;
    const region = city
      ? `${NAO.has(city) ? "Ненецкий автономный округ" : "Республика Коми"}, ${city}`
      : "Республика Коми";
    const minHours = Math.max(1, v.minHours);
    const minText = minHours >= 80 ? `от ${minHours / 8} смен` : `от ${minHours} ч`;

    offers.push(
      [
        `<offer id="${esc(v.id)}">`,
        `<name>${esc(`Арендатра: ${v.title}`)}</name>`,
        `<url>${esc(`${SITE_URL}/vehicle/${v.slug}`)}</url>`,
        `<price from="true">${Number(v.pricePerHour)}</price>`,
        `<currencyId>RUR</currencyId>`,
        `<sales_notes>${esc(`за час, минимальный заказ ${minText}, цена без 5% НДС`)}</sales_notes>`,
        `<categoryId>${TRANSPORT.has(cat) ? 16 : 20}</categoryId>`,
        `<set-ids>${setIds.join(",")}</set-ids>`,
        picture ? `<picture>${esc(picture)}</picture>` : "",
        `<description>${esc(`${title}${city ? ` ${CITY_INFO[city].in}` : ""}: ${v.title}, с экипажем`)}</description>`,
        param("Рейтинг", 0),
        param("Число отзывов", 0),
        param("Годы опыта", 3),
        param("Регион", region),
        param("Конверсия", city === "Усинск" ? 1 : 0.5),
        param("Организация", true),
        param("Выполняется по адресу заказчика", true),
        param("Ссылка на телефон", `tel:${PHONES[0].tel}`),
        param("Ссылка на профиль исполнителя", PROFILES.yandexUslugi),
        param(
          "Об исполнителе",
          "Свой парк спецтехники на базе в Усинске (пгт Парма). Работаем по договору, наличный и безналичный расчёт, пропуска на месторождения."
        ),
        `</offer>`,
      ]
        .filter(Boolean)
        .join("")
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${stamp()}">
<shop>
<name>Арендатра</name>
<company>Арендатра</company>
<url>${SITE_URL}</url>
<currencies><currency id="RUR" rate="1"/></currencies>
<categories>
<category id="1">Исполнитель</category>
<category id="16" parentId="1">Перевозки и курьеры</category>
<category id="20" parentId="1">Аренда</category>
</categories>
<sets>
${[...sets].map(([id, s]) => `<set id="${id}"><name>${esc(s.name)}</name><url>${esc(s.url)}</url></set>`).join("\n")}
</sets>
<offers>
${offers.join("\n")}
</offers>
</shop>
</yml_catalog>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
