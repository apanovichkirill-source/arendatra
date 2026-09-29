"use client";

import { useEffect } from "react";
import { saveBuyerLocation } from "@/lib/actions/buyer-location";

const SESSION_KEY = "arendatra_geo_sent";

export function GeoCapture() {
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage недоступен — отправим один раз за загрузку страницы
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void saveBuyerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // отказ или ошибка — ничего не сохраняем
      },
      { timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  return null;
}
