"use client";

import { useTransition } from "react";

export function ReviewActions({
  id,
  status,
  onModerate,
  onDelete,
}: {
  id: string;
  status: string;
  onModerate: (id: string, decision: "APPROVED" | "REJECTED") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const btn = "rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-50";

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "APPROVED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => onModerate(id, "APPROVED"))}
          className={`${btn} border-green-600 text-green-700 hover:bg-green-50`}
        >
          Опубликовать
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => onModerate(id, "REJECTED"))}
          className={`${btn} border-gray-300 text-gray-700 hover:bg-gray-50`}
        >
          Отклонить
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => {
          if (window.confirm("Удалить отзыв безвозвратно?")) {
            startTransition(() => onDelete(id));
          }
        }}
        className={`${btn} border-red-300 text-red-600 hover:bg-red-50`}
      >
        Удалить
      </button>
    </div>
  );
}
