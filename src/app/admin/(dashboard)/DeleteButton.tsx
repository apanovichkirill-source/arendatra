"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmText = "Удалить запись?",
}: {
  action: () => Promise<void>;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmText)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="font-medium text-red-500 hover:underline disabled:opacity-60"
    >
      {pending ? "Удаление..." : "Удалить"}
    </button>
  );
}
