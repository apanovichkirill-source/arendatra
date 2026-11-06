"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY as STORAGE_KEY } from "@/lib/cookie-consent";

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
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    // На телефоне — компактная плашка над нижней панелью «Позвонить», чтобы не закрывать её
    <div className="fixed inset-x-2 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] z-50 rounded-xl border border-black/10 bg-white px-3 py-2.5 shadow-lg sm:inset-x-0 sm:bottom-0 sm:rounded-none sm:border-x-0 sm:border-b-0 sm:px-4 sm:py-3">
      <div className="mx-auto flex max-w-6xl items-center gap-3 sm:justify-between">
        <p className="text-xs leading-snug text-gray-600 sm:text-sm">
          Используем cookie для входа в кабинет и анонимной статистики Яндекс.Метрики.
          Нажимая «Принимаю», вы соглашаетесь с их использованием —{" "}
          <Link href="/privacy" className="text-brand-blue hover:underline">
            подробнее
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange-dark"
        >
          Принимаю
        </button>
      </div>
    </div>
  );
}
