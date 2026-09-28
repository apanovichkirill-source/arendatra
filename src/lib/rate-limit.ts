import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Берём первый адрес из x-forwarded-for (его выставляет Vercel/прокси).
// В локальной разработке заголовка может не быть — тогда лимит не применяется по IP.
export async function getClientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Простой лимитер на скользящее окно, хранится в БД (переживает холодный старт
 * serverless-функций, в отличие от счётчика в памяти процесса).
 * Возвращает true, если запрос разрешён.
 */
export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();

  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return true;
}
