import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { landingPath } from "@/lib/landing";
import { allSeoPaths } from "@/lib/seo-pages";
import { CATEGORY_LANDING } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, owners] = await Promise.all([
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
    ...Object.keys(CATEGORY_LANDING).map((slug) => ({
      url: `${SITE_URL}${landingPath(slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...allSeoPaths().map((p) => ({
      url: `${SITE_URL}${p.path}`,
      changeFrequency: "weekly" as const,
      priority: p.priority,
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
