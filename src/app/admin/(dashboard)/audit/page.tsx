import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-access";
import { AUDIT_ACTION_LABELS } from "@/lib/audit";
import { formatDateTime } from "@/lib/format";

const PAGE_SIZE = 50;

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; admin?: string }>;
}) {
  await requirePermission("audit.view");
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const adminFilter = sp.admin || undefined;

  const where = adminFilter ? { adminLogin: adminFilter } : {};
  const [rows, total, logins] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ distinct: ["adminLogin"], select: { adminLogin: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (p: number) => {
    const q = new URLSearchParams();
    if (adminFilter) q.set("admin", adminFilter);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return `/admin/audit${s ? `?${s}` : ""}`;
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-navy">Журнал аудита</h1>
        <form className="flex items-center gap-2 text-sm" method="get">
          <select
            name="admin"
            defaultValue={adminFilter ?? ""}
            className="rounded-lg border border-gray-300 px-2 py-1.5"
          >
            <option value="">Все аккаунты</option>
            {logins.map((l) => (
              <option key={l.adminLogin} value={l.adminLogin}>
                {l.adminLogin}
              </option>
            ))}
          </select>
          <button className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
            Показать
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Время</th>
              <th className="px-4 py-3">Аккаунт</th>
              <th className="px-4 py-3">Действие</th>
              <th className="px-4 py-3">Подробности</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-black/5 align-top">
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {formatDateTime(r.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium text-brand-navy">{r.adminLogin}</td>
                <td className="px-4 py-3 text-gray-800">
                  {AUDIT_ACTION_LABELS[r.action] ?? r.action}
                </td>
                <td className="max-w-[320px] px-4 py-3 text-gray-600">{r.details ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">{r.ip ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-8 text-center text-gray-500">Записей пока нет</p>}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Страница {page} из {pages} · записей: {total}
          </span>
          <div className="flex gap-3">
            {page > 1 && (
              <Link href={href(page - 1)} className="text-brand-blue hover:underline">
                ← Новее
              </Link>
            )}
            {page < pages && (
              <Link href={href(page + 1)} className="text-brand-blue hover:underline">
                Старее →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
