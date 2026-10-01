// Генератор SEO-страниц: «спецтехника в городе», «группа техники в городе»,
// страницы под поисковые намерения (цены, почасовая аренда, для стройки и т.д.).
// Каждая страница собирается из реальных данных каталога + уникальных по городу фактов.
import type { CategoryGroup } from "@prisma/client";
import { getCategories, getVehicles } from "@/lib/vehicles";
import { CATEGORY_LANDING, CATEGORY_SEO } from "@/lib/seo";
import { CITY_INFO, SERVICE_CITIES, cityBySlug, type ServiceCityName } from "@/lib/cities";
import { formatPrice } from "@/lib/format";
import { pluralize } from "@/lib/landing";

type Vehicles = Awaited<ReturnType<typeof getVehicles>>;

export type SeoLink = { label: string; href: string };

export type SeoPageModel = {
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  breadcrumbs: { name: string; href?: string }[];
  intro: string[];
  vehiclesTitle: string;
  vehicles: Vehicles;
  fallbackTitle?: string;
  fallbackText?: string;
  fallbackVehicles?: Vehicles;
  sections: { title: string; paragraphs?: string[]; bullets?: string[] }[];
  priceTable?: { title: string; rows: { name: string; href: string; price: number | null; inCity: boolean }[] };
  faq: { q: string; a: string }[];
  linkGroups: { title: string; links: SeoLink[] }[];
};

const num = (v: { pricePerHour: unknown }) => (v.pricePerHour === null ? null : Number(v.pricePerHour));

const minPriceOf = (vs: Vehicles) => {
  const p = vs.map(num).filter((x): x is number => x !== null);
  return p.length ? Math.min(...p) : null;
};

// Дополнительные факты по городам (без выдуманных цифр: только характер работ и логистика региона).
export const CITY_EXTRA: Record<
  ServiceCityName,
  { region: string; works: string[]; logistics: string; nearby: ServiceCityName[] }
> = {
  "Нарьян-Мар": {
    region: "Ненецкий автономный округ",
    works: [
      "Строительство и ремонт зданий, дорог и инженерных сетей",
      "Работы в порту и на речных причалах",
      "Обустройство площадок и подсыпка территорий",
      "Погрузка и монтаж на объектах округа",
    ],
    logistics:
      "Нарьян-Мар не связан с остальной страной постоянной сухопутной дорогой, поэтому технику и сроки поставки на объект лучше согласовывать с менеджером заранее.",
    nearby: ["Харьягинский", "Усинск"],
  },
  Харьягинский: {
    region: "Ненецкий автономный округ",
    works: [
      "Обслуживание промысловых объектов и площадок",
      "Перевозка вахтовых бригад",
      "Монтаж и погрузка оборудования",
      "Земляные работы при обустройстве площадок",
    ],
    logistics:
      "Харьягинский — вахтовый посёлок, поэтому заявки обычно сопровождаются согласованием маршрута и въезда на объект; менеджер поможет это уточнить.",
    nearby: ["Усинск", "Нарьян-Мар"],
  },
  Усинск: {
    region: "Республика Коми",
    works: [
      "Обустройство кустов скважин и промысловых площадок",
      "Устройство временных дорог и зимников",
      "Монтаж и перемещение тяжёлого оборудования",
      "Перевозка вахтовых бригад на объекты",
    ],
    logistics:
      "Из Усинска техника уходит на промыслы и отдалённые площадки; маршрут и сроки подачи на объект подтверждает менеджер.",
    nearby: ["Харьягинский", "Печора", "Ухта"],
  },
  Печора: {
    region: "Республика Коми",
    works: [
      "Работы на объектах железной дороги и речного порта",
      "Строительство и ремонт мостов и подъездных путей",
      "Монтаж и погрузка негабаритных грузов",
      "Земляные работы и подготовка площадок",
    ],
    logistics:
      "Печора — удобная точка для работы в Печорском районе и по соседним северным направлениям.",
    nearby: ["Кожва", "Усинск", "Сосногорск"],
  },
  Воркута: {
    region: "Республика Коми",
    works: [
      "Ремонт и обслуживание городской и промышленной инфраструктуры",
      "Подъём грузов и монтаж на объектах за Полярным кругом",
      "Расчистка территорий и снега",
      "Перевозка сотрудников к удалённым объектам",
    ],
    logistics:
      "В Воркуте работа идёт в суровых северных условиях, поэтому на технику и сроки лучше закладывать запас на погоду и состояние дорог.",
    nearby: ["Усинск", "Печора"],
  },
  Ухта: {
    region: "Республика Коми",
    works: [
      "Строительство и ремонт на предприятиях нефти и газа",
      "Монтаж оборудования и металлоконструкций",
      "Земляные работы и обустройство площадок",
      "Высотные работы: освещение, опоры, фасады",
    ],
    logistics:
      "Ухта — крупный промышленный центр, откуда удобно обслуживать объекты в Ухтинском и соседних районах.",
    nearby: ["Сосногорск", "Печора", "Сыктывкар", "Усинск"],
  },
  Сыктывкар: {
    region: "Республика Коми",
    works: [
      "Городское и жилое строительство",
      "Ремонт дорог, благоустройство и инженерные сети",
      "Монтаж конструкций на производственных площадках",
      "Высотные работы и обрезка деревьев",
    ],
    logistics:
      "Столица региона: здесь проще всего быстро согласовать технику на городские объекты и в пригороды.",
    nearby: ["Ухта", "Сосногорск"],
  },
  Сосногорск: {
    region: "Республика Коми",
    works: [
      "Работы на промплощадках и объектах газопереработки",
      "Обслуживание железнодорожной инфраструктуры",
      "Монтаж и погрузка оборудования",
      "Земляные работы и подготовка площадок",
    ],
    logistics:
      "Сосногорск находится рядом с Ухтой, поэтому технику можно подобрать и в соседнем городе.",
    nearby: ["Ухта", "Печора", "Сыктывкар"],
  },
  Кожва: {
    region: "Республика Коми",
    works: [
      "Работы вблизи железной дороги и в Печорском районе",
      "Расчистка и планировка территорий",
      "Перевозка бригад на объекты по грунтовым дорогам",
      "Подъём и перемещение грузов на площадках",
    ],
    logistics:
      "Кожва — небольшой посёлок, поэтому часто техника подаётся из соседней Печоры; условия подачи уточняет менеджер.",
    nearby: ["Печора", "Усинск"],
  },
};

// Группы техники: отдельные страницы «группа + город»
export const GROUP_PAGES: Record<
  string,
  {
    group: CategoryGroup;
    name: string;
    genitive: string;
    accusative: string;
    intro: string;
    useCases: string[];
    faq: { q: string; a: string }[];
  }
> = {
  "gruzopodemnaya-tehnika": {
    group: "LIFTING",
    name: "Грузоподъёмная техника",
    genitive: "грузоподъёмной техники",
    accusative: "грузоподъёмную технику",
    intro:
      "К грузоподъёмной технике относятся автокраны 25 и 50 тонн и автовышки (АГП): они нужны, когда груз или рабочего нужно поднять на высоту или переместить там, где это нельзя сделать вручную.",
    useCases: [
      "Монтаж металлоконструкций, плит и оборудования",
      "Погрузка и разгрузка негабаритных и тяжёлых грузов",
      "Работы на высоте: опоры, фасады, кровля, освещение",
      "Обслуживание промышленных площадок",
    ],
    faq: [
      {
        q: "Чем автокран отличается от автовышки?",
        a: "Автокран поднимает груз на крюке и нужен для монтажа и погрузки. Автовышка (АГП) поднимает людей в люльке для работ на высоте. Если не уверены, что подойдёт, опишите задачу менеджеру.",
      },
    ],
  },
  "zemleroynaya-tehnika": {
    group: "EARTHMOVING",
    name: "Землеройная техника",
    genitive: "землеройной техники",
    accusative: "землеройную технику",
    intro:
      "К землеройной технике относятся гусеничные экскаваторы и бульдозеры. Они подходят для работ на слабых и заболоченных грунтах, которые типичны для северных районов.",
    useCases: [
      "Рытьё траншей, котлованов и канав",
      "Планировка и подготовка площадок",
      "Устройство временных дорог и подсыпка",
      "Расчистка территорий и снега",
    ],
    faq: [
      {
        q: "Что выбрать для болотистого грунта?",
        a: "Для слабых грунтов подбирают технику на гусеничном ходу, часть машин оснащена болотными гусеницами и сланями. Наличие указано в карточке конкретной машины.",
      },
    ],
  },
  "passazhirskiy-transport": {
    group: "PASSENGER",
    name: "Пассажирские перевозки",
    genitive: "пассажирского транспорта",
    accusative: "пассажирский транспорт",
    intro:
      "Пассажирский транспорт — вахтовые автобусы повышенной проходимости на 22–28 мест и легковой транспорт до 8 мест. Нужны для перевозки бригад к объектам и служебных поездок.",
    useCases: [
      "Перевозка вахтовых бригад до объекта и обратно",
      "Поездки по грунтовым дорогам и зимникам",
      "Служебные поездки и командировки",
      "Встреча и сопровождение гостей объекта",
    ],
    faq: [
      {
        q: "Можно ли заказать разовый рейс?",
        a: "Да. Аренда почасовая, поэтому можно заказать как разовую поездку, так и регулярные рейсы по договорённости с менеджером.",
      },
    ],
  },
};

// Поисковые намерения для страниц «спецтехника + город»
export const INTENTS: Record<
  string,
  {
    label: string;
    title: (inCity: string) => string;
    h1: (inCity: string) => string;
  }
> = {
  tseny: {
    label: "Цены на аренду",
    title: (c) => `Цены на аренду спецтехники ${c}`,
    h1: (c) => `Цены на аренду спецтехники ${c}`,
  },
  pochasovaya: {
    label: "Почасовая аренда",
    title: (c) => `Почасовая аренда спецтехники ${c}`,
    h1: (c) => `Почасовая аренда спецтехники ${c}`,
  },
  "dlya-stroitelstva": {
    label: "Для строительства",
    title: (c) => `Спецтехника для строительства ${c}`,
    h1: (c) => `Спецтехника для строительства ${c}`,
  },
  "dlya-neftegaza": {
    label: "Для нефтегаза и вахты",
    title: (c) => `Спецтехника для нефтегазовых объектов ${c}`,
    h1: (c) => `Спецтехника для нефтегазовых объектов и вахты ${c}`,
  },
  zakazat: {
    label: "Заказать онлайн",
    title: (c) => `Заказать спецтехнику ${c}`,
    h1: (c) => `Заказать спецтехнику ${c} онлайн`,
  },
  "s-dostavkoy": {
    label: "С доставкой на объект",
    title: (c) => `Аренда спецтехники ${c} с подачей на объект`,
    h1: (c) => `Аренда спецтехники ${c} с подачей на объект`,
  },
  "s-operatorom": {
    label: "С оператором",
    title: (c) => `Аренда спецтехники ${c}: с оператором или без`,
    h1: (c) => `Аренда спецтехники ${c}: условия и оператор`,
  },
};

const CATEGORY_SYNONYMS: Record<string, string> = {
  "avtokran-25t": "автокран 25 тонн, кран 25 т, грузовой кран на шасси-вездеходе",
  "avtokran-50t": "автокран 50 тонн, кран 50 т, тяжёлый автокран",
  "avtovyshka-agp": "автовышка, АГП, автогидроподъёмник, подъёмник с люлькой",
  "gusenichnyy-ekskavator": "гусеничный экскаватор, экскаватор для болота, экскаватор с болотными гусеницами",
  buldozer: "бульдозер, гусеничный трактор с отвалом, бульдозер для планировки",
  "vahtovyy-avtobus": "вахтовый автобус, вахтовка, автобус для перевозки бригад",
  "legkovye-ts": "легковой автомобиль, служебная машина, транспорт до 8 мест",
};

export const categorySynonyms = (slug: string) => CATEGORY_SYNONYMS[slug];

const OTHER = "в Республике Коми и НАО";

function cityLinks(skip?: ServiceCityName | null, build: (c: ServiceCityName) => string = (c) => `/spetstehnika/${CITY_INFO[c].slug}`) {
  return SERVICE_CITIES.filter((c) => c !== skip).map((c) => ({ label: c, href: build(c) }));
}

async function loadAll() {
  const [vehicles, categories] = await Promise.all([getVehicles(), getCategories()]);
  return { vehicles, categories };
}

function categoryPriceRows(
  all: Vehicles,
  city: ServiceCityName | null,
  categories: Awaited<ReturnType<typeof getCategories>>
) {
  return categories
    .filter((c) => CATEGORY_LANDING[c.slug])
    .map((c) => {
      const inCat = all.filter((v) => v.category.slug === c.slug);
      const inCity = city ? inCat.filter((v) => v.city === city) : inCat;
      const price = minPriceOf(inCity.length ? inCity : inCat);
      return {
        name: CATEGORY_SEO[c.slug]?.title ?? c.name,
        href: city ? `/arenda/${c.slug}/${CITY_INFO[city].slug}` : `/arenda/${c.slug}`,
        price,
        inCity: inCity.length > 0,
      };
    });
}

function commonFaq(city: ServiceCityName | null, minPrice: number | null) {
  const where = city ? CITY_INFO[city].in : OTHER;
  return [
    {
      q: `Сколько стоит аренда спецтехники ${where}?`,
      a:
        minPrice !== null
          ? `Тарифы на сайте начинаются от ${formatPrice(minPrice)} в час без учёта 5% НДС. Итог зависит от типа машины, срока аренды и условий оплаты — точный расчёт сделает менеджер.`
          : "Стоимость зависит от типа машины и срока аренды. Оставьте заявку, и менеджер рассчитает цену под ваш объект.",
    },
    {
      q: "Нужна ли предоплата?",
      a: "Нет, онлайн-оплата при бронировании не требуется. Вы отправляете заявку с датами, менеджер подтверждает бронь по телефону.",
    },
    {
      q: "Как забронировать технику?",
      a: "Выберите машину в каталоге, отметьте свободные даты в календаре занятости и отправьте заявку. Заявки принимаются на сайте круглосуточно.",
    },
  ];
}

// ───────── страницы «спецтехника» (регион и город) ─────────

export async function buildSpecPage(citySlug?: string): Promise<SeoPageModel | null> {
  const city = citySlug ? cityBySlug(citySlug) : null;
  if (citySlug && !city) return null;
  const { vehicles: all, categories } = await loadAll();
  const here = city ? all.filter((v) => v.city === city) : all;
  const where = city ? CITY_INFO[city].in : OTHER;
  const extra = city ? CITY_EXTRA[city] : null;
  const minPrice = minPriceOf(here.length ? here : all);

  const intro: string[] = city
    ? [
        `Аренда спецтехники ${where}: автокраны 25 и 50 тонн, автовышки (АГП), гусеничные экскаваторы и бульдозеры, вахтовые автобусы и легковой транспорт. Почасовые тарифы, бронирование онлайн без предоплаты.`,
        CITY_INFO[city].note,
        extra!.logistics,
      ]
    : [
        "Аренда спецтехники и транспорта в Республике Коми и Ненецком автономном округе: автокраны, автовышки, экскаваторы, бульдозеры, вахтовые автобусы и легковые автомобили. Работаем в Сыктывкаре, Ухте, Усинске, Печоре, Воркуте, Сосногорске, Кожве, Нарьян-Маре и Харьягинском.",
        "Выберите город, чтобы увидеть технику и тарифы, доступные там.",
      ];

  const title = city
    ? `Аренда спецтехники ${where}${minPrice !== null ? ` — от ${formatPrice(minPrice)}/час` : ""}`
    : "Аренда спецтехники в Республике Коми и НАО — каталог и цены";
  const description = city
    ? `Аренда спецтехники ${where}: автокраны, автовышки, экскаваторы, бульдозеры, вахтовые автобусы. Почасовые тарифы${
        minPrice !== null ? ` от ${formatPrice(minPrice)}` : ""
      }, заявка онлайн без предоплаты.`
    : "Аренда автокранов, автовышек, экскаваторов, бульдозеров и вахтовых автобусов в Сыктывкаре, Ухте, Усинске, Печоре, Воркуте и Нарьян-Маре. Почасовые тарифы, без предоплаты.";

  const sections: SeoPageModel["sections"] = [];
  if (city) {
    sections.push({
      title: `Для каких работ арендуют технику ${where}`,
      bullets: extra!.works,
    });
  }
  sections.push({
    title: "Какая техника доступна",
    bullets: categories
      .filter((c) => CATEGORY_LANDING[c.slug])
      .map((c) => `${CATEGORY_SEO[c.slug]?.title ?? c.name}: ${CATEGORY_SYNONYMS[c.slug] ?? ""}`),
  });

  const faq = [
    ...commonFaq(city, minPrice),
    ...(city
      ? [
          {
            q: `Есть ли техника ${where} прямо сейчас?`,
            a:
              here.length > 0
                ? `Да, ${where} в каталоге ${here.length} ${pluralize(here.length, ["единица", "единицы", "единиц"])} техники. Свободные даты видны в календаре занятости на странице каждой машины.`
                : `Прямо сейчас ${where} в каталоге нет свободной техники, но мы подберём вариант в соседнем городе (${extra!.nearby.join(", ")}) — условия подачи уточняет менеджер.`,
          },
        ]
      : []),
  ];

  const linkGroups: SeoPageModel["linkGroups"] = [];
  if (city) {
    linkGroups.push({
      title: `Что ещё ищут ${where}`,
      links: Object.entries(INTENTS).map(([k, i]) => ({
        label: `${i.label} ${where}`,
        href: `/spetstehnika/${CITY_INFO[city].slug}/${k}`,
      })),
    });
    linkGroups.push({
      title: `Техника ${where} по видам`,
      links: [
        ...Object.entries(GROUP_PAGES).map(([slug, g]) => ({
          label: `${g.name} ${where}`,
          href: `/tehnika/${slug}/${CITY_INFO[city].slug}`,
        })),
        ...Object.keys(CATEGORY_LANDING).map((slug) => ({
          label: `${CATEGORY_SEO[slug]?.title ?? slug} ${where}`,
          href: `/arenda/${slug}/${CITY_INFO[city].slug}`,
        })),
      ],
    });
    linkGroups.push({
      title: "Соседние города",
      links: extra!.nearby.map((c) => ({ label: `Спецтехника ${CITY_INFO[c].in}`, href: `/spetstehnika/${CITY_INFO[c].slug}` })),
    });
  } else {
    linkGroups.push({
      title: "Спецтехника по городам",
      links: SERVICE_CITIES.map((c) => ({
        label: `Аренда спецтехники ${CITY_INFO[c].in}`,
        href: `/spetstehnika/${CITY_INFO[c].slug}`,
      })),
    });
    linkGroups.push({
      title: "Виды техники",
      links: [
        ...Object.entries(GROUP_PAGES).map(([slug, g]) => ({ label: g.name, href: `/tehnika/${slug}` })),
        ...Object.keys(CATEGORY_LANDING).map((slug) => ({
          label: CATEGORY_SEO[slug]?.title ?? slug,
          href: `/arenda/${slug}`,
        })),
      ],
    });
  }

  return {
    path: city ? `/spetstehnika/${CITY_INFO[city].slug}` : "/spetstehnika",
    title,
    description,
    h1: city ? `Аренда спецтехники ${where}` : "Аренда спецтехники в Республике Коми и НАО",
    eyebrow: city ?? "Коми · НАО",
    breadcrumbs: city
      ? [{ name: "Главная", href: "/" }, { name: "Спецтехника", href: "/spetstehnika" }, { name: city }]
      : [{ name: "Главная", href: "/" }, { name: "Спецтехника" }],
    intro,
    vehiclesTitle: city ? `Техника в аренду ${where}` : "Популярная техника в каталоге",
    vehicles: city ? here : all.slice(0, 12),
    fallbackTitle: city && here.length === 0 ? "Техника из соседних городов" : undefined,
    fallbackText:
      city && here.length === 0
        ? `${city}: в каталоге пока нет собственной техники. Ниже варианты из других городов региона; условия подачи на объект согласует менеджер.`
        : undefined,
    fallbackVehicles: city && here.length === 0 ? all.slice(0, 9) : undefined,
    sections,
    priceTable: {
      title: city ? `Тарифы на технику ${where}` : "Стартовые тарифы по видам техники",
      rows: categoryPriceRows(all, city, categories),
    },
    faq,
    linkGroups,
  };
}

// ───────── страницы «группа техники» (регион и город) ─────────

export async function buildGroupPage(groupSlug: string, citySlug?: string): Promise<SeoPageModel | null> {
  const g = GROUP_PAGES[groupSlug];
  if (!g) return null;
  const city = citySlug ? cityBySlug(citySlug) : null;
  if (citySlug && !city) return null;
  const { vehicles: all, categories } = await loadAll();
  const inGroup = all.filter((v) => v.category.group === g.group);
  const here = city ? inGroup.filter((v) => v.city === city) : inGroup;
  const where = city ? CITY_INFO[city].in : OTHER;
  const extra = city ? CITY_EXTRA[city] : null;
  const minPrice = minPriceOf(here.length ? here : inGroup);
  const groupCats = categories.filter((c) => c.group === g.group && CATEGORY_LANDING[c.slug]);

  const intro = [
    `Аренда ${g.genitive} ${where}. ${g.intro}`,
    ...(city ? [CITY_INFO[city].note, extra!.logistics] : []),
  ];

  const faq = [
    ...g.faq,
    {
      q: `Сколько стоит аренда ${g.genitive} ${where}?`,
      a:
        minPrice !== null
          ? `Тарифы начинаются от ${formatPrice(minPrice)} в час без учёта 5% НДС. Итог зависит от машины, срока и условий оплаты — точный расчёт сделает менеджер.`
          : "Стоимость зависит от конкретной машины и срока аренды: оставьте заявку, и менеджер рассчитает цену.",
    },
    {
      q: "Нужна ли предоплата?",
      a: "Нет, онлайн-оплата при бронировании не требуется: менеджер подтверждает бронь по телефону.",
    },
    ...(city
      ? [
          {
            q: `Можно ли заказать ${g.accusative} ${where}?`,
            a:
              here.length > 0
                ? `Да, ${where} в каталоге ${here.length} ${pluralize(here.length, ["вариант", "варианта", "вариантов"])}. Свободные даты видны в календаре на странице машины.`
                : `Собственной техники этого типа ${where} в каталоге пока нет, но мы подберём вариант из соседнего города (${extra!.nearby.join(", ")}).`,
          },
        ]
      : []),
  ];

  const where2 = where;
  return {
    path: city ? `/tehnika/${groupSlug}/${CITY_INFO[city].slug}` : `/tehnika/${groupSlug}`,
    title: `Аренда ${g.genitive} ${where}${minPrice !== null ? ` — от ${formatPrice(minPrice)}/час` : ""}`,
    description: `Аренда ${g.genitive} ${where}: ${groupCats
      .map((c) => (CATEGORY_SEO[c.slug]?.title ?? c.name).replace(/^Аренда /, "").toLowerCase())
      .join(", ")}. Почасовые тарифы, без предоплаты.`,
    h1: `Аренда ${g.genitive} ${where}`,
    eyebrow: city ?? g.name,
    breadcrumbs: [
      { name: "Главная", href: "/" },
      { name: g.name, href: city ? `/tehnika/${groupSlug}` : undefined },
      ...(city ? [{ name: city }] : []),
    ],
    intro,
    vehiclesTitle: `${g.name} в аренду ${where}`,
    vehicles: here,
    fallbackTitle: city && here.length === 0 ? "Такая же техника в других городах" : undefined,
    fallbackText:
      city && here.length === 0
        ? `${city}: в каталоге пока нет такой техники. Ниже варианты из других городов региона.`
        : undefined,
    fallbackVehicles: city && here.length === 0 ? inGroup.slice(0, 9) : undefined,
    sections: [
      { title: "Для каких задач подходит", bullets: g.useCases },
      ...(city ? [{ title: `Типичные работы ${where}`, bullets: extra!.works }] : []),
      {
        title: "Виды техники в этой группе",
        bullets: groupCats.map((c) => `${CATEGORY_SEO[c.slug]?.title ?? c.name}: ${CATEGORY_SYNONYMS[c.slug] ?? ""}`),
      },
    ],
    priceTable: {
      title: `Тарифы: ${g.genitive} ${where2}`,
      rows: categoryPriceRows(all, city, groupCats),
    },
    faq,
    linkGroups: [
      {
        title: `Конкретные виды ${where2}`,
        links: groupCats.map((c) => ({
          label: `${CATEGORY_SEO[c.slug]?.title ?? c.name} ${city ? CITY_INFO[city].in : ""}`.trim(),
          href: city ? `/arenda/${c.slug}/${CITY_INFO[city].slug}` : `/arenda/${c.slug}`,
        })),
      },
      {
        title: city ? `${g.name} в других городах` : `${g.name} по городам`,
        links: cityLinks(city, (c) => `/tehnika/${groupSlug}/${CITY_INFO[c].slug}`).map((l) => ({
          label: `${g.name} ${CITY_INFO[SERVICE_CITIES.find((c) => c === l.label)!].in}`,
          href: l.href,
        })),
      },
      {
        title: "Другие группы техники",
        links: Object.entries(GROUP_PAGES)
          .filter(([s]) => s !== groupSlug)
          .map(([s, x]) => ({
            label: x.name + (city ? ` ${CITY_INFO[city].in}` : ""),
            href: city ? `/tehnika/${s}/${CITY_INFO[city].slug}` : `/tehnika/${s}`,
          })),
      },
    ],
  };
}

// ───────── страницы под поисковые намерения: /spetstehnika/[город]/[намерение] ─────────

export async function buildIntentPage(citySlug: string, intentSlug: string): Promise<SeoPageModel | null> {
  const city = cityBySlug(citySlug);
  const intent = INTENTS[intentSlug];
  if (!city || !intent) return null;
  const { vehicles: all, categories } = await loadAll();
  const here = all.filter((v) => v.city === city);
  const where = CITY_INFO[city].in;
  const extra = CITY_EXTRA[city];
  const minPrice = minPriceOf(here.length ? here : all);
  const minHours = here.length ? Math.min(...here.map((v) => Math.max(1, v.minHours))) : null;
  const rows = categoryPriceRows(all, city, categories);

  const base = commonFaq(city, minPrice);
  let intro: string[] = [];
  let sections: SeoPageModel["sections"] = [];
  let faq = base;
  let priceTable: SeoPageModel["priceTable"];
  let relevant = here;

  switch (intentSlug) {
    case "tseny":
      intro = [
        `Сколько стоит аренда спецтехники ${where}? Стоимость на сайте указана за час и зависит от типа машины. Ниже — стартовые тарифы по видам техники${here.length ? ` ${where}` : " (по региону, если в городе пока нет собственной техники)"}.`,
        "Все цены даны без учёта 5% НДС. Итоговая сумма зависит от срока аренды, количества техники и условий оплаты.",
      ];
      priceTable = { title: `Стартовые тарифы ${where}`, rows };
      sections = [
        {
          title: "От чего зависит цена аренды",
          bullets: [
            "Тип и грузоподъёмность техники (автокран 25 т дешевле 50 т)",
            "Срок аренды: почасовая оплата, минимальный срок указан в карточке машины",
            "Удалённость объекта и условия подачи техники",
            "Количество арендуемых машин и условия оплаты",
          ],
        },
        { title: `Типичные работы ${where}`, bullets: extra.works },
      ];
      faq = [
        ...base,
        {
          q: "Входит ли НДС в стоимость?",
          a: "Нет, тарифы на сайте указаны без учёта 5% НДС; итоговую стоимость с НДС уточняет менеджер.",
        },
      ];
      break;
    case "pochasovaya":
      intro = [
        `Почасовая аренда спецтехники ${where} позволяет платить только за фактически нужное время: от одного часа до длительных смен. Минимальный срок указан в карточке каждой машины${minHours ? ` (${where} — от ${minHours} ${minHours === 1 ? "часа" : "часов"})` : ""}.`,
        CITY_INFO[city].note,
      ];
      sections = [
        {
          title: "Как работает почасовая аренда",
          bullets: [
            "Выбираете машину и свободные даты в календаре занятости",
            "Указываете время начала и окончания — сайт сразу считает итоговую сумму",
            "Менеджер подтверждает бронь по телефону, предоплата онлайн не нужна",
            "Платите за часы работы по договорённости с владельцем техники",
          ],
        },
        { title: `Когда выгодна почасовая аренда ${where}`, bullets: extra.works },
      ];
      priceTable = { title: `Стартовые тарифы за час ${where}`, rows };
      faq = [
        ...base,
        {
          q: "Какой минимальный срок аренды?",
          a: minHours
            ? `${where} минимальный срок — от ${minHours} ${minHours === 1 ? "часа" : "часов"}; точное значение указано на странице машины.`
            : "Минимальный срок указан на странице каждой машины, обычно он составляет несколько часов.",
        },
      ];
      break;
    case "dlya-stroitelstva": {
      const slugs = ["avtokran-25t", "avtokran-50t", "avtovyshka-agp", "gusenichnyy-ekskavator", "buldozer"];
      relevant = here.filter((v) => slugs.includes(v.category.slug));
      intro = [
        `Спецтехника для строительства ${where}: автокраны для монтажа и погрузки, автовышки для работ на высоте, экскаваторы и бульдозеры для земляных работ и подготовки площадок.`,
        CITY_INFO[city].note,
      ];
      sections = [
        {
          title: "Какую технику выбирают для стройки",
          bullets: slugs.map((s) => `${CATEGORY_SEO[s]?.title}: ${CATEGORY_SYNONYMS[s]}`),
        },
        { title: `Типичные работы ${where}`, bullets: extra.works },
      ];
      priceTable = { title: `Тарифы на строительную технику ${where}`, rows: rows.filter((r) => slugs.some((s) => r.href.includes(s))) };
      break;
    }
    case "dlya-neftegaza": {
      intro = [
        `Для нефтегазовых объектов и вахтовых работ ${where} нужна техника, которая проходит по слабым грунтам и зимникам: гусеничные экскаваторы и бульдозеры, автокраны на шасси-вездеходе и вахтовые автобусы для бригад.`,
        extra.logistics,
      ];
      sections = [
        {
          title: "Что чаще всего заказывают на промыслах",
          bullets: [
            "Вахтовые автобусы (6х6) для доставки бригад на площадки",
            "Автокраны 25 и 50 тонн на шасси-вездеходе для монтажа и погрузки",
            "Гусеничные экскаваторы с болотными гусеницами для обустройства площадок",
            "Бульдозеры для планировки, временных дорог и расчистки снега",
          ],
        },
        { title: `Типичные работы ${where}`, bullets: extra.works },
      ];
      priceTable = { title: `Тарифы ${where}`, rows };
      break;
    }
    case "zakazat":
      intro = [
        `Заказать спецтехнику ${where} можно онлайн за пару минут: выберите машину, отметьте свободные даты в календаре занятости и отправьте заявку. Менеджер перезвонит и подтвердит бронь, предоплата не нужна.`,
        "Заявки принимаются на сайте круглосуточно; если техника нужна срочно, позвоните менеджеру по номеру на сайте.",
      ];
      sections = [
        {
          title: "Как заказать технику: 3 шага",
          bullets: [
            "Выберите технику в каталоге по городу, категории и цене",
            "Отметьте даты в календаре занятости и укажите телефон",
            "Дождитесь звонка менеджера и подтвердите условия",
          ],
        },
        { title: `Что можно заказать ${where}`, bullets: extra.works },
      ];
      priceTable = { title: `Стартовые тарифы ${where}`, rows };
      break;
    case "s-dostavkoy":
      intro = [
        `Аренда спецтехники ${where} с подачей на объект: техника приезжает на площадку заказчика, условия и стоимость подачи согласуются с менеджером и владельцем машины.`,
        extra.logistics,
      ];
      sections = [
        {
          title: "Что уточнить перед заказом",
          bullets: [
            "Адрес объекта и состояние подъездных путей (зимник, грунтовка, асфальт)",
            "Габариты груза или объём работ — чтобы подобрать подходящую машину",
            "Сроки подачи и время начала работ",
            "Условия и стоимость подачи техники на объект",
          ],
        },
        { title: `Типичные работы ${where}`, bullets: extra.works },
      ];
      priceTable = { title: `Стартовые тарифы ${where}`, rows };
      faq = [
        ...base,
        {
          q: "Кто оплачивает подачу техники на объект?",
          a: "Условия подачи зависят от расстояния и владельца машины: их согласует менеджер при подтверждении заявки.",
        },
      ];
      break;
    case "s-operatorom":
      intro = [
        `Аренда спецтехники ${where}: многие заказчики сначала спрашивают, предоставляется ли оператор. Условие зависит от владельца конкретной машины и указывается при подтверждении заявки менеджером.`,
        "Уточняйте у менеджера: нужен ли вам экипаж (оператор, водитель), какие смены и как оплачивается работа.",
      ];
      sections = [
        {
          title: "Что обсудить с менеджером при заказе",
          bullets: [
            "Нужен ли оператор (водитель) вместе с техникой",
            "Количество смен и часов работы в сутки",
            "Кто обеспечивает топливо и доступ на площадку",
            "Условия оплаты и оформление договора",
          ],
        },
        { title: `Типичные работы ${where}`, bullets: extra.works },
      ];
      priceTable = { title: `Стартовые тарифы ${where}`, rows };
      faq = [
        ...base,
        {
          q: "Можно ли арендовать технику вместе с оператором?",
          a: "Условия зависят от конкретной машины и владельца. Укажите это в комментарии к заявке — менеджер подтвердит, какой вариант доступен.",
        },
      ];
      break;
  }

  return {
    path: `/spetstehnika/${CITY_INFO[city].slug}/${intentSlug}`,
    title: intent.title(where),
    description: `${intent.title(where)}. ${commonFaq(city, minPrice)[0].a.split(".")[0]}. Заявка онлайн без предоплаты.`,
    h1: intent.h1(where),
    eyebrow: city,
    breadcrumbs: [
      { name: "Главная", href: "/" },
      { name: "Спецтехника", href: "/spetstehnika" },
      { name: city, href: `/spetstehnika/${CITY_INFO[city].slug}` },
      { name: intent.label },
    ],
    intro,
    vehiclesTitle: `Техника в аренду ${where}`,
    vehicles: relevant,
    fallbackTitle: relevant.length === 0 ? "Техника из соседних городов" : undefined,
    fallbackText:
      relevant.length === 0
        ? `${city}: подходящей техники в каталоге пока нет. Ниже варианты из других городов региона; условия подачи согласует менеджер.`
        : undefined,
    fallbackVehicles: relevant.length === 0 ? all.slice(0, 9) : undefined,
    sections,
    priceTable,
    faq,
    linkGroups: [
      {
        title: `Ещё про аренду спецтехники ${where}`,
        links: [
          { label: `Вся спецтехника ${where}`, href: `/spetstehnika/${CITY_INFO[city].slug}` },
          ...Object.entries(INTENTS)
            .filter(([k]) => k !== intentSlug)
            .map(([k, i]) => ({ label: `${i.label} ${where}`, href: `/spetstehnika/${CITY_INFO[city].slug}/${k}` })),
        ],
      },
      {
        title: "Та же тема в соседних городах",
        links: extra.nearby.map((c) => ({
          label: `${intent.label} ${CITY_INFO[c].in}`,
          href: `/spetstehnika/${CITY_INFO[c].slug}/${intentSlug}`,
        })),
      },
    ],
  };
}

export function allSeoPaths() {
  const cities = SERVICE_CITIES.map((c) => CITY_INFO[c].slug);
  const groups = Object.keys(GROUP_PAGES);
  return [
    { path: "/spetstehnika", priority: 0.9 },
    ...cities.map((c) => ({ path: `/spetstehnika/${c}`, priority: 0.8 })),
    ...groups.map((g) => ({ path: `/tehnika/${g}`, priority: 0.8 })),
    ...groups.flatMap((g) => cities.map((c) => ({ path: `/tehnika/${g}/${c}`, priority: 0.7 }))),
    ...cities.flatMap((c) => Object.keys(INTENTS).map((i) => ({ path: `/spetstehnika/${c}/${i}`, priority: 0.6 }))),
    ...Object.keys(CATEGORY_LANDING).flatMap((cat) =>
      cities.map((c) => ({ path: `/arenda/${cat}/${c}`, priority: 0.7 }))
    ),
  ];
}
