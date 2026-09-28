import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Вход",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Вход для арендатора</h1>
      <div className="rounded-xl border border-black/10 bg-white p-6">
        <LoginForm />
      </div>
    </div>
  );
}
