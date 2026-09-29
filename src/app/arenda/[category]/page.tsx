import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingData, landingMeta, landingPath } from "@/lib/landing";
import { LandingPage } from "@/components/landing/LandingPage";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const data = await getLandingData(category);
  if (!data) return { title: "Страница не найдена", robots: { index: false } };
  const { title, description, indexable } = landingMeta(data);
  return {
    title,
    description,
    alternates: { canonical: landingPath(category) },
    openGraph: { title, description },
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function CategoryLandingPage({ params }: Props) {
  const { category } = await params;
  const data = await getLandingData(category);
  if (!data) notFound();
  return <LandingPage data={data} />;
}
