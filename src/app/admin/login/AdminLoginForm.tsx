"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/actions/admin-auth";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Логин</label>
        <input
          type="text"
          name="login"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Пароль</label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-navy px-4 py-2.5 font-medium text-white hover:bg-black disabled:opacity-60"
      >
        {pending ? "Входим..." : "Войти в админку"}
      </button>
    </form>
  );
}
