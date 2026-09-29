import { requireAdminUser } from "@/lib/admin-access";
import { PasswordForm } from "./PasswordForm";

export default async function AdminProfilePage() {
  const admin = await requireAdminUser();
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-navy">Мой пароль</h1>
      <p className="mb-6 text-sm text-gray-500">Аккаунт: {admin.login}</p>
      <PasswordForm />
    </div>
  );
}
