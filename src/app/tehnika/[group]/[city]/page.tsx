import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildGroupPage } from "@/lib/seo-pages";
import { SeoLanding } from "@/components/landing/SeoLanding";

type Props = { params: Promise<{ group: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group, city } = await params;
  const page = await buildGroupPage(group, city);
  if (!page) return { title: "Страница не найдена", robots: { index: false } };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description },
  };
}

export default async function GroupCityPage({ params }: Props) {
  const { group, city } = await params;
  const page = await buildGroupPage(group, city);
  if (!page) notFound();
  return <SeoLanding page={page} />;
}
