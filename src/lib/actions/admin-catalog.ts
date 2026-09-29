"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-access";
import { changedFields, logAudit } from "@/lib/audit";
import { BOOKING_STATUS_LABELS } from "@/lib/format";

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

const OWNER_FIELDS = ["name", "description", "phone", "email", "city", "address", "isActive"];
const OWNER_FIELD_LABELS: Record<string, string> = {
  name: "название",
  description: "описание",
  phone: "телефон",
  email: "email",
  city: "город",
  address: "адрес",
  isActive: "активность",
};

export async function createOwner(formData: FormData) {
  const admin = await requirePermission("owners.edit");
  const data = parseOwnerForm(formData);
  const owner = await prisma.owner.create({ data });
  await logAudit(admin, "owner.create", {
    entityType: "owner",
    entityId: owner.id,
    details: owner.name,
  });
  revalidatePath("/admin/owners");
  redirect("/admin/owners");
}

export async function updateOwner(id: string, formData: FormData) {
  const admin = await requirePermission("owners.edit");
  const data = parseOwnerForm(formData);
  const before = await prisma.owner.findUnique({ where: { id } });
  await prisma.owner.update({ where: { id }, data });
  const changed = before ? changedFields(before, data, OWNER_FIELDS) : [];
  await logAudit(admin, "owner.update", {
    entityType: "owner",
    entityId: id,
    details: `${data.name}${
      changed.length ? ` — изменено: ${changed.map((k) => OWNER_FIELD_LABELS[k]).join(", ")}` : ""
    }`,
  });
  revalidatePath("/admin/owners");
  redirect("/admin/owners");
}

export async function deleteOwner(id: string) {
  const admin = await requirePermission("owners.edit");
  const before = await prisma.owner.findUnique({ where: { id } });
  await prisma.owner.delete({ where: { id } });
  await logAudit(admin, "owner.delete", {
    entityType: "owner",
    entityId: id,
    details: before?.name,
  });
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

const VEHICLE_FIELDS = [
  "title",
  "description",
  "pricePerHour",
  "minHours",
  "city",
  "isActive",
  "categoryId",
  "ownerId",
];
const VEHICLE_FIELD_LABELS: Record<string, string> = {
  title: "название",
  description: "описание",
  pricePerHour: "цена",
  minHours: "мин. часов",
  city: "город",
  isActive: "активность",
  categoryId: "категория",
  ownerId: "владелец",
};

export async function createVehicle(formData: FormData) {
  const admin = await requirePermission("vehicles.edit");
  const data = parseVehicleForm(formData);
  const baseSlug = slugify(data.title) || "transport";
  let slug = baseSlug;
  let i = 1;
  while (await prisma.vehicle.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }
  const vehicle = await prisma.vehicle.create({ data: { ...data, slug } });
  await logAudit(admin, "vehicle.create", {
    entityType: "vehicle",
    entityId: vehicle.id,
    details: vehicle.title,
  });
  revalidatePath("/admin/vehicles");
  revalidateTag("vehicles", { expire: 0 });
  redirect("/admin/vehicles");
}

export async function updateVehicle(id: string, formData: FormData) {
  const admin = await requirePermission("vehicles.edit");
  const data = parseVehicleForm(formData);
  const before = await prisma.vehicle.findUnique({ where: { id } });
  await prisma.vehicle.update({ where: { id }, data });
  const changed = before ? changedFields(before, data, VEHICLE_FIELDS) : [];
  await logAudit(admin, "vehicle.update", {
    entityType: "vehicle",
    entityId: id,
    details: `${data.title}${
      changed.length ? ` — изменено: ${changed.map((k) => VEHICLE_FIELD_LABELS[k]).join(", ")}` : ""
    }`,
  });
  revalidatePath("/admin/vehicles");
  revalidateTag("vehicles", { expire: 0 });
  redirect("/admin/vehicles");
}

export async function deleteVehicle(id: string) {
  const admin = await requirePermission("vehicles.edit");
  const before = await prisma.vehicle.findUnique({ where: { id } });
  await prisma.vehicle.delete({ where: { id } });
  await logAudit(admin, "vehicle.delete", {
    entityType: "vehicle",
    entityId: id,
    details: before?.title,
  });
  revalidatePath("/admin/vehicles");
  revalidateTag("vehicles", { expire: 0 });
}

const BOOKING_STATUSES = ["NEW", "CONFIRMED", "DONE", "CANCELED"] as const;

export async function updateBookingStatus(id: string, status: string) {
  const admin = await requirePermission("bookings.edit");
  if (!BOOKING_STATUSES.includes(status as (typeof BOOKING_STATUSES)[number])) return;
  const before = await prisma.booking.findUnique({
    where: { id },
    include: { vehicle: { select: { title: true } } },
  });
  if (!before) return;
  await prisma.booking.update({
    where: { id },
    data: { status: status as (typeof BOOKING_STATUSES)[number] },
  });
  await logAudit(admin, "booking.status", {
    entityType: "booking",
    entityId: id,
    details: `${before.vehicle.title}: ${BOOKING_STATUS_LABELS[before.status]} → ${BOOKING_STATUS_LABELS[status]}`,
  });
  revalidatePath("/admin/bookings");
}
