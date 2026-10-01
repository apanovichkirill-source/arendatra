import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CLIENTS, PHONES, WORK_HOURS } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "О сервисе Арендатра — аренда спецтехники и транспорта в Коми и НАО",
  description:
    "Арендатра — сервис аренды спецтехники и транспорта в Республике Коми и НАО: быстрая работа менеджера, быстрая подача техники, вся техника с документами, оплата наличным и безналичным расчётом, работа по договору.",
  alternates: { canonical: "/o-nas" },
};

const ADVANTAGES = [
  ["Быстрая работа менеджера", "Заявка уходит менеджеру сразу, он перезванивает и подтверждает бронь."],
  ["Быстрая подача техники", "Подбираем машину в вашем или соседнем городе и согласуем подачу на объект."],
  ["Обученный персонал", "Техника работает с подготовленными операторами и водителями."],
  ["Вся техника с документами", "Машины оформлены, документы можно запросить до начала работ."],
  ["Наличный и безналичный расчёт", "Удобные для заказчика условия оплаты."],
  ["Работа по договору", "Оформляем сотрудничество договором: для разовых и регулярных заказов."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="О сервисе Арендатра" eyebrow="Коми · НАО">
        <p className="mt-3 max-w-2xl text-white/70">
          Сервис, который соединяет заказчиков с владельцами спецтехники и транспорта в Республике
          Коми и Ненецком автономном округе.
        </p>
      </PageHero>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="max-w-3xl space-y-3 text-gray-700">
          <p>
            В каталоге собраны автокраны, автовышки, гусеничные экскаваторы, бульдозеры, вахтовые
            автобусы и легковой транспорт. Вы выбираете машину, отмечаете свободные даты в
            календаре занятости и оставляете заявку: предоплата онлайн не нужна, менеджер
            подтверждает бронь по телефону.
          </p>
          <p>
            Мы работаем в Сыктывкаре, Ухте, Усинске, Печоре, Воркуте, Сосногорске, Кожве,
            Нарьян-Маре и Харьягинском. Тарифы почасовые, поэтому вы платите за то время, которое
            действительно нужно.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-brand-navy">Почему к нам обращаются</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ADVANTAGES.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="font-bold text-brand-navy">{t}</h3>
                <p className="mt-1 text-sm text-gray-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold text-brand-navy">С кем работаем</h2>
          <p className="mt-2 text-gray-700">
            Подаём технику и транспорт для заказчиков нефтегазовой отрасли региона, в том числе{" "}
            {CLIENTS.join(", ")}.
          </p>
        </section>

        <section className="mt-10 rounded-2xl bg-brand-navy p-6 text-white">
          <h2 className="text-xl font-bold">Свяжитесь с менеджером</h2>
          <p className="mt-1 text-sm text-white/70">Звонки {WORK_HOURS}, заявки на сайте круглосуточно.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {PHONES.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
              >
                {p.display}
              </a>
            ))}
            <Link
              href="/catalog"
              className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Открыть каталог
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
