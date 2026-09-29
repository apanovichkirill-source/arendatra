"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/lib/actions/admin-accounts";

const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changeOwnPassword, undefined);
  return (
    <form
      action={formAction}
      className="flex max-w-md flex-col gap-4 rounded-xl border border-black/10 bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Текущий пароль</label>
        <input name="current" type="password" required autoComplete="current-password" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Новый пароль</label>
        <input name="next" type="password" required minLength={10} autoComplete="new-password" className={inputClass} />
        <p className="mt-1 text-xs text-gray-500">Не короче 10 символов.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Повторите новый пароль</label>
        <input name="confirm" type="password" required autoComplete="new-password" className={inputClass} />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-orange px-4 py-2.5 font-medium text-white hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {pending ? "Сохраняем..." : "Сменить пароль"}
      </button>
    </form>
  );
}
