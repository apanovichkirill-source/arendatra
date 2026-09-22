"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginBuyer } from "@/lib/actions/buyer-auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginBuyer, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Телефон
        </label>
        <input
          type="tel"
          name="phone"
          required
          placeholder="+7 900 000-00-00"
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
        className="rounded-lg bg-brand-blue px-4 py-2.5 font-medium text-white hover:bg-brand-navy disabled:opacity-60"
      >
        {pending ? "Входим..." : "Войти"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium text-brand-blue">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
