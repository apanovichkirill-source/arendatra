"use client";

import { useTransition } from "react";
import { BOOKING_STATUS_LABELS } from "@/lib/format";

const STATUSES = ["NEW", "CONFIRMED", "DONE", "CANCELED"] as const;

export function BookingStatusSelect({
  bookingId,
  status,
  action,
}: {
  bookingId: string;
  status: string;
  action: (id: string, status: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => action(bookingId, e.target.value))}
      className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {BOOKING_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
