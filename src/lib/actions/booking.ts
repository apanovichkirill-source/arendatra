"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getBuyerSession } from "@/lib/session";
import { normalizePhone } from "@/lib/format";
import { hasOverlappingBooking } from "@/lib/vehicles";

const MIN_BOOKING_HOURS = 1;
const MAX_BOOKING_HOURS = 24 * 30; // не длиннее месяца за одну бронь

const bookingSchema = z
  .object({
    vehicleId: z.string(),
    startAt: z.string().min(1, "Укажите дату и время начала"),
    endAt: z.string().min(1, "Укажите дату и время окончания"),
    contactName: z.string().optional(),
    contactPhone: z.string().min(5, "Укажите номер телефона"),
    comment: z.string().optional(),
  })
  .refine((data) => !Number.isNaN(Date.parse(data.startAt)), {
    message: "Некорректная дата начала",
    path: ["startAt"],
  })
  .refine((data) => !Number.isNaN(Date.parse(data.endAt)), {
    message: "Некорректная дата окончания",
    path: ["endAt"],
  });

export type CreateBookingInput = z.infer<typeof bookingSchema>;
export type CreateBookingResult =
  | { success: true; bookingId: string }
  | { success: false; error: string };

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные формы" };
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.data.vehicleId } });
  if (!vehicle || !vehicle.isActive) {
    return { success: false, error: "Этот транспорт больше недоступен" };
  }

  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(parsed.data.endAt);

  if (startAt.getTime() < Date.now() - 5 * 60 * 1000) {
    return { success: false, error: "Дата начала не может быть в прошлом" };
  }
  if (endAt.getTime() <= startAt.getTime()) {
    return { success: false, error: "Дата окончания должна быть позже даты начала" };
  }

  const hours = Math.round((endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60));
  if (hours < Math.max(MIN_BOOKING_HOURS, vehicle.minHours)) {
    return {
      success: false,
      error: `Минимальный срок аренды — ${Math.max(MIN_BOOKING_HOURS, vehicle.minHours)} ч.`,
    };
  }
  if (hours > MAX_BOOKING_HOURS) {
    return { success: false, error: "Слишком длинный срок аренды, свяжитесь с нами напрямую" };
  }

  const overlapping = await hasOverlappingBooking(vehicle.id, startAt, endAt);
  if (overlapping) {
    return { success: false, error: "На выбранные даты транспорт уже забронирован" };
  }

  const session = await getBuyerSession();
  const totalPrice = vehicle.pricePerHour ? Number(vehicle.pricePerHour) * hours : null;

  const booking = await prisma.booking.create({
    data: {
      vehicleId: vehicle.id,
      startAt,
      endAt,
      totalPrice,
      contactName: parsed.data.contactName,
      contactPhone: normalizePhone(parsed.data.contactPhone),
      comment: parsed.data.comment,
      buyerId: session?.buyerId,
    },
  });

  return { success: true, bookingId: booking.id };
}
