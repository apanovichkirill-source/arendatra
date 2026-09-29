"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getBuyerSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { nearestCity } from "@/lib/geo";

const locationSchema = z.object({
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
});

// ~11 м точности — достаточно для работы, лишней детализации не храним
const round4 = (n: number) => Math.round(n * 10000) / 10000;

export async function saveBuyerLocation(input: { lat: number; lng: number }) {
  const session = await getBuyerSession();
  if (!session) return { success: false as const };

  const parsed = locationSchema.safeParse(input);
  if (!parsed.success) return { success: false as const };

  if (!(await checkRateLimit(`geo:${session.buyerId}`, 30, 60 * 60 * 1000))) {
    return { success: false as const };
  }

  const lat = round4(parsed.data.lat);
  const lng = round4(parsed.data.lng);

  await prisma.buyer.update({
    where: { id: session.buyerId },
    data: {
      lastLat: lat,
      lastLng: lng,
      lastGeoCity: nearestCity(lat, lng),
      lastGeoAt: new Date(),
    },
  });

  return { success: true as const };
}
