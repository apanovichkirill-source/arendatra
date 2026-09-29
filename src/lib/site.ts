// Основной домен: аренда-транспорта.рф (punycode). Переменная окружения может его переопределить.
const PRODUCTION_URL = "https://xn----7sbabaug8dekkefemmh.xn--p1ai";

const DEFAULT_URL =
  process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_URL).replace(/\/$/, "");
