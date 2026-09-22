import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateVehicle } from "@/lib/actions/admin-catalog";
import { VehicleForm } from "../VehicleForm";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [vehicle, categories, owners] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: [{ group: "asc" }, { sortOrder: "asc" }] }),
    prisma.owner.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!vehicle) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Редактировать транспорт</h1>
      <VehicleForm
        action={updateVehicle.bind(null, vehicle.id)}
        categories={categories}
        owners={owners}
        initial={{
          title: vehicle.title,
          description: vehicle.description,
          pricePerHour: vehicle.pricePerHour ? vehicle.pricePerHour.toString() : null,
          minHours: vehicle.minHours,
          city: vehicle.city,
          isActive: vehicle.isActive,
          categoryId: vehicle.categoryId,
          ownerId: vehicle.ownerId,
        }}
      />
    </div>
  );
}
