import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuper } from "@/lib/admin-access";
import { updateAdminAccount } from "@/lib/actions/admin-accounts";
import { AccountForm } from "../AccountForm";

export default async function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuper();
  const { id } = await params;
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin || admin.isSuper) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Аккаунт {admin.login}</h1>
      <AccountForm
        action={updateAdminAccount.bind(null, admin.id)}
        initial={{
          login: admin.login,
          name: admin.name,
          isActive: admin.isActive,
          permissions: admin.permissions,
        }}
      />
    </div>
  );
}
