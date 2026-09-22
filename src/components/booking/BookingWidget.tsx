"use client";

import { useMemo, useState } from "react";
import { createBooking } from "@/lib/actions/booking";
import { diffHours, formatPrice } from "@/lib/format";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function combine(day: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h || 0, m || 0);
}

export function BookingWidget({
  vehicleId,
  pricePerHour,
  minHours,
  bookedRanges,
  buyerName,
  buyerPhone,
}: {
  vehicleId: string;
  pricePerHour: number | null;
  minHours: number;
  bookedRanges: { startAt: string; endAt: string }[];
  buyerName?: string | null;
  buyerPhone?: string | null;
}) {
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [contactName, setContactName] = useState(buyerName ?? "");
  const [contactPhone, setContactPhone] = useState(buyerPhone ?? "");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSelectDay(day: Date) {
    setError(null);
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(day);
      setSelectedEnd(null);
      return;
    }
    if (startOfDay(day).getTime() < startOfDay(selectedStart).getTime()) {
      setSelectedStart(day);
      setSelectedEnd(null);
      return;
    }
    setSelectedEnd(day);
  }

  const { startAt, endAt, hours, totalPrice } = useMemo(() => {
    if (!selectedStart) return { startAt: null, endAt: null, hours: 0, totalPrice: null };
    const s = combine(selectedStart, startTime);
    const e = combine(selectedEnd ?? selectedStart, endTime);
    const h = diffHours(s, e);
    return {
      startAt: s,
      endAt: e,
      hours: h,
      totalPrice: pricePerHour ? h * pricePerHour : null,
    };
  }, [selectedStart, selectedEnd, startTime, endTime, pricePerHour]);

  const effectiveMinHours = Math.max(1, minHours);
  const isValidRange = startAt && endAt && endAt > startAt && hours >= effectiveMinHours;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startAt || !endAt) {
      setError("Выберите даты аренды в календаре");
      return;
    }
    if (!isValidRange) {
      setError(`Минимальный срок аренды — ${effectiveMinHours} ч.`);
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await createBooking({
      vehicleId,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      contactName: contactName || undefined,
      contactPhone,
      comment: comment || undefined,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(result.bookingId);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-5 text-center">
        <p className="text-lg font-bold text-brand-navy">Заявка на бронь отправлена!</p>
        <p className="mt-2 text-sm text-gray-600">
          Номер заявки: {success.slice(0, 8)}. Мы свяжемся с вами по телефону для подтверждения
          брони — оплата не требуется на этом шаге.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 bg-white p-5">
      <p className="text-2xl font-bold text-brand-navy">
        {pricePerHour ? formatPrice(pricePerHour) : "Цена по запросу"}
        <span className="ml-1 text-sm font-normal text-gray-500">/ час</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">Минимальная аренда — {effectiveMinHours} ч.</p>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-700">
          Выберите даты {selectedStart && !selectedEnd ? "(нажмите на дату окончания)" : ""}
        </p>
        <AvailabilityCalendar
          bookedRanges={bookedRanges}
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          onSelectDay={handleSelectDay}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Время начала</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Время окончания</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {startAt && endAt && (
        <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Срок аренды</span>
            <span>{hours} ч.</span>
          </div>
          {totalPrice !== null && (
            <div className="mt-1 flex justify-between font-semibold text-brand-navy">
              <span>Итого</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Имя</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Телефон для связи
          </label>
          <input
            type="tel"
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+7 900 000-00-00"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !isValidRange}
        className="mt-4 w-full rounded-lg bg-brand-orange px-4 py-2.5 font-medium text-white transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Отправляем..." : "Забронировать"}
      </button>
      <p className="mt-2 text-xs text-gray-500">
        Онлайн-оплата не требуется. Менеджер подтвердит бронь по телефону.
      </p>
    </form>
  );
}
