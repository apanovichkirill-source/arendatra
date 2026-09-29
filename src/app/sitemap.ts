import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { getLandingCombos, landingPath } from "@/lib/landing";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [combos, vehicles, owners] = await Promise.all([
    getLandingCombos(),
    prisma.vehicle.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.owner.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "daily", priority: 0.9 },
    ...[...new Set(combos.map((c) => c.categorySlug))].map((slug) => ({
      url: `${SITE_URL}${landingPath(slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...combos.map((c) => ({
      url: `${SITE_URL}${landingPath(c.categorySlug, c.city)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...vehicles.map((v) => ({
      url: `${SITE_URL}/vehicle/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...owners.map((o) => ({
      url: `${SITE_URL}/owner/${o.id}`,
      lastModified: o.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
