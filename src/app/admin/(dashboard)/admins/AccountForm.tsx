"use client";

import { useActionState } from "react";
import type { AccountFormState } from "@/lib/actions/admin-accounts";
import { PermissionsField } from "./PermissionsField";

const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm";

export function AccountForm({
  action,
  initial,
}: {
  action: (state: AccountFormState, formData: FormData) => Promise<AccountFormState>;
  initial?: { login: string; name: string | null; isActive: boolean; permissions: string[] };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const editing = !!initial;

  return (
    <form
      action={formAction}
      className="flex max-w-xl flex-col gap-4 rounded-xl border border-black/10 bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Логин</label>
        {editing ? (
          <p className="text-sm font-semibold text-brand-navy">{initial.login}</p>
        ) : (
          <input name="login" required autoComplete="off" className={inputClass} />
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Имя сотрудника</label>
        <input name="name" defaultValue={initial?.name ?? ""} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {editing ? "Новый пароль (оставьте пустым, чтобы не менять)" : "Пароль"}
        </label>
        <input
          name="password"
          type="password"
          required={!editing}
          minLength={10}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">Не короче 10 символов.</p>
      </div>
      {editing && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="isActive" defaultChecked={initial.isActive} />
          Аккаунт активен (отключённый не может войти)
        </label>
      )}
      <PermissionsField selected={initial?.permissions ?? []} />

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-orange px-4 py-2.5 font-medium text-white hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {pending ? "Сохраняем..." : editing ? "Сохранить" : "Создать аккаунт"}
      </button>
    </form>
  );
}
