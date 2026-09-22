import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicleBySlug, getUpcomingBookings } from "@/lib/vehicles";
import { getBuyerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { VehicleIcon } from "@/components/catalog/VehicleIcon";

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle || !vehicle.isActive) notFound();

  const [bookings, session] = await Promise.all([
    getUpcomingBookings(vehicle.id),
    getBuyerSession(),
  ]);

  const buyer = session ? await prisma.buyer.findUnique({ where: { id: session.buyerId } }) : null;

  const attributes =
    vehicle.attributes && typeof vehicle.attributes === "object"
      ? (vehicle.attributes as Record<string, string>)
      : {};

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/catalog" className="hover:text-brand-blue">
          Каталог
        </Link>{" "}
        /{" "}
        <Link href={`/catalog?category=${vehicle.category.slug}`} className="hover:text-brand-blue">
          {vehicle.category.name}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
            <VehicleIcon group={vehicle.category.group} className="h-24 w-24 opacity-60" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-brand-navy">{vehicle.title}</h1>
          <p className="mt-1 text-gray-500">
            {vehicle.city ? `${vehicle.city} · ` : ""}
            {vehicle.category.name}
          </p>

          {vehicle.description && (
            <p className="mt-4 whitespace-pre-line text-gray-700">{vehicle.description}</p>
          )}

          {Object.keys(attributes).length > 0 && (
            <div className="mt-6 rounded-xl border border-black/10 bg-white p-4">
              <h2 className="mb-3 font-semibold text-brand-navy">Характеристики</h2>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-gray-500 capitalize">{key}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <Link
            href={`/owner/${vehicle.owner.id}`}
            className="mt-6 block rounded-xl border border-black/10 bg-white p-5 transition hover:border-brand-blue"
          >
            <p className="text-xs font-medium uppercase text-gray-500">Владелец</p>
            <p className="mt-1 font-semibold text-brand-navy">{vehicle.owner.name}</p>
            {vehicle.owner.city && (
              <p className="mt-1 text-sm text-gray-500">{vehicle.owner.city}</p>
            )}
            {vehicle.owner.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {vehicle.owner.description}
              </p>
            )}
            <span className="mt-3 inline-block text-sm font-medium text-brand-blue">
              Весь транспорт владельца →
            </span>
          </Link>
        </div>

        <div className="h-fit">
          <BookingWidget
            vehicleId={vehicle.id}
            pricePerHour={vehicle.pricePerHour ? Number(vehicle.pricePerHour) : null}
            minHours={vehicle.minHours}
            bookedRanges={bookings.map((b) => ({
              startAt: b.startAt.toISOString(),
              endAt: b.endAt.toISOString(),
            }))}
            buyerName={buyer?.name}
            buyerPhone={buyer?.phone}
          />
        </div>
      </div>
    </div>
  );
}
