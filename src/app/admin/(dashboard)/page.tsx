import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [vehicleCount, ownerCount, newBookingsCount, totalBookingsCount] = await Promise.all([
    prisma.vehicle.count(),
    prisma.owner.count(),
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.booking.count(),
  ]);

  const cards = [
    { label: "Транспорта в каталоге", value: vehicleCount, href: "/admin/vehicles" },
    { label: "Владельцев", value: ownerCount, href: "/admin/owners" },
    { label: "Новых броней", value: newBookingsCount, href: "/admin/bookings" },
    { label: "Всего броней", value: totalBookingsCount, href: "/admin/bookings" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Обзор</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-black/10 bg-white p-5 transition hover:border-brand-blue"
          >
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-brand-navy">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
