"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "armada_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Читаем localStorage только после монтирования на клиенте, чтобы избежать
    // рассинхронизации с серверным рендером (баннер всегда скрыт при SSR).
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- одноразовое раскрытие после гидратации, без внешнего стора
        setVisible(true);
      }
    } catch {
      // localStorage недоступен (приватный режим и т.п.) — просто не показываем баннер повторно в рамках сессии
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-600">
          Сайт использует технически необходимые cookie для входа в личный кабинет и
          админ-панель. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием —
          подробнее в{" "}
          <Link href="/privacy" className="text-brand-blue hover:underline">
            политике конфиденциальности
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="w-full shrink-0 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-orange-dark sm:w-auto"
        >
          Принимаю
        </button>
      </div>
    </div>
  );
}
