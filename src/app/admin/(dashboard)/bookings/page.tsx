import { prisma } from "@/lib/prisma";
import { formatDateTime, formatPrice } from "@/lib/format";
import { mapLink } from "@/lib/geo";
import { updateBookingStatus } from "@/lib/actions/admin-catalog";
import { BookingStatusSelect } from "./BookingStatusSelect";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Брони</h1>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Транспорт</th>
              <th className="px-4 py-3">Даты</th>
              <th className="px-4 py-3">Контакт</th>
              <th className="px-4 py-3">Геопозиция</th>
              <th className="px-4 py-3">Комментарий</th>
              <th className="px-4 py-3">Сумма</th>
              <th className="px-4 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium text-brand-navy">{b.vehicle.title}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {formatDateTime(b.startAt)} — {formatDateTime(b.endAt)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {b.contactName ? `${b.contactName}, ` : ""}
                  {b.contactPhone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {b.geoLat != null && b.geoLng != null ? (
                    <a
                      href={mapLink(b.geoLat, b.geoLng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline"
                    >
                      На карте
                    </a>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="max-w-[240px] px-4 py-3 text-gray-600">
                  {b.comment ? (
                    <span className="line-clamp-3 whitespace-pre-line">{b.comment}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{formatPrice(b.totalPrice)}</td>
                <td className="px-4 py-3">
                  <BookingStatusSelect
                    bookingId={b.id}
                    status={b.status}
                    action={updateBookingStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="p-8 text-center text-gray-500">Броней пока нет</p>
        )}
      </div>
    </div>
  );
}
