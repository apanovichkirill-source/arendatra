import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSuper } from "@/lib/admin-access";
import { deleteAdminAccount } from "@/lib/actions/admin-accounts";
import { formatDateTime } from "@/lib/format";
import { DeleteButton } from "../DeleteButton";

export default async function AdminAccountsPage() {
  await requireSuper();
  const admins = await prisma.admin.findMany({
    orderBy: [{ isSuper: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Аккаунты администраторов</h1>
        <Link
          href="/admin/admins/new"
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange-dark"
        >
          + Добавить аккаунт
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Логин</th>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Доступ</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Создан</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium text-brand-navy">{a.login}</td>
                <td className="px-4 py-3 text-gray-600">{a.name ?? "—"}</td>
                <td className="max-w-[260px] px-4 py-3 text-gray-600">
                  {a.isSuper ? (
                    <span className="font-semibold text-brand-orange">Главный — полный доступ</span>
                  ) : a.permissions.length ? (
                    a.permissions.join(", ")
                  ) : (
                    "нет прав"
                  )}
                </td>
                <td className="px-4 py-3">{a.isActive ? "Активен" : "Отключён"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {formatDateTime(a.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {!a.isSuper && (
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/admins/${a.id}`}
                        className="font-medium text-brand-blue hover:underline"
                      >
                        Изменить
                      </Link>
                      <DeleteButton
                        action={deleteAdminAccount.bind(null, a.id)}
                        confirmText={`Удалить аккаунт ${a.login}? История его действий в журнале сохранится.`}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
