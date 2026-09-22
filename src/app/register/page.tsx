import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Регистрация арендатора</h1>
      <div className="rounded-xl border border-black/10 bg-white p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
