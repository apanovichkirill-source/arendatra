import type { Prisma } from "@prisma/client";

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  return `+${digits}`;
}

export function formatPrice(
  value: number | string | Prisma.Decimal | null | undefined
) {
  if (value === null || value === undefined) return "Цена по запросу";
  const num = typeof value === "object" ? value.toNumber() : Number(value);
  if (Number.isNaN(num)) return "Цена по запросу";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(num);
}

export const CATEGORY_GROUP_LABELS: Record<string, string> = {
  LIFTING: "Грузоподъёмная техника",
  EARTHMOVING: "Землеройная техника",
  PASSENGER: "Пассажирские перевозки",
};

export const PRICING_NOTE =
  "Все тарифы указаны без учёта 5% НДС. Итоговая стоимость зависит от условий оплаты, количества арендуемой техники и периода аренды. Конечную стоимость уточняйте у менеджера.";

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  NEW: "Новая",
  CONFIRMED: "Подтверждена",
  DONE: "Завершена",
  CANCELED: "Отменена",
};

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

export function diffHours(start: Date, end: Date) {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
}

// datetime-local input value, e.g. 2026-09-22T14:00, in local time
export function toDateTimeLocal(value: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(
    value.getHours()
  )}:${pad(value.getMinutes())}`;
}
