"use client";

import Link from "next/link";
import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { requestCallback, type CallbackState } from "@/lib/actions/callback";

const INITIAL: CallbackState = { status: "idle" };

export function CallbackForm({ onDark = false }: { onDark?: boolean }) {
  const [state, action, pending] = useActionState(requestCallback, INITIAL);
  const pathname = usePathname();

  const label = onDark ? "text-white/80" : "text-gray-700";
  const muted = onDark ? "text-white/60" : "text-gray-500";
  const input =
    "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 " +
    (onDark ? "border-white/20 bg-white" : "border-black/15 bg-white");

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className={`rounded-xl p-4 text-sm ${onDark ? "bg-white/10 text-white" : "bg-green-50 text-green-800"}`}
      >
        Заявка принята. Менеджер перезвонит в рабочее время — с 8:00 до 20:00.
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-3" noValidate>
      <input type="hidden" name="page" value={pathname} />
      {/* ловушка для ботов */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={`grid gap-1 text-xs font-medium ${label}`}>
          Как к вам обращаться
          <input name="name" autoComplete="name" placeholder="Имя" className={input} />
        </label>
        <label className={`grid gap-1 text-xs font-medium ${label}`}>
          Телефон *
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+7 900 000-00-00"
            className={input}
          />
        </label>
      </div>
      <label className={`grid gap-1 text-xs font-medium ${label}`}>
        Что нужно (необязательно)
        <input
          name="comment"
          placeholder="Например: автокран 25 т в Усинске на завтра"
          className={input}
        />
      </label>
      <label className={`flex items-start gap-2 text-xs ${muted}`}>
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>
          Согласен(на) на обработку персональных данных в соответствии с{" "}
          <Link href="/privacy" target="_blank" className={onDark ? "underline" : "text-brand-blue hover:underline"}>
            политикой конфиденциальности
          </Link>
        </span>
      </label>
      {state.status === "error" && (
        <p role="alert" className={`text-sm ${onDark ? "text-orange-200" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {pending ? "Отправляем…" : "Перезвоните мне"}
      </button>
    </form>
  );
}
