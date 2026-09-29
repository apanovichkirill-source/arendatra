"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-access";
import { logAudit } from "@/lib/audit";

async function findReview(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: { vehicle: { select: { title: true, slug: true } } },
  });
}

export async function moderateReview(id: string, decision: "APPROVED" | "REJECTED") {
  const admin = await requirePermission("reviews.edit");
  if (decision !== "APPROVED" && decision !== "REJECTED") return;
  const review = await findReview(id);
  if (!review) return;

  await prisma.review.update({
    where: { id },
    data: { status: decision, moderatedAt: new Date() },
  });
  await logAudit(admin, decision === "APPROVED" ? "review.approve" : "review.reject", {
    entityType: "review",
    entityId: id,
    details: `${review.vehicle.title}, оценка ${review.rating}`,
  });
  revalidatePath("/admin/reviews");
  revalidatePath(`/vehicle/${review.vehicle.slug}`);
}

export async function deleteReview(id: string) {
  const admin = await requirePermission("reviews.edit");
  const review = await findReview(id);
  if (!review) return;

  await prisma.review.delete({ where: { id } });
  await logAudit(admin, "review.delete", {
    entityType: "review",
    entityId: id,
    details: `${review.vehicle.title}, оценка ${review.rating}`,
  });
  revalidatePath("/admin/reviews");
  revalidatePath(`/vehicle/${review.vehicle.slug}`);
}
