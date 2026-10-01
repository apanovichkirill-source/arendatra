import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildSpecPage } from "@/lib/seo-pages";
import { SeoLanding } from "@/components/landing/SeoLanding";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const page = await buildSpecPage(city);
  if (!page) return { title: "Страница не найдена", robots: { index: false } };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description },
  };
}

export default async function SpecCityPage({ params }: Props) {
  const { city } = await params;
  const page = await buildSpecPage(city);
  if (!page) notFound();
  return <SeoLanding page={page} />;
}
