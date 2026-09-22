import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { DeleteButton } from "../DeleteButton";
import { deleteVehicle } from "@/lib/actions/admin-catalog";

export default async function AdminVehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    include: { category: true, owner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Транспорт</h1>
        <Link
          href="/admin/vehicles/new"
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange-dark"
        >
          + Добавить транспорт
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Владелец</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Активен</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium text-brand-navy">{v.title}</td>
                <td className="px-4 py-3 text-gray-600">{v.category.name}</td>
                <td className="px-4 py-3 text-gray-600">{v.owner.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {formatPrice(v.pricePerHour)} / час
                </td>
                <td className="px-4 py-3">{v.isActive ? "Да" : "Нет"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/vehicles/${v.id}`}
                      className="font-medium text-brand-blue hover:underline"
                    >
                      Изменить
                    </Link>
                    <DeleteButton action={deleteVehicle.bind(null, v.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehicles.length === 0 && (
          <p className="p-8 text-center text-gray-500">Транспорта пока нет</p>
        )}
      </div>
    </div>
  );
}
