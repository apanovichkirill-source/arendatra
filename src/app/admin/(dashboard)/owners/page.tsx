import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "../DeleteButton";
import { deleteOwner } from "@/lib/actions/admin-catalog";

export default async function AdminOwnersPage() {
  const owners = await prisma.owner.findMany({
    include: { _count: { select: { vehicles: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Владельцы</h1>
        <Link
          href="/admin/owners/new"
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange-dark"
        >
          + Добавить владельца
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Город</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Транспорта</th>
              <th className="px-4 py-3">Активен</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {owners.map((o) => (
              <tr key={o.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium text-brand-navy">{o.name}</td>
                <td className="px-4 py-3 text-gray-600">{o.city ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{o.phone ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{o._count.vehicles}</td>
                <td className="px-4 py-3">{o.isActive ? "Да" : "Нет"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/owners/${o.id}`}
                      className="font-medium text-brand-blue hover:underline"
                    >
                      Изменить
                    </Link>
                    <DeleteButton action={deleteOwner.bind(null, o.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {owners.length === 0 && (
          <p className="p-8 text-center text-gray-500">Владельцев пока нет</p>
        )}
      </div>
    </div>
  );
}
