import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CITY_INFO, SERVICE_CITIES } from "@/lib/cities";
import { CATEGORY_LANDING, CATEGORY_SEO } from "@/lib/seo";
import { CATEGORY_INTENTS, GROUP_PAGES, INTENTS } from "@/lib/seo-pages";
import { getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Карта сайта: аренда спецтехники в Коми и НАО по городам и видам техники",
  description:
    "Все разделы Арендатры: аренда автокранов, автовышек, экскаваторов, бульдозеров, вахтовых автобусов и легковых авто по городам Республики Коми и НАО, статьи и контакты.",
  alternates: { canonical: "/karta-sayta" },
};

const chip =
  "rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue";

export default function SiteMapPage() {
  const cats = Object.keys(CATEGORY_LANDING);
  const articles = getPublishedArticles();
  return (
    <>
      <PageHero title="Карта сайта" eyebrow="Арендатра" compact />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        <section>
          <h2 className="mb-3 text-xl font-bold text-brand-navy">Спецтехника по городам</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/spetstehnika" className={chip}>Весь регион</Link>
            {SERVICE_CITIES.map((c) => (
              <Link key={c} href={`/spetstehnika/${CITY_INFO[c].slug}`} className={chip}>
                Аренда спецтехники {CITY_INFO[c].in}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-brand-navy">Виды техники</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(GROUP_PAGES).map(([slug, g]) => (
              <Link key={slug} href={`/tehnika/${slug}`} className={chip}>{g.name}</Link>
            ))}
            {cats.map((slug) => (
              <Link key={slug} href={`/arenda/${slug}`} className={chip}>{CATEGORY_SEO[slug]?.title ?? slug}</Link>
            ))}
          </div>
        </section>

        {cats.map((slug) => (
          <section key={slug}>
            <h2 className="mb-3 text-lg font-bold text-brand-navy">{CATEGORY_SEO[slug]?.title ?? slug} по городам</h2>
            <div className="flex flex-wrap gap-2">
              {SERVICE_CITIES.map((c) => (
                <Link key={c} href={`/arenda/${slug}/${CITY_INFO[c].slug}`} className={chip}>{c}</Link>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-3 text-lg font-bold text-brand-navy">Что ещё ищут</h2>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CITIES.flatMap((c) =>
              Object.entries(INTENTS).map(([k, i]) => (
                <Link key={`${c}-${k}`} href={`/spetstehnika/${CITY_INFO[c].slug}/${k}`} className={chip}>
                  {i.label} {CITY_INFO[c].in}
                </Link>
              ))
            ).slice(0, 80)}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-brand-navy">Цены и сроки по видам техники</h2>
          <div className="flex flex-wrap gap-2">
            {cats.flatMap((slug) =>
              Object.entries(CATEGORY_INTENTS).map(([k, i]) => (
                <Link key={`${slug}-${k}`} href={`/arenda/${slug}/usinsk/${k}`} className={chip}>
                  {i.link(CATEGORY_LANDING[slug].genitive, CITY_INFO.Усинск.in)}
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-brand-navy">Статьи</h2>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/stati/${a.slug}`} className="text-brand-blue hover:underline">{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-brand-navy">О сервисе</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/catalog" className={chip}>Каталог</Link>
            <Link href="/o-nas" className={chip}>О сервисе</Link>
            <Link href="/kontakty" className={chip}>Контакты</Link>
            <Link href="/stati" className={chip}>Статьи</Link>
            <Link href="/privacy" className={chip}>Политика конфиденциальности</Link>
          </div>
        </section>
      </div>
    </>
  );
}
