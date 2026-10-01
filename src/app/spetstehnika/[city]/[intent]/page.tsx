import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildIntentPage } from "@/lib/seo-pages";
import { SeoLanding } from "@/components/landing/SeoLanding";

type Props = { params: Promise<{ city: string; intent: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, intent } = await params;
  const page = await buildIntentPage(city, intent);
  if (!page) return { title: "Страница не найдена", robots: { index: false } };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description },
  };
}

export default async function SpecIntentPage({ params }: Props) {
  const { city, intent } = await params;
  const page = await buildIntentPage(city, intent);
  if (!page) notFound();
  return <SeoLanding page={page} />;
}
