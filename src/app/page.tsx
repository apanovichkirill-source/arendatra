import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getVehicles, getCities, getCategories } from "@/lib/vehicles";
import { VehicleCard } from "@/components/catalog/VehicleCard";
import { CategoryPicker } from "@/components/catalog/CategoryPicker";
import { headers } from "next/headers";
import { PRICING_NOTE, formatPrice } from "@/lib/format";
import { CallbackForm } from "@/components/CallbackForm";
import { getLandingCombos, landingPath } from "@/lib/landing";
import { CATEGORY_SEO } from "@/lib/seo";
import { CITY_INFO, SERVICE_CITIES } from "@/lib/cities";
import { PartnerBlock } from "@/components/PartnerBlock";
import { LogoMark } from "@/components/Logo";
import { CLIENTS, PHONES, PROFILES, WORK_HOURS } from "@/lib/contacts";
import { VehicleIcon } from "@/components/catalog/VehicleIcon";
import { getLatestReviews } from "@/lib/reviews";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const GROUPS = [
  {
    group: "LIFTING",
    title: "Грузоподъёмная техника",
    description: "Автокраны 25 и 50 т, автовышки (АГП)",
    photo: "/vehicles/own/avtokran-25t-1.jpg",
    alt: "Автокран Челябинец 25 т на шасси Урал",
  },
  {
    group: "EARTHMOVING",
    title: "Землеройная техника",
    description: "Гусеничные экскаваторы, бульдозеры",
    photo: "/vehicles/own/ekskavator-4.jpg",
    alt: "Гусеничный экскаватор на земляных работах",
  },
  {
    group: "PASSENGER",
    title: "Пассажирские перевозки",
    description: "Вахтовые автобусы, легковой транспорт до 8 мест",
    photo: "/vehicles/own/vahtovka-2.jpg",
    alt: "Вахтовый автобус КАМАЗ 6×6",
  },
] as const;

const FACTS = [
  { value: String(SERVICE_CITIES.length), label: "городов Коми и НАО" },
  { value: "0 ₽", label: "предоплата онлайн" },
  { value: "от 4 ч", label: "почасовая аренда" },
  { value: "24/7", label: "заявки на сайте" },
];

// Чем своя техника отличается от посредника — блок рядом с заказчиками отрасли
const BASE_POINTS = [
  "Своя база в Усинске (пгт Парма) — подача по району без долгой перегонки",
  "Вездеходные шасси 6×6, болотные гусеницы и слани для слабых грунтов",
  "Договор, счёт и закрывающие документы, наличный и безналичный расчёт",
  "Обученный персонал на машинах, сроки подачи согласуем до выезда",
];

// Задачи, с которыми к нам приходят заказчики, и что мы для этого делаем
const NEEDS = [
  {
    need: "Технику нужно найти быстро, без обзвона",
    answer: "Каталог с ценами и календарём занятости: видно, какая машина свободна на ваши даты. Если нужной нет — менеджер подберёт замену.",
  },
  {
    need: "Важно, чтобы не подвели на объекте",
    answer: "Работаем по договору, вся техника с документами, на машинах обученный персонал. Сроки подачи согласуем до выезда.",
  },
  {
    need: "Бухгалтерии нужны документы",
    answer: "Договор, счёт и закрывающие документы. Оплата наличным или безналичным расчётом, тарифы — без учёта 5% НДС.",
  },
  {
    need: "Нужна разная техника на один объект",
    answer: "Автокраны 25 и 50 т, автовышки, экскаваторы, бульдозеры, вахтовые автобусы и легковой транспорт — в одном месте.",
  },
  {
    need: "Платить только за реальную работу",
    answer: "Почасовая аренда без предоплаты на сайте. Минимальный заказ — 4–8 часов в зависимости от машины.",
  },
  {
    need: "Объект на севере, далеко от дорог",
    answer: "База в Усинске (пгт Парма), вездеходные шасси 6×6, болотные гусеницы и слани для слабых грунтов. Работаем по Коми и НАО.",
  },
];

const STEPS = [
  {
    title: "Выберите технику",
    description: "Отфильтруйте каталог по городу, датам и цене — увидите только свободные машины",
  },
  {
    title: "Оставьте заявку",
    description: "Отметьте даты в календаре или закажите обратный звонок — заявки принимаем круглосуточно",
  },
  {
    title: "Согласуйте детали",
    description: "Менеджер перезвонит, уточнит объект, подачу и оплату, подтвердит бронь",
  },
  {
    title: "Техника на объекте",
    description: "Машина приезжает в согласованное время, по итогам — акт по отработанным часам",
  },
];

const FAQ = [
  {
    q: "Сколько стоит аренда спецтехники?",
    a: "Цена указана в карточке каждой машины за час работы, без учёта 5% НДС. Итог зависит от количества часов и условий подачи на объект — менеджер назовёт точную сумму до начала работ.",
  },
  {
    q: "Какой минимальный заказ?",
    a: "Для спецтехники — 8 часов, для вахтовых автобусов и легкового транспорта — 4 часа. Сверх минимума оплата идёт по отработанным часам.",
  },
  {
    q: "Нужна ли предоплата?",
    a: "Нет, бронирование на сайте без предоплаты. Порядок оплаты фиксируется в договоре: наличный или безналичный расчёт.",
  },
  {
    q: "Работаете с организациями по договору?",
    a: "Да. Заключаем договор, выставляем счёт и предоставляем закрывающие документы. Работаем с предприятиями нефтегазовой отрасли Коми и НАО.",
  },
  {
    q: "Как быстро подадите технику?",
    a: "Зависит от того, где свободная машина и где ваш объект. С базы в Усинске подаём по Усинску, Парме и на промыслы района без долгой перегонки; сроки подачи в другие города менеджер называет при заявке.",
  },
  {
    q: "Кто управляет техникой?",
    a: "На машинах работает обученный персонал. Условия по оператору или водителю для конкретной машины менеджер подтверждает при заявке.",
  },
];

// Города в первом экране — ссылки на страницы городов (внутренняя перелинковка с главной)
const HERO_CITIES = [
  { slug: "uhta", label: "Ухте" },
  { slug: "pechora", label: "Печоре" },
  { slug: "vorkuta", label: "Воркуте" },
  { slug: "syktyvkar", label: "Сыктывкаре" },
  { slug: "naryan-mar", label: "Нарьян-Маре" },
];

// Города, где ссылки на четыре главные категории ставим всегда, даже без объявлений в базе
const POPULAR_CITY_SLUGS = ["usinsk", "uhta", "syktyvkar", "pechora", "vorkuta"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-brand-orange" aria-label={`Оценка ${rating} из 5`}>
      {"★".repeat(rating)}
      <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function HomePage() {
  const [vehicles, cities, categories, combos, reviewData] = await Promise.all([
    getVehicles(),
    getCities(),
    getCategories(),
    getLandingCombos(),
    getLatestReviews(3),
  ]);
  const featured = vehicles.slice(0, 6);
  // Минимальная ставка в группе — для подписи «от … ₽/ч» на плитке
  const minPrice = (group?: string) => {
    const prices = vehicles
      .filter((v) => (!group || v.category.group === group) && v.pricePerHour != null)
      .map((v) => Number(String(v.pricePerHour)))
      .filter((n) => Number.isFinite(n) && n > 0);
    return prices.length ? Math.min(...prices) : null;
  };
  const overallMin = minPrice();
  const nonce = (await headers()).get("x-nonce") || undefined;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const categoryGroups = GROUPS.map((g) => ({
    group: g.group,
    categories: categories
      .filter((c) => c.group === g.group)
      .map((c) => ({ slug: c.slug, name: c.name })),
  }));

  // Ссылки на посадочные «категория + город», сгруппированные по городам (вместо трёх облаков тегов)
  const cityLinks = SERVICE_CITIES.map((city) => {
    const info = CITY_INFO[city];
    const seen = new Set<string>();
    const links: { href: string; label: string }[] = [];
    const add = (cat: string) => {
      const href = landingPath(cat, city);
      if (seen.has(href)) return;
      seen.add(href);
      links.push({ href, label: `${CATEGORY_SEO[cat]?.title ?? cat} ${info.in}` });
    };
    if (POPULAR_CITY_SLUGS.includes(info.slug)) Object.keys(CATEGORY_SEO).slice(0, 4).forEach(add);
    combos.filter((c) => c.city === city).forEach((c) => add(c.categorySlug));
    return { city, info, links };
  });

  return (
    <div>
      {/* Первый экран: оффер и звонок слева, своя техника справа */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="bg-blueprint absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-28 pt-12 lg:grid-cols-[1.05fr_1fr] lg:pb-32 lg:pt-16">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              Своя техника · база в Усинске
            </p>
            <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.08] sm:text-5xl">
              Аренда спецтехники и транспорта{" "}
              <span className="text-brand-orange">в Республике Коми и НАО</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
              Автокраны, автовышки, экскаваторы, бульдозеры, катки, вахтовые автобусы и легковой
              транспорт — почасовая аренда с прозрачными тарифами, без предоплаты.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${PHONES[0].tel}`}
                className="whitespace-nowrap rounded-xl bg-brand-orange px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:-translate-y-0.5 hover:bg-brand-orange-dark"
              >
                Позвонить: {PHONES[0].display}
              </a>
              <a
                href="#podbor"
                className="whitespace-nowrap rounded-xl border border-white/25 px-6 py-3.5 text-center font-semibold text-white transition hover:border-white hover:bg-white/5"
              >
                Подобрать технику
              </a>
            </div>
            <p className="mt-3 text-xs text-white/50">Звонки {WORK_HOURS}, заявки на сайте — круглосуточно</p>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/65">
              Наша база — в Усинске (пгт Парма):{" "}
              <Link href="/spetstehnika/usinsk" className="font-semibold text-white underline underline-offset-4">
                аренда спецтехники в Усинске
              </Link>{" "}
              без долгой подачи. Работаем также в{" "}
              {HERO_CITIES.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && (i === HERO_CITIES.length - 1 ? " и " : ", ")}
                  <Link href={`/spetstehnika/${c.slug}`} className="text-white/85 underline-offset-4 hover:underline">
                    {c.label}
                  </Link>
                </span>
              ))}
              .
            </p>
          </div>

          <figure className="blueprint-corners relative animate-fade-up [animation-delay:150ms]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/15">
              <Image
                src="/vehicles/own/avtokran-50t-1.jpg"
                alt="Автокран Галичанин 50 т на шасси КАМАЗ у базы Арендатры"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            {overallMin !== null && (
              <span className="absolute -top-3 right-4 rounded-lg bg-brand-orange px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                от {formatPrice(overallMin)}/ч
              </span>
            )}
            <figcaption className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-brand-navy shadow-xl">
              <span className="font-display text-2xl font-extrabold">50 т</span>
              <span className="border-l border-black/10 pl-3 text-xs leading-snug text-gray-500">
                Автокран Галичанин
                <br />
                КАМАЗ 6×6 · своя техника
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Подбор техники: карточка поиска заходит на первый экран */}
      <section id="podbor" className="relative z-10 mx-auto -mt-16 max-w-6xl scroll-mt-24 px-4">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xl shadow-brand-navy/10 sm:p-5">
          <p className="mb-3 text-sm font-bold text-brand-navy">Подбор техники</p>
          <form
            action="/catalog"
            method="get"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <input
              type="text"
              name="q"
              placeholder="Например, автокран или экскаватор"
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
          <dl className="mt-4 grid grid-cols-2 gap-y-3 border-t border-black/5 pt-4 text-center sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="font-display text-xl font-extrabold text-brand-blue sm:text-2xl">{f.value}</dt>
                <dd className="mt-0.5 text-xs text-gray-500 sm:text-sm">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Группы техники — плитки с реальными фото */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {GROUPS.map((g) => (
            <Link
              key={g.group}
              href={`/catalog?group=${g.group}`}
              className="reveal group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-2xl bg-brand-navy p-6 text-white"
            >
              <Image
                src={g.photo}
                alt={g.alt}
                fill
                sizes="(max-width: 640px) 100vw, 380px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/70 to-brand-navy/5" aria-hidden />
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-orange transition-transform duration-300 group-hover:scale-x-100" />
              <span className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <VehicleIcon group={g.group} className="h-6 w-6" />
                </span>
                <h2 className="mt-3 text-lg font-bold">{g.title}</h2>
                <span className="mt-1 block text-sm text-white/75">{g.description}</span>
                <span className="mt-3 flex items-center justify-between text-sm font-semibold">
                  {minPrice(g.group) !== null ? <span>от {formatPrice(minPrice(g.group))}/ч</span> : <span />}
                  <span className="transition group-hover:translate-x-1">Смотреть →</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">{PRICING_NOTE}</p>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Популярный транспорт</h2>
            <Link href="/catalog" className="shrink-0 text-sm font-semibold text-brand-blue hover:underline">
              Весь каталог →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <div key={v.id} className="reveal flex [&>*]:w-full">
                <VehicleCard
                  slug={v.slug}
                  title={v.title}
                  pricePerHour={v.pricePerHour}
                  city={v.city}
                  ownerName={v.owner.name}
                  categoryName={v.category.name}
                  categoryGroup={v.category.group}
                  attributes={v.attributes as Record<string, string> | null}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Доверие: заказчики отрасли и своя база */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">Нам доверяют</p>
            <h2 className="mt-2 text-2xl font-extrabold text-brand-navy sm:text-3xl">
              Работаем с предприятиями нефтегазовой отрасли
            </h2>
            <p className="mt-3 max-w-xl text-gray-600">
              Подаём технику и транспорт для заказчиков отрасли в Республике Коми и НАО. Вся техника
              с документами, обученный персонал, работа по договору.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {CLIENTS.map((c) => (
                <li
                  key={c}
                  className="font-display flex h-16 items-center justify-center rounded-xl border border-black/10 bg-background text-lg font-extrabold tracking-wide text-brand-navy/80"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal grid gap-5 sm:grid-cols-[0.9fr_1fr] sm:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-auto sm:h-full sm:min-h-80">
              <Image
                src="/vehicles/own/avtovyshka-2.jpg"
                alt="Автовышка на шасси КАМАЗ 6×6 на базе в Парме"
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy">Своя техника, а не посредник</h3>
              <ul className="mt-4 space-y-3">
                {BASE_POINTS.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
                    <CheckIcon />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Когда нам звонят</h2>
        <p className="mt-1 text-gray-500">Задачи заказчиков и то, как мы их закрываем</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEEDS.map((n, i) => (
            <div
              key={n.need}
              className="reveal rounded-2xl border border-black/10 bg-white p-5 transition hover:border-brand-blue/40 hover:shadow-lg hover:shadow-brand-blue/5"
            >
              <span className="font-display text-sm font-extrabold text-brand-orange">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-bold text-brand-navy">{n.need}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{n.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Отзывы: свои опубликованные + ссылка на Яндекс Карты */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Отзывы заказчиков</h2>
            {reviewData.count > 0 && reviewData.average !== null && (
              <p className="mt-1 text-gray-500">
                <span className="font-semibold text-brand-navy">★ {reviewData.average}</span> · {reviewData.count}{" "}
                {reviewData.count === 1 ? "отзыв" : reviewData.count < 5 ? "отзыва" : "отзывов"} на сайте
              </p>
            )}
          </div>
          <a
            href={PROFILES.yandexReviews}
            target="_blank"
            rel="noopener"
            className="shrink-0 text-sm font-semibold text-brand-blue hover:underline"
          >
            Отзывы на Яндекс Картах →
          </a>
        </div>
        {reviewData.reviews.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviewData.reviews.map((r) => (
              <figure key={r.id} className="reveal flex flex-col rounded-2xl border border-black/10 bg-white p-5">
                <Stars rating={r.rating} />
                <blockquote className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-gray-700">
                  «{r.text}»
                </blockquote>
                <figcaption className="mt-4 border-t border-black/5 pt-3 text-sm">
                  <span className="font-semibold text-brand-navy">{r.authorName}</span>
                  <Link href={`/vehicle/${r.vehicle.slug}`} className="block truncate text-xs text-gray-500 hover:text-brand-blue">
                    {r.vehicle.title}
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-gray-600">
            Отзывы о работе Арендатры собраны в нашей карточке на Яндекс Картах — там же можно
            оставить свой после заказа.
          </div>
        )}
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-8 text-2xl font-extrabold text-brand-navy sm:text-3xl">Как это работает</h2>
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-brand-blue/25 lg:block"
            aria-hidden
          />
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="reveal relative rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
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

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-5 text-2xl font-extrabold text-brand-navy sm:text-3xl">Вопросы и ответы</h2>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-navy">
                {f.q}
                <span className="text-xl text-brand-blue transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="callback" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-14">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy p-8 sm:p-10">
          <div className="bg-blueprint absolute inset-0" aria-hidden />
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
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {PHONES.map((ph) => (
                <a
                  key={ph.tel}
                  href={`tel:${ph.tel}`}
                  className="shrink-0 rounded-lg bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
                >
                  Позвонить: {ph.display}
                </a>
              ))}
            </div>
            <p className="text-xs text-white/60">Звонки {WORK_HOURS}. Заявки на сайте — круглосуточно.</p>
            <div className="w-full max-w-xl border-t border-white/15 pt-5">
              <p className="mb-3 text-sm font-semibold text-white">Или оставьте номер — перезвоним сами</p>
              <CallbackForm onDark />
            </div>
          </div>
        </div>
      </section>

      {/* Перелинковка на города и посадочные: один аккуратный указатель по городам */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Аренда спецтехники по городам</h2>
        <p className="mt-1 text-gray-500">Подаём технику по Республике Коми и Ненецкому автономному округу</p>
        <div className="mt-7 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {cityLinks.map(({ city, info, links }) => (
            <div key={city} className="mb-6 break-inside-avoid">
              <Link
                href={`/spetstehnika/${info.slug}`}
                className="font-semibold text-brand-navy hover:text-brand-blue"
              >
                Спецтехника {info.in}
              </Link>
              {links.length > 0 && (
                <ul className="mt-1.5 space-y-1 border-l-2 border-brand-blue-light pl-3">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-gray-500 hover:text-brand-blue">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PartnerBlock />
        </div>
      </section>
    </div>
  );
}
