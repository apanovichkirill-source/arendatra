"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

function slugify(input: string) {
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "shch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return input
    .toLowerCase()
    .split("")
    .map((ch) => translit[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const ownerSchema = z.object({
  name: z.string().min(1, "Укажите название или имя"),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean(),
});

function parseOwnerForm(formData: FormData) {
  return ownerSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    city: formData.get("city") || undefined,
    address: formData.get("address") || undefined,
    isActive: formData.get("isActive") === "on",
  });
}

export async function createOwner(formData: FormData) {
  await requireAdmin();
  const data = parseOwnerForm(formData);
  await prisma.owner.create({ data });
  revalidatePath("/admin/owners");
  redirect("/admin/owners");
}

export async function updateOwner(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseOwnerForm(formData);
  await prisma.owner.update({ where: { id }, data });
  revalidatePath("/admin/owners");
  redirect("/admin/owners");
}

export async function deleteOwner(id: string) {
  await requireAdmin();
  await prisma.owner.delete({ where: { id } });
  revalidatePath("/admin/owners");
}

const vehicleSchema = z.object({
  title: z.string().min(1, "Укажите название"),
  description: z.string().optional(),
  pricePerHour: z.number().nullable(),
  minHours: z.number().int().positive(),
  city: z.string().optional(),
  isActive: z.boolean(),
  categoryId: z.string().min(1, "Выберите категорию"),
  ownerId: z.string().min(1, "Выберите владельца"),
});

function parseVehicleForm(formData: FormData) {
  const priceRaw = formData.get("pricePerHour");
  const minHoursRaw = formData.get("minHours");
  return vehicleSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    pricePerHour: priceRaw ? Number(priceRaw) : null,
    minHours: minHoursRaw ? Number(minHoursRaw) : 1,
    city: formData.get("city") || undefined,
    isActive: formData.get("isActive") === "on",
    categoryId: formData.get("categoryId"),
    ownerId: formData.get("ownerId"),
  });
}

export async function createVehicle(formData: FormData) {
  await requireAdmin();
  const data = parseVehicleForm(formData);
  const baseSlug = slugify(data.title) || "transport";
  let slug = baseSlug;
  let i = 1;
  while (await prisma.vehicle.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }
  await prisma.vehicle.create({ data: { ...data, slug } });
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}

export async function updateVehicle(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseVehicleForm(formData);
  await prisma.vehicle.update({ where: { id }, data });
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}

export async function deleteVehicle(id: string) {
  await requireAdmin();
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/admin/vehicles");
}

const BOOKING_STATUSES = ["NEW", "CONFIRMED", "DONE", "CANCELED"] as const;

export async function updateBookingStatus(id: string, status: string) {
  await requireAdmin();
  if (!BOOKING_STATUSES.includes(status as (typeof BOOKING_STATUSES)[number])) return;
  await prisma.booking.update({
    where: { id },
    data: { status: status as (typeof BOOKING_STATUSES)[number] },
  });
  revalidatePath("/admin/bookings");
}
