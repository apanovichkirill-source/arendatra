import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Вход",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="bg-blueprint-light">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="mb-6 flex items-center gap-4">
          <LogoMark className="h-16 w-auto" />
          <h1 className="text-2xl font-extrabold text-brand-navy">Вход для арендатора</h1>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl shadow-brand-navy/5">
        <LoginForm />
        </div>
      </div>
    </div>
  );
}
