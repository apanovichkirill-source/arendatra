import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getBuyerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDateTime, BOOKING_STATUS_LABELS } from "@/lib/format";
import { logoutBuyer } from "@/lib/actions/buyer-auth";
import { GeoCapture } from "@/components/GeoCapture";

export const metadata: Metadata = {
  title: "Личный кабинет",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await getBuyerSession();
  if (!session) redirect("/login");

  const buyer = await prisma.buyer.findUnique({ where: { id: session.buyerId } });
  if (!buyer) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { buyerId: buyer.id },
    orderBy: { createdAt: "desc" },
    include: { vehicle: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <GeoCapture />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Личный кабинет</h1>
          <p className="mt-1 text-gray-500">
            {buyer.name ? `${buyer.name} · ` : ""}
            {buyer.phone}
          </p>
        </div>
        <form action={logoutBuyer}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Выйти
          </button>
        </form>
      </div>

      <h2 className="mb-4 text-lg font-bold text-brand-navy">Мои брони</h2>

      {bookings.length === 0 ? (
        <p className="rounded-xl border border-black/10 bg-white p-8 text-center text-gray-500">
          Броней пока нет.{" "}
          <a href="/catalog" className="font-medium text-brand-blue">
            Перейти в каталог
          </a>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-black/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <a
                  href={`/vehicle/${booking.vehicle.slug}`}
                  className="font-medium text-brand-navy hover:text-brand-blue"
                >
                  {booking.vehicle.title}
                </a>
                <span className="rounded-full bg-brand-blue-light px-3 py-1 text-xs font-medium text-brand-blue">
                  {BOOKING_STATUS_LABELS[booking.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {formatDateTime(booking.startAt)} — {formatDateTime(booking.endAt)}
              </p>
              {booking.totalPrice && (
                <p className="mt-1 text-sm text-gray-500">
                  Стоимость: {formatPrice(booking.totalPrice)}
                </p>
              )}
              {booking.comment && (
                <p className="mt-2 text-sm text-gray-500">Комментарий: {booking.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
