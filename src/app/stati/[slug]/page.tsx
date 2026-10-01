import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SITE_URL } from "@/lib/site";
import {
  formatArticleDate,
  getArticle,
  getPublishedArticles,
  readingMinutes,
} from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Статья не найдена", robots: { index: false } };
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/stati/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.description },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const nonce = (await headers()).get("x-nonce") || undefined;
  const more = getPublishedArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.publishedAt,
    dateModified: a.publishedAt,
    inLanguage: "ru-RU",
    mainEntityOfPage: `${SITE_URL}/stati/${a.slug}`,
    author: { "@type": "Organization", name: "Арендатра" },
    publisher: { "@type": "Organization", name: "Арендатра", url: SITE_URL },
  };

  return (
    <>
      <PageHero title={a.title} eyebrow={a.topic}>
        <p className="mt-3 text-sm text-white/60">
          <Link href="/stati" className="hover:text-white">
            Статьи
          </Link>{" "}
          · {formatArticleDate(a.publishedAt)} · {readingMinutes(a)} мин чтения
        </p>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-8">
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="space-y-4 text-gray-700">
          {a.body.map((b, i) => {
            if (b.type === "h2")
              return (
                <h2 key={i} className="pt-4 text-xl font-bold text-brand-navy">
                  {b.text}
                </h2>
              );
            if (b.type === "p") return <p key={i}>{b.text}</p>;
            if (b.type === "ul")
              return (
                <ul key={i} className="list-inside list-disc space-y-1">
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            if (b.type === "ol")
              return (
                <ol key={i} className="list-inside list-decimal space-y-1">
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              );
            return (
              <p key={i} className="rounded-xl border-l-4 border-brand-orange bg-brand-orange/5 p-4 text-sm">
                <strong className="text-brand-navy">Совет. </strong>
                {b.text}
              </p>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-navy p-6 text-white">
          <p className="text-lg font-bold">Нужна техника под вашу задачу?</p>
          <p className="mt-1 text-sm text-white/70">
            Выберите машину в каталоге, отметьте даты и отправьте заявку: предоплата не нужна.
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
          >
            Открыть каталог
          </Link>
        </div>

        {a.related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-bold text-brand-navy">Смотрите также</h2>
            <div className="flex flex-wrap gap-2">
              {a.related.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {more.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-bold text-brand-navy">Другие статьи</h2>
            <ul className="space-y-2">
              {more.map((m) => (
                <li key={m.slug}>
                  <Link href={`/stati/${m.slug}`} className="text-brand-blue hover:underline">
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
