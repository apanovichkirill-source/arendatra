"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_CITIES } from "@/lib/cities";
import { nearestCity } from "@/lib/geo";

const STORAGE_KEY = "arendatra_city_pref";
const GEO_TIMEOUT_MS = 6000;

type Status = "idle" | "detected" | "manual" | "hidden";

export function CityPrompt() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [detected, setDetected] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState("");

  useEffect(() => {
    let cancelled = false;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage недоступен — просто предложим выбрать город вручную один раз за сессию
    }
    if (stored) return;

    if (!("geolocation" in navigator)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- фича-проверка доступна только после монтирования на клиенте
      setStatus("manual");
      return;
    }

    const timer = setTimeout(() => {
      if (!cancelled) setStatus((s) => (s === "idle" ? "manual" : s));
    }, GEO_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        if (cancelled) return;
        setDetected(nearestCity(pos.coords.latitude, pos.coords.longitude));
        setStatus("detected");
      },
      () => {
        clearTimeout(timer);
        if (!cancelled) setStatus("manual");
      },
      { timeout: GEO_TIMEOUT_MS, maximumAge: 10 * 60 * 1000 }
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  function confirm(city: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, city);
    } catch {
      // ignore
    }
    setStatus("hidden");
    router.push(`/catalog?city=${encodeURIComponent(city)}`);
  }

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // ignore
    }
    setStatus("hidden");
  }

  if (status === "hidden" || status === "idle") return null;

  return (
    <div className="border-b border-black/10 bg-brand-blue-light">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-sm">
        {status === "detected" && detected ? (
          <>
            <span className="text-brand-navy">
              Ваш город — <strong>{detected}</strong>?
            </span>
            <button
              type="button"
              onClick={() => confirm(detected)}
              className="rounded-lg bg-brand-blue px-3 py-1.5 font-medium text-white hover:bg-brand-navy"
            >
              Да, показать технику
            </button>
            <button
              type="button"
              onClick={() => setStatus("manual")}
              className="text-brand-blue hover:underline"
            >
              Выбрать другой город
            </button>
          </>
        ) : (
          <>
            <span className="text-brand-navy">Укажите ваш город:</span>
            <select
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900"
            >
              <option value="">Выберите</option>
              {SERVICE_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!manualCity}
              onClick={() => confirm(manualCity)}
              className="rounded-lg bg-brand-blue px-3 py-1.5 font-medium text-white hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
            >
              Показать технику
            </button>
          </>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Закрыть"
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
