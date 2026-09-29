import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-access";
import { updateOwner } from "@/lib/actions/admin-catalog";
import { OwnerForm } from "../OwnerForm";

export default async function EditOwnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("owners.edit");
  const { id } = await params;
  const owner = await prisma.owner.findUnique({ where: { id } });
  if (!owner) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Редактировать владельца</h1>
      <OwnerForm action={updateOwner.bind(null, owner.id)} initial={owner} />
    </div>
  );
}
