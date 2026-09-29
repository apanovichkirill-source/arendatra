import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SERVICE_CITIES } from "@/lib/cities";
import type { CategoryGroup, Prisma } from "@prisma/client";

const ACTIVE_BOOKING_STATUSES = ["NEW", "CONFIRMED"] as const;

// категории меняются только вручную в базе, поэтому кэшируем надолго
export const getCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
    }),
  ["categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export type VehicleFilters = {
  group?: CategoryGroup;
  categorySlug?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  startAt?: Date;
  endAt?: Date;
};

async function queryVehicles(filters: VehicleFilters) {
  const where: Prisma.VehicleWhereInput = {
    isActive: true,
  };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  } else if (filters.group) {
    where.category = { group: filters.group };
  }

  if (filters.city) {
    where.city = filters.city;
  }

  if (filters.minPrice || filters.maxPrice) {
    where.pricePerHour = {};
    if (filters.minPrice) where.pricePerHour.gte = filters.minPrice;
    if (filters.maxPrice) where.pricePerHour.lte = filters.maxPrice;
  }

  if (filters.query) {
    const q = filters.query.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (filters.startAt && filters.endAt) {
    where.bookings = {
      none: {
        status: { in: [...ACTIVE_BOOKING_STATUSES] },
        AND: [{ startAt: { lt: filters.endAt } }, { endAt: { gt: filters.startAt } }],
      },
    };
  }

  return prisma.vehicle.findMany({
    where,
    include: { category: true, owner: true },
    orderBy: { createdAt: "desc" },
  });
}

// Список без фильтра по датам не зависит от броней — кэшируем между запросами.
// Сброс: revalidateTag("vehicles") в админских действиях + страховочные 10 минут.
export async function getVehicles(filters: VehicleFilters = {}) {
  if (filters.startAt || filters.endAt) return queryVehicles(filters);
  return unstable_cache(() => queryVehicles(filters), ["vehicles-list", JSON.stringify(filters)], {
    revalidate: 600,
    tags: ["vehicles"],
  })();
}

// cache(): в рамках одного рендера страница и generateMetadata
// используют один и тот же запрос вместо двух одинаковых
export const getVehicleBySlug = cache((slug: string) =>
  unstable_cache(
    () =>
      prisma.vehicle.findUnique({
        where: { slug },
        include: { category: true, owner: true },
      }),
    ["vehicle-by-slug", slug],
    { revalidate: 600, tags: ["vehicles"] }
  )()
);

export const getOwnerWithVehicles = cache(async (id: string) => {
  return prisma.owner.findUnique({
    where: { id },
    include: { vehicles: { where: { isActive: true }, include: { category: true } } },
  });
});

// Города обслуживания фиксированы (зона покрытия компании), а не выводятся
// из текущего парка — так на сайте всегда виден весь регион присутствия.
export async function getCities(): Promise<string[]> {
  return [...SERVICE_CITIES];
}

// брони, которые перекрываются с ближайшими днями — для отображения занятости в календаре
export async function getUpcomingBookings(vehicleId: string) {
  return prisma.booking.findMany({
    where: {
      vehicleId,
      status: { in: [...ACTIVE_BOOKING_STATUSES] },
      endAt: { gte: new Date() },
    },
    select: { startAt: true, endAt: true },
    orderBy: { startAt: "asc" },
  });
}

export async function hasOverlappingBooking(vehicleId: string, startAt: Date, endAt: Date) {
  const overlap = await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: { in: [...ACTIVE_BOOKING_STATUSES] },
      AND: [{ startAt: { lt: endAt } }, { endAt: { gt: startAt } }],
    },
  });
  return overlap !== null;
}
