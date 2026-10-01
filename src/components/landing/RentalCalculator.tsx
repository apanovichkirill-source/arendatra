"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type Row = { name: string; href: string; price: number | null };

export function RentalCalculator({ rows }: { rows: Row[] }) {
  const options = rows.filter((r) => r.price !== null);
  const [idx, setIdx] = useState(0);
  const [hours, setHours] = useState(8);
  if (options.length === 0) return null;

  const current = options[Math.min(idx, options.length - 1)];
  const total = (current.price as number) * Math.max(1, hours || 1);

  return (
    <section className="mt-10 rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="text-xl font-bold text-brand-navy">Калькулятор стоимости аренды</h2>
      <p className="mt-1 text-sm text-gray-500">Ориентировочный расчёт по стартовому тарифу.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px]">
        <label className="block text-sm font-medium text-gray-700">
          Техника
          <select
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {options.map((o, i) => (
              <option key={o.href} value={i}>
                {o.name.replace(/^Аренда /, "")}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Часов
          <input
            type="number"
            min={1}
            max={999}
            value={hours}
            onChange={(e) => setHours(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
        <div>
          <p className="text-sm text-gray-500">
            {formatPrice(current.price)} в час × {Math.max(1, hours || 1)} ч
          </p>
          <p className="text-2xl font-extrabold text-brand-navy">от {formatPrice(total)}</p>
        </div>
        <Link
          href={current.href}
          className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
        >
          Выбрать технику
        </Link>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Без НДС 5%, подачи на объект и дополнительных условий. Точную стоимость подтверждает
        менеджер.
      </p>
    </section>
  );
}
