import { ARTICLES_BATCH_1 } from "@/content/articles-1";
import { ARTICLES_BATCH_2 } from "@/content/articles-2";
import { ARTICLES_BATCH_3 } from "@/content/articles-3";
import { ARTICLES_BATCH_4 } from "@/content/articles-4";
import { ARTICLES_BATCH_5 } from "@/content/articles-5";
import { ARTICLES_BATCH_6 } from "@/content/articles-6";

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  // дата публикации (по Москве) — статья появляется на сайте сама в этот день
  publishedAt: string;
  topic: string;
  // ключ фото из пула иллюстраций техники (например, "avtokran-"), если у статьи нет своей картинки
  photoKey?: string;
  // показывать блок со ссылкой на второй сайт
  partner?: boolean;
  body: ArticleBlock[];
  related: { label: string; href: string }[];
};

const ALL: Article[] = [...ARTICLES_BATCH_1, ...ARTICLES_BATCH_2, ...ARTICLES_BATCH_3, ...ARTICLES_BATCH_4, ...ARTICLES_BATCH_5, ...ARTICLES_BATCH_6];

function todayMoscow() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(new Date());
}

export function getPublishedArticles(): Article[] {
  const today = todayMoscow();
  return ALL.filter((a) => a.publishedAt <= today).sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
}

export function getArticle(slug: string): Article | null {
  return getPublishedArticles().find((a) => a.slug === slug) ?? null;
}

export function formatArticleDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00+03:00`)
  );
}

export function readingMinutes(a: Article) {
  const words = a.body
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}
