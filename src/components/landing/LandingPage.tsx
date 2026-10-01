import Link from "next/link";
import { headers } from "next/headers";
import { VehicleCard } from "@/components/catalog/VehicleCard";
import { formatPrice, PRICING_NOTE } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { CITY_INFO, SERVICE_CITIES } from "@/lib/cities";
import { CATEGORY_INTENTS, CITY_EXTRA, categorySynonyms } from "@/lib/seo-pages";
import { landingPath, pluralize, type getLandingData } from "@/lib/landing";
import { ACCUSATIVE, CATEGORY_LANDING, CATEGORY_SEO } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";

type Data = NonNullable<Awaited<ReturnType<typeof getLandingData>>>;

export async function LandingPage({ data }: { data: Data }) {
  const { category, content, city, vehicles, otherVehicles, minPrice, minHours } = data;
  const nonce = (await headers()).get("x-nonce") || undefined;

  const where = city ? CITY_INFO[city].in : "в Республике Коми и НАО";
  const heading = `Аренда ${content.genitive} ${where}`;
  const path = landingPath(category.slug, city);

  const otherCities = SERVICE_CITIES.filter((c) => c !== city);
  const otherCategories = city
    ? Object.keys(CATEGORY_LANDING)
        .filter((slug) => slug !== category.slug)
        .map((slug) => ({ categorySlug: slug }))
    : [];

  const faq = [
    ...content.faq,
    {
      q: `Сколько стоит аренда ${content.genitive} ${where}?`,
      a:
        minPrice !== null
          ? `Стоимость начинается от ${formatPrice(minPrice)} в час без учёта 5% НДС. Итог зависит от срока аренды, условий оплаты и объёма работ — точный расчёт сделает менеджер.`
          : "Тарифы зависят от конкретной машины и срока аренды — оставьте заявку, и менеджер рассчитает стоимость под ваш объект.",
    },
    {
      q: "Нужна ли предоплата?",
      a: "Нет, онлайн-оплата при бронировании не требуется. Вы отправляете заявку с датами, менеджер подтверждает бронь по телефону.",
    },
    ...(minHours !== null
      ? [
          {
            q: "Какой минимальный срок аренды?",
            a: `От ${minHours} ${minHours === 1 ? "часа" : "часов"}. Аренда почасовая, поэтому вы платите только за нужное время.`,
          },
        ]
      : []),
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
        ...(city
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: `Аренда ${content.genitive}`,
                item: `${SITE_URL}${landingPath(category.slug)}`,
              },
              { "@type": "ListItem", position: 4, name: city, item: `${SITE_URL}${path}` },
            ]
          : [
              {
                "@type": "ListItem",
                position: 3,
                name: `Аренда ${content.genitive}`,
                item: `${SITE_URL}${path}`,
              },
            ]),
      ],
    },
    ...(vehicles.length > 0 && minPrice !== null
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: `Аренда ${content.genitive} ${where}`,
            category: category.name,
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "RUB",
              lowPrice: String(minPrice),
              offerCount: vehicles.length,
              availability: "https://schema.org/InStock",
            },
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const seoDescription = CATEGORY_SEO[category.slug]?.description;

  return (
    <>
      <PageHero title={heading} eyebrow={city ?? "Коми · НАО"}>
        <nav aria-label="Навигация" className="mt-4 text-sm text-white/60">
          <Link href="/" className="hover:text-white">Главная</Link>
          {" / "}
          <Link href="/catalog" className="hover:text-white">Каталог</Link>
          {city && (
            <>
              {" / "}
              <Link href={landingPath(category.slug)} className="hover:text-white">
                {category.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-white">{city ?? category.name}</span>
        </nav>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-8">
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <div className="mt-4 max-w-3xl space-y-3 text-gray-700">
        <p>{content.intro}</p>
        {city && <p>{CITY_INFO[city].note}</p>}
        {vehicles.length > 0 ? (
          <p>
            {city ? `Сейчас ${where}` : "Сейчас на сайте"} доступно {vehicles.length}{" "}
            {pluralize(vehicles.length, ["вариант", "варианта", "вариантов"])}
            {minPrice !== null && <> — тарифы от {formatPrice(minPrice)} в час</>}. Отметьте
            свободные даты в календаре занятости и отправьте заявку — предоплата онлайн не
            требуется.
          </p>
        ) : (
          <p>
            {city ? `${city}: ` : ""}свободных вариантов в каталоге сейчас нет — оставьте
            запрос менеджеру, мы подберём технику под ваш объект.
          </p>
        )}
        {seoDescription && vehicles.length === 0 && <p>{seoDescription}</p>}
      </div>

      {vehicles.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-brand-navy">
            {(ACCUSATIVE[category.slug] ?? content.genitive).replace(/^./, (c) => c.toUpperCase())} в аренду {where}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <p className="mt-3 text-xs text-gray-400">{PRICING_NOTE}</p>
        </section>
      )}

      {city && otherVehicles.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-bold text-brand-navy">
            Та же техника в других городах региона
          </h2>
          <p className="mb-4 max-w-3xl text-sm text-gray-600">
            {vehicles.length === 0 ? `${city}: в каталоге пока нет такой техники. ` : ""}
            Технику можно заказать в соседнем городе — условия доставки уточняйте у менеджера.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherVehicles.map((v) => (
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

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-brand-navy">Для каких задач подходит</h2>
        <ul className="list-inside list-disc space-y-1 text-gray-700">
          {content.useCases.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>

      {city && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-brand-navy">
            Для каких работ арендуют {ACCUSATIVE[category.slug] ?? content.genitive} {where}
          </h2>
          <ul className="list-inside list-disc space-y-1 text-gray-700">
            {CITY_EXTRA[city].works.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="mt-3 max-w-3xl text-sm text-gray-600">{CITY_EXTRA[city].logistics}</p>
        </section>
      )}

      {categorySynonyms(category.slug) && (
        <p className="mt-6 max-w-3xl text-sm text-gray-500">
          Также ищут: {categorySynonyms(category.slug)}.
        </p>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-brand-navy">Частые вопросы</h2>
        <div className="space-y-4">
          {faq.map((f) => (
            <div key={f.q} className="rounded-xl border border-black/10 bg-white p-4">
              <h3 className="font-semibold text-brand-navy">{f.q}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {city && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-brand-navy">Ещё про аренду {content.genitive} {where}</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_INTENTS).map(([k, i]) => (
              <Link
                key={k}
                href={`/arenda/${category.slug}/${CITY_INFO[city].slug}/${k}`}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
              >
                {i.link(content.genitive, where)}
              </Link>
            ))}
            <Link
              href={`/spetstehnika/${CITY_INFO[city].slug}`}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
            >
              Вся спецтехника {where}
            </Link>
          </div>
        </section>
      )}

      {(otherCities.length > 0 || otherCategories.length > 0) && (
        <section className="mt-10">
          {otherCities.length > 0 && (
            <>
              <h2 className="mb-3 text-lg font-bold text-brand-navy">
                Аренда {content.genitive} в других городах
              </h2>
              <div className="flex flex-wrap gap-2">
                {city && (
                  <Link
                    href={landingPath(category.slug)}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
                  >
                    Весь регион
                  </Link>
                )}
                {otherCities.map((c) => (
                  <Link
                    key={c}
                    href={landingPath(category.slug, c)}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </>
          )}
          {otherCategories.length > 0 && city && (
            <>
              <h2 className="mb-3 mt-6 text-lg font-bold text-brand-navy">
                Другая техника {where}
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherCategories.map((c) => (
                  <Link
                    key={c.categorySlug}
                    href={landingPath(c.categorySlug, city)}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
                  >
                    {CATEGORY_SEO[c.categorySlug]?.title ?? c.categorySlug}
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      )}
      </div>
    </>
  );
}
