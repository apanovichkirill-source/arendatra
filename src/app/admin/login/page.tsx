import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Вход в админ-панель</h1>
      <div className="rounded-xl border border-black/10 bg-white p-6">
        <AdminLoginForm />
      </div>
    </div>
  );
}
