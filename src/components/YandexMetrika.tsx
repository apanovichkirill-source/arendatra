"use client";

import { useEffect } from "react";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from "@/lib/cookie-consent";
import { YM_ID } from "@/lib/metrika";

type YmWindow = Window & {
  ym?: ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
};

function loadMetrika(id: number) {
  const w = window as YmWindow;
  if (w.ym) return;
  const ym = function (...args: unknown[]) {
    (ym.a = ym.a || []).push(args);
  } as NonNullable<YmWindow["ym"]>;
  ym.l = Date.now();
  w.ym = ym;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.appendChild(script);

  // без вебвизора: не записываем ввод в формах, где вводятся персональные данные
  ym(id, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

export function YandexMetrika() {
  useEffect(() => {
    if (!YM_ID) return;
    const id = YM_ID;

    let accepted = false;
    try {
      accepted = window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
    } catch {
      // без доступа к хранилищу согласие не подтвердить — счётчик не грузим
    }
    if (accepted) {
      loadMetrika(id);
      return;
    }
    const onConsent = () => loadMetrika(id);
    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent, { once: true });
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  return null;
}
