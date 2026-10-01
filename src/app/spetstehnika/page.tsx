import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildSpecPage } from "@/lib/seo-pages";
import { SeoLanding } from "@/components/landing/SeoLanding";

export async function generateMetadata(): Promise<Metadata> {
  const page = await buildSpecPage();
  if (!page) return { title: "Страница не найдена", robots: { index: false } };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description },
  };
}

export default async function SpecRegionPage() {
  const page = await buildSpecPage();
  if (!page) notFound();
  return <SeoLanding page={page} />;
}
