import { prisma } from "@/lib/prisma";
import { createVehicle } from "@/lib/actions/admin-catalog";
import { VehicleForm } from "../VehicleForm";

export default async function NewVehiclePage() {
  const [categories, owners] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ group: "asc" }, { sortOrder: "asc" }] }),
    prisma.owner.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Новый транспорт</h1>
      <VehicleForm action={createVehicle} categories={categories} owners={owners} />
    </div>
  );
}
