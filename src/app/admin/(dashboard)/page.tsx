import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/admin-access";
import { can, type Permission } from "@/lib/admin-permissions";

export default async function AdminOverviewPage() {
  const admin = await requireAdminUser();
  const [vehicleCount, ownerCount, newBookingsCount, totalBookingsCount, buyerCount] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.owner.count(),
      prisma.booking.count({ where: { status: "NEW" } }),
      prisma.booking.count(),
      prisma.buyer.count(),
    ]);

  const allCards: { label: string; value: number; href: string; permission: Permission }[] = [
    { label: "Транспорта в каталоге", value: vehicleCount, href: "/admin/vehicles", permission: "vehicles.view" },
    { label: "Владельцев", value: ownerCount, href: "/admin/owners", permission: "owners.view" },
    { label: "Новых броней", value: newBookingsCount, href: "/admin/bookings", permission: "bookings.view" },
    { label: "Всего броней", value: totalBookingsCount, href: "/admin/bookings", permission: "bookings.view" },
    { label: "Арендаторов", value: buyerCount, href: "/admin/buyers", permission: "buyers.view" },
  ];
  const cards = allCards.filter((c) => can(admin, c.permission));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Обзор</h1>
      {cards.length === 0 && (
        <p className="text-gray-500">
          Вам пока не выдан доступ ни к одному разделу. Обратитесь к главному администратору.
        </p>
      )}
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
