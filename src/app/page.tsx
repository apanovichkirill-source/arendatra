import type { Metadata } from "next";
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
import { CLIENTS, PHONES, WORK_HOURS } from "@/lib/contacts";
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
  { value: String(SERVICE_CITIES.length), label: "городов Коми и НАО" },
  { value: "0 ₽", label: "предоплата онлайн" },
  { value: "от 4 ч", label: "почасовая аренда" },
  { value: "24/7", label: "заявки на сайте" },
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

export default async function HomePage() {
  const [vehicles, cities, categories, combos] = await Promise.all([
    getVehicles(),
    getCities(),
    getCategories(),
    getLandingCombos(),
  ]);
  const featured = vehicles.slice(0, 6);
  // Минимальная ставка в группе — для подписи «от … ₽/ч» на плитке
  const minPrice = (group: string) => {
    const prices = vehicles
      .filter((v) => v.category.group === group && v.pricePerHour != null)
      .map((v) => Number(String(v.pricePerHour)))
      .filter((n) => Number.isFinite(n) && n > 0);
    return prices.length ? Math.min(...prices) : null;
  };
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

  return (
    <div>
      <section className="bg-brand-navy">
        <div className="mx-auto max-w-6xl px-4 py-16 text-white">
          <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Аренда спецтехники и транспорта в Республике Коми и НАО
          </h1>
          <p className="mt-4 max-w-xl text-white/80">
            Автокраны, автовышки, экскаваторы, бульдозеры, вахтовые автобусы и легковой
            транспорт — почасовая аренда с прозрачными тарифами, без предоплаты. Наша база — в
            Усинске (пгт Парма), работаем также в Ухте, Печоре, Воркуте, Сыктывкаре,
            Нарьян-Маре и других городах региона.
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
              {minPrice(g.group) !== null && (
                <p className="mt-3 text-sm font-semibold text-brand-navy">
                  от {formatPrice(minPrice(g.group))}/ч
                </p>
              )}
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
        <h2 className="text-2xl font-extrabold text-brand-navy">Когда нам звонят</h2>
        <p className="mt-1 text-sm text-gray-500">Задачи заказчиков и то, как мы их закрываем</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEEDS.map((n) => (
            <div key={n.need} className="rounded-2xl border border-black/10 bg-white p-5">
              <h3 className="font-bold text-brand-navy">{n.need}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{n.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-extrabold text-brand-navy">Часто ищут</h2>
        <div className="flex flex-wrap gap-2">
          {(["usinsk", "uhta", "syktyvkar", "pechora", "vorkuta"] as const).flatMap((slug) =>
            Object.keys(CATEGORY_SEO).slice(0, 4).map((cat) => {
              const city = SERVICE_CITIES.find((c) => CITY_INFO[c].slug === slug)!;
              return (
                <Link
                  key={`${cat}-${slug}`}
                  href={`/arenda/${cat}/${slug}`}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
                >
                  {(CATEGORY_SEO[cat]?.title ?? cat).replace(/^Аренда /, "Аренда ")} {CITY_INFO[city].in}
                </Link>
              );
            })
          )}
        </div>
        <div className="mt-6"><PartnerBlock /></div>
      </section>

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

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-extrabold text-brand-navy">Работаем с предприятиями нефтегазовой отрасли</h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Подаём технику и транспорт для заказчиков отрасли в Республике Коми и НАО, в том числе{" "}
            {CLIENTS.join(", ")}. Вся техника с документами, обученный персонал, оплата наличным и
            безналичным расчётом, работа по договору.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-8 text-2xl font-extrabold text-brand-navy">Как это работает</h2>
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-brand-blue/25 lg:block"
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

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-4 text-2xl font-extrabold text-brand-navy">Вопросы и ответы</h2>
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
                <span className="text-brand-blue transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="callback" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16">
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
    </div>
  );
}
