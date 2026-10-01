import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { formatArticleDate, getPublishedArticles, readingMinutes } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Статьи об аренде спецтехники — советы заказчикам",
  description:
    "Практические статьи об аренде автокранов, автовышек, экскаваторов, бульдозеров и вахтовых автобусов в Республике Коми и НАО: как выбрать технику, рассчитать стоимость и подготовить объект.",
  alternates: { canonical: "/stati" },
};

export default function ArticlesPage() {
  const articles = getPublishedArticles();
  return (
    <>
      <PageHero title="Статьи об аренде спецтехники" eyebrow="Блог">
        <p className="mt-3 max-w-2xl text-white/70">
          Как выбрать технику, рассчитать стоимость и подготовить объект — практические советы для
          заказчиков в Республике Коми и НАО.
        </p>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/stati/${a.slug}`}
              className="group flex flex-col rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-lg hover:shadow-brand-blue/10"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
                {a.topic}
              </span>
              <h2 className="mt-2 text-lg font-bold text-brand-navy group-hover:text-brand-blue">
                {a.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-gray-600">{a.description}</p>
              <p className="mt-4 text-xs text-gray-400">
                {formatArticleDate(a.publishedAt)} · {readingMinutes(a)} мин чтения
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
