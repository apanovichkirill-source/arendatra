import Link from "next/link";
import { requireAdminUser } from "@/lib/admin-access";
import { can, type Permission } from "@/lib/admin-permissions";
import { logoutAdmin } from "@/lib/actions/admin-auth";

const NAV: { href: string; label: string; permission?: Permission; superOnly?: boolean }[] = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/vehicles", label: "Транспорт", permission: "vehicles.view" },
  { href: "/admin/owners", label: "Владельцы", permission: "owners.view" },
  { href: "/admin/bookings", label: "Брони", permission: "bookings.view" },
  { href: "/admin/buyers", label: "Арендаторы", permission: "buyers.view" },
  { href: "/admin/audit", label: "Журнал аудита", permission: "audit.view" },
  { href: "/admin/admins", label: "Аккаунты", superOnly: true },
];

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminUser();
  const items = NAV.filter((i) => {
    if (i.superOnly) return admin.isSuper;
    return !i.permission || can(admin, i.permission);
  });

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="w-56 shrink-0">
        <p className="text-lg font-bold text-brand-navy">Админ-панель</p>
        <p className="mb-4 mt-1 text-xs text-gray-500">
          {admin.name || admin.login}
          {admin.isSuper ? " · главный администратор" : ""}
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className={linkClass}>
              {i.label}
            </Link>
          ))}
          <Link href="/admin/profile" className={linkClass}>
            Мой пароль
          </Link>
        </nav>
        <form action={logoutAdmin} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Выйти
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
