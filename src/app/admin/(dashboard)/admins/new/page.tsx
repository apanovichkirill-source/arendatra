import { requireSuper } from "@/lib/admin-access";
import { createAdminAccount } from "@/lib/actions/admin-accounts";
import { AccountForm } from "../AccountForm";

export default async function NewAdminPage() {
  await requireSuper();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Новый аккаунт</h1>
      <AccountForm action={createAdminAccount} />
    </div>
  );
}
