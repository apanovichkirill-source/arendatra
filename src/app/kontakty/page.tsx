import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CallbackForm } from "@/components/CallbackForm";
import { CITY_INFO, SERVICE_CITIES } from "@/lib/cities";
import { ADDRESS, MESSENGER, PHONES, WORK_HOURS } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Контакты — аренда спецтехники в Коми и НАО",
  description: `Телефоны менеджера ${PHONES.map((p) => p.display).join(", ")}, ${WORK_HOURS}. База: ${ADDRESS.short}. Заявки на сайте принимаются круглосуточно. Работаем в Республике Коми и НАО.`,
  alternates: { canonical: "/kontakty" },
};

export default function ContactsPage() {
  return (
    <>
      <PageHero title="Контакты" eyebrow="Арендатра">
        <p className="mt-3 max-w-2xl text-white/70">
          Менеджер поможет подобрать технику, посчитает стоимость и подтвердит бронь.
        </p>
      </PageHero>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-lg font-bold text-brand-navy">Телефоны менеджера</h2>
            <ul className="mt-3 space-y-2">
              {PHONES.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="text-2xl font-extrabold text-brand-blue hover:underline">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gray-600">Звонки принимаем {WORK_HOURS} (по московскому времени).</p>
          </section>
          <section className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-lg font-bold text-brand-navy">Написать нам</h2>
            <p className="mt-3 text-gray-700">
              Написать можно в мессенджере <strong>{MESSENGER}</strong>: найдите нас по номеру
              телефона.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Электронной почты у нас нет: заявку на технику проще всего оставить на сайте, она
              приходит менеджеру сразу.
            </p>
            <Link
              href="/catalog"
              className="mt-4 inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
            >
              Выбрать технику и оставить заявку
            </Link>
          </section>
        </div>

        <section id="callback" className="mt-4 scroll-mt-24 rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-bold text-brand-navy">Перезвоним сами</h2>
          <p className="mt-1 mb-4 text-sm text-gray-600">
            Оставьте номер — менеджер перезвонит {WORK_HOURS} и подберёт технику под задачу.
          </p>
          <CallbackForm />
        </section>

        <section className="mt-4 rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-bold text-brand-navy">Адрес базы</h2>
          <p className="mt-2 text-gray-700">{ADDRESS.full}</p>
          <p className="mt-2 text-sm text-gray-600">
            Отсюда техника выходит на объекты Усинского района, промыслы и площадки по всей
            Республике Коми и НАО. Перед приездом позвоните менеджеру.
          </p>
          <a
            href={`https://yandex.ru/maps/?text=${encodeURIComponent(ADDRESS.full)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline"
          >
            Открыть на Яндекс Картах
          </a>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-brand-navy">Условия работы</h2>
          <ul className="list-inside list-disc space-y-1 text-gray-700">
            <li>Заявки на сайте принимаются круглосуточно, менеджер отвечает {WORK_HOURS}</li>
            <li>Работаем по договору</li>
            <li>Оплата наличным и безналичным расчётом</li>
            <li>Вся техника с документами, работает обученный персонал</li>
            <li>Предоплата при бронировании на сайте не требуется</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-brand-navy">Где мы работаем</h2>
          <p className="mb-3 text-gray-700">
            Республика Коми и Ненецкий автономный округ. Подберём технику в вашем городе:
          </p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CITIES.map((c) => (
              <Link
                key={c}
                href={`/spetstehnika/${CITY_INFO[c].slug}`}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
              >
                {c}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
