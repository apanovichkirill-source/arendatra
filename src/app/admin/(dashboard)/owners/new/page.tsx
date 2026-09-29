import { requirePermission } from "@/lib/admin-access";
import { createOwner } from "@/lib/actions/admin-catalog";
import { OwnerForm } from "../OwnerForm";

export default async function NewOwnerPage() {
  await requirePermission("owners.edit");
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Новый владелец</h1>
      <OwnerForm action={createOwner} />
    </div>
  );
}
