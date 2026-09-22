import { prisma } from "@/lib/prisma";
import type { CategoryGroup, Prisma } from "@prisma/client";

const ACTIVE_BOOKING_STATUSES = ["NEW", "CONFIRMED"] as const;

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
  });
}

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

export async function getVehicles(filters: VehicleFilters = {}) {
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
    where.title = { contains: filters.query, mode: "insensitive" };
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

export async function getVehicleBySlug(slug: string) {
  return prisma.vehicle.findUnique({
    where: { slug },
    include: { category: true, owner: true },
  });
}

export async function getOwnerWithVehicles(id: string) {
  return prisma.owner.findUnique({
    where: { id },
    include: { vehicles: { where: { isActive: true }, include: { category: true } } },
  });
}

export async function getCities() {
  const rows = await prisma.vehicle.findMany({
    where: { isActive: true, city: { not: null } },
    distinct: ["city"],
    select: { city: true },
  });
  return rows.map((r) => r.city!).filter(Boolean).sort();
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
