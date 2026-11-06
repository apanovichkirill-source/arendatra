import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getVehicleReviews = cache(async (vehicleId: string) => {
  const [reviews, agg] = await Promise.all([
    prisma.review.findMany({
      where: { vehicleId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, rating: true, text: true, authorName: true, createdAt: true },
    }),
    prisma.review.aggregate({
      where: { vehicleId, status: "APPROVED" },
      _avg: { rating: true },
      _count: true,
    }),
  ]);
  return {
    reviews,
    count: agg._count,
    average: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
  };
});

// Последние опубликованные отзывы по всему парку — для главной
export const getLatestReviews = cache(async (take: number) => {
  const [reviews, agg] = await Promise.all([
    prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        rating: true,
        text: true,
        authorName: true,
        createdAt: true,
        vehicle: { select: { title: true, slug: true } },
      },
    }),
    prisma.review.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true },
      _count: true,
    }),
  ]);
  return {
    reviews,
    count: agg._count,
    average: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
  };
});
