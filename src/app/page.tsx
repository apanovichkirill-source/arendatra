import Link from "next/link";
import { getVehicles, getCities } from "@/lib/vehicles";
import { VehicleCard } from "@/components/catalog/VehicleCard";

const GROUPS = [
  {
    group: "CAR",
    title: "Легковые авто",
    description: "Седаны, кроссоверы, минивэны для города и поездок",
  },
  {
    group: "SPECIAL",
    title: "Спецтехника и грузовики",
    description: "Экскаваторы, самосвалы, автокраны, погрузчики",
  },
] as const;

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
  const [vehicles, cities] = await Promise.all([getVehicles(), getCities()]);
  const featured = vehicles.slice(0, 6);

  return (
    <div>
      <section className="bg-brand-navy">
        <div className="mx-auto max-w-6xl px-4 py-16 text-white">
          <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Аренда легковых авто и спецтехники напрямую у владельцев
          </h1>
          <p className="mt-4 max-w-xl text-white/80">
            Смотрите свободные даты в календаре и бронируйте по часам — без предоплаты
            и лишних звонков.
          </p>

          <form
            action="/catalog"
            method="get"
            className="mt-8 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-[1fr_1fr_auto]"
          >
            <select
              name="group"
              defaultValue=""
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900"
            >
              <option value="">Любой транспорт</option>
              {GROUPS.map((g) => (
                <option key={g.group} value={g.group}>
                  {g.title}
                </option>
              ))}
            </select>
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

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {GROUPS.map((g) => (
            <Link
              key={g.group}
              href={`/catalog?group=${g.group}`}
              className="rounded-xl border border-black/10 bg-white p-6 transition hover:border-brand-blue hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-brand-navy">{g.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{g.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-navy">Популярный транспорт</h2>
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
        <h2 className="mb-6 text-xl font-bold text-brand-navy">Как это работает</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-black/10 bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue-light text-sm font-bold text-brand-blue">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-brand-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-start gap-4 rounded-xl bg-brand-blue-light p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">
              Есть свой транспорт для сдачи в аренду?
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Расскажите о нём нашей команде — мы разместим объявление в каталоге.
            </p>
          </div>
          <a
            href="tel:+74951234567"
            className="shrink-0 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
          >
            Позвонить: +7 495 123-45-67
          </a>
        </div>
      </section>
    </div>
  );
}
