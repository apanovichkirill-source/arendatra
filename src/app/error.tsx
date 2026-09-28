"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-brand-navy">Что-то пошло не так</h1>
      <p className="mt-2 text-gray-500">
        Произошла непредвиденная ошибка. Попробуйте ещё раз или вернитесь в каталог.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => retry()}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy"
        >
          Попробовать снова
        </button>
        <Link
          href="/catalog"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          В каталог
        </Link>
      </div>
    </div>
  );
}
