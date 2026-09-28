import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { logoutAdmin } from "@/lib/actions/admin-auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="w-56 shrink-0">
        <p className="mb-4 text-lg font-bold text-brand-navy">Админ-панель</p>
        <nav className="flex flex-col gap-1">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue"
          >
            Обзор
          </Link>
          <Link
            href="/admin/vehicles"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue"
          >
            Транспорт
          </Link>
          <Link
            href="/admin/owners"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue"
          >
            Владельцы
          </Link>
          <Link
            href="/admin/bookings"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue"
          >
            Брони
          </Link>
          <Link
            href="/admin/buyers"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue"
          >
            Арендаторы
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
      <div className="flex-1">{children}</div>
    </div>
  );
}
