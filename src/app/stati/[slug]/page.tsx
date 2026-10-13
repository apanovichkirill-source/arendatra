import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SITE_URL } from "@/lib/site";
import { ARTICLE_IMAGES } from "@/content/article-images";
import { vehiclePhoto } from "@/content/vehicle-photos";
import { PartnerBlock } from "@/components/PartnerBlock";
import { CATEGORY_SEO } from "@/lib/seo";
import { landingPath } from "@/lib/landing";
import {
  type Article,
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
  const image = articleImage(a);
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/stati/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      publishedTime: `${a.publishedAt}T09:00:00+03:00`,
      section: a.topic,
      ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}),
    },
  };
}

function articleImage(a: Article) {
  return ARTICLE_IMAGES[a.slug] ?? (a.photoKey ? vehiclePhoto(`${a.photoKey}-${a.slug}`) : null);
}

// photoKey статьи → страница аренды этой техники (перелинковка статья → посадочная)
const LANDING_BY_PHOTO_KEY: Record<string, string> = {
  "avtokran-": "avtokran-25t",
  "avtovyshka-": "avtovyshka-agp",
  buldozer: "buldozer",
  "gusenichnyy-ekskavator": "gusenichnyy-ekskavator",
  "vahtovyy-avtobus": "vahtovyy-avtobus",
  "legkovye-ts": "legkovye-ts",
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const nonce = (await headers()).get("x-nonce") || undefined;
  const image = articleImage(a);
  const ownPhoto = !!image && "own" in image && image.own;
  const landingSlug = a.photoKey ? LANDING_BY_PHOTO_KEY[a.photoKey] : undefined;
  const landing = landingSlug && CATEGORY_SEO[landingSlug]
    ? { href: landingPath(landingSlug), title: CATEGORY_SEO[landingSlug].title }
    : null;
  // сначала статьи той же темы, затем остальные свежие
  const others = getPublishedArticles().filter((x) => x.slug !== a.slug);
  const more = [
    ...others.filter((x) => x.topic === a.topic),
    ...others.filter((x) => x.topic !== a.topic),
  ].slice(0, 5);

  const url = `${SITE_URL}/stati/${a.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      datePublished: `${a.publishedAt}T09:00:00+03:00`,
      dateModified: `${a.publishedAt}T09:00:00+03:00`,
      ...(image ? { image: { "@type": "ImageObject", url: `${SITE_URL}${image.src}` } } : {}),
      articleSection: a.topic,
      inLanguage: "ru-RU",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Арендатра", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "Арендатра",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-icon.png` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Статьи", item: `${SITE_URL}/stati` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
  ];

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
        {image && (
          <figure className="mb-6">
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={900}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full rounded-2xl object-cover"
            />
            {ownPhoto ? (
              <figcaption className="mt-2 text-xs text-gray-400">Техника из нашего парка.</figcaption>
            ) : (
            <figcaption className="mt-2 text-xs text-gray-400">
              Иллюстративное фото. Автор: {image.author}, {image.license}
              {image.licenseUrl && (
                <>
                  {" "}
                  (<a href={image.licenseUrl} rel="noopener noreferrer" target="_blank" className="underline">лицензия</a>)
                </>
              )}
              . Источник:{" "}
              <a href={image.source} rel="noopener noreferrer" target="_blank" className="underline">
                Wikimedia Commons
              </a>
              .
            </figcaption>
            )}
          </figure>
        )}
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

        {a.partner && <PartnerBlock className="mt-10" />}

        <div className="mt-10 rounded-2xl bg-brand-navy p-6 text-white">
          <p className="text-lg font-bold">Нужна техника под вашу задачу?</p>
          <p className="mt-1 text-sm text-white/70">
            Выберите машину в каталоге, отметьте даты и отправьте заявку: предоплата не нужна.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {landing && (
              <Link
                href={landing.href}
                className="inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
              >
                {landing.title} — цены и техника
              </Link>
            )}
            <Link
              href="/catalog"
              className={
                landing
                  ? "inline-block rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  : "inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
              }
            >
              Весь каталог техники
            </Link>
          </div>
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
            <h2 className="mb-3 text-lg font-bold text-brand-navy">Читайте также</h2>
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
