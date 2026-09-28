"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerBuyer } from "@/lib/actions/buyer-auth";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerBuyer, undefined);

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
          minLength={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Имя и фамилия</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Иван Петров"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-gray-400">
          Настоящее имя и фамилия — без ников и цифр
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Город</label>
        <input
          type="text"
          name="city"
          required
          defaultValue="Москва"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Название организации (необязательно)
        </label>
        <input
          type="text"
          name="organization"
          placeholder="ООО «Компания»"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <ConsentCheckbox />

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
        {pending ? "Регистрируем..." : "Зарегистрироваться"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-brand-blue">
          Войти
        </Link>
      </p>
    </form>
  );
}
