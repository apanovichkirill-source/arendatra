import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildCategoryIntentPage } from "@/lib/seo-pages";
import { SeoLanding } from "@/components/landing/SeoLanding";

type Props = { params: Promise<{ category: string; city: string; intent: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, city, intent } = await params;
  const page = await buildCategoryIntentPage(category, city, intent);
  if (!page) return { title: "Страница не найдена", robots: { index: false } };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description },
    robots: page.indexable ? undefined : { index: false, follow: true },
  };
}

export default async function CategoryIntentPage({ params }: Props) {
  const { category, city, intent } = await params;
  const page = await buildCategoryIntentPage(category, city, intent);
  if (!page) notFound();
  return <SeoLanding page={page} />;
}
