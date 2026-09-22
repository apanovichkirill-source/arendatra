import { notFound } from "next/navigation";
import { getOwnerWithVehicles } from "@/lib/vehicles";
import { VehicleCard } from "@/components/catalog/VehicleCard";

export default async function OwnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const owner = await getOwnerWithVehicles(id);
  if (!owner || !owner.isActive) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-xl border border-black/10 bg-white p-6">
        <h1 className="text-2xl font-bold text-brand-navy">{owner.name}</h1>
        {owner.city && <p className="mt-1 text-gray-500">{owner.city}</p>}
        {owner.description && (
          <p className="mt-3 text-gray-700">{owner.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          {owner.phone && <span>Тел: {owner.phone}</span>}
          {owner.email && <span>Email: {owner.email}</span>}
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-xl font-bold text-brand-navy">
        Транспорт владельца ({owner.vehicles.length})
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {owner.vehicles.map((v) => (
          <VehicleCard
            key={v.id}
            slug={v.slug}
            title={v.title}
            pricePerHour={v.pricePerHour}
            city={v.city}
            ownerName={owner.name}
            categoryName={v.category.name}
            categoryGroup={v.category.group}
            attributes={v.attributes as Record<string, string> | null}
          />
        ))}
      </div>
    </div>
  );
}
