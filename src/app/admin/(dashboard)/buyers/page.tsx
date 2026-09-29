import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-access";
import { formatDate, formatDateTime } from "@/lib/format";
import { mapLink } from "@/lib/geo";

export default async function AdminBuyersPage() {
  await requirePermission("buyers.view");
  const buyers = await prisma.buyer.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Арендаторы</h1>
        <p className="text-sm text-gray-500">Всего: {buyers.length}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Город</th>
              <th className="px-4 py-3">Организация</th>
              <th className="px-4 py-3">Регистрация</th>
              <th className="px-4 py-3">Последняя геопозиция</th>
              <th className="px-4 py-3">Согласие на данные</th>
              <th className="px-4 py-3">Броней</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((b) => (
              <tr key={b.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium text-brand-navy">{b.name || "—"}</td>
                <td className="px-4 py-3 text-gray-600">
                  <a href={`tel:${b.phone}`} className="hover:text-brand-blue hover:underline">
                    {b.phone}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-600">{b.city || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{b.organization || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(b.createdAt)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {b.lastLat != null && b.lastLng != null ? (
                    <>
                      <a
                        href={mapLink(b.lastLat, b.lastLng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:underline"
                      >
                        {b.lastGeoCity ? `Рядом: ${b.lastGeoCity}` : "На карте"}
                      </a>
                      {b.lastGeoAt && (
                        <span className="block text-xs text-gray-400">
                          {formatDateTime(b.lastGeoAt)}
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {b.consentAt ? formatDate(b.consentAt) : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{b._count.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {buyers.length === 0 && (
          <p className="p-8 text-center text-gray-500">Пока никто не зарегистрировался</p>
        )}
      </div>
    </div>
  );
}
