"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getBuyerSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1, "Поставьте оценку").max(5, "Поставьте оценку"),
  text: z
    .string()
    .trim()
    .min(10, "Напишите хотя бы 10 символов")
    .max(1000, "Отзыв не должен быть длиннее 1000 символов"),
});

export type SubmitReviewResult = { success: true } | { success: false; error: string };

export async function submitReview(input: {
  bookingId: string;
  rating: number;
  text: string;
}): Promise<SubmitReviewResult> {
  const session = await getBuyerSession();
  if (!session) return { success: false, error: "Войдите в личный кабинет" };

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные" };
  }

  if (!(await checkRateLimit(`review:${session.buyerId}`, 10, 60 * 60 * 1000))) {
    return { success: false, error: "Слишком много попыток, попробуйте позже" };
  }

  const booking = await prisma.booking.findFirst({
    where: { id: parsed.data.bookingId, buyerId: session.buyerId },
    include: { review: { select: { id: true } }, buyer: { select: { name: true } } },
  });
  if (!booking) return { success: false, error: "Бронь не найдена" };
  if (booking.status !== "DONE") {
    return { success: false, error: "Отзыв можно оставить после завершения аренды" };
  }
  if (booking.review) return { success: false, error: "Вы уже оставили отзыв по этой брони" };

  const firstName = booking.buyer?.name?.trim().split(/\s+/)[0];

  try {
    await prisma.review.create({
      data: {
        bookingId: booking.id,
        vehicleId: booking.vehicleId,
        buyerId: session.buyerId,
        rating: parsed.data.rating,
        text: parsed.data.text,
        authorName: firstName ? firstName.slice(0, 40) : "Арендатор",
      },
    });
  } catch {
    // уникальный индекс по bookingId: параллельная отправка двух отзывов
    return { success: false, error: "Вы уже оставили отзыв по этой брони" };
  }

  revalidatePath("/account");
  return { success: true };
}
