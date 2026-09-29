"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/actions/reviews";

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await submitReview({ bookingId, rating, text });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t border-black/5 pt-4">
      <p className="text-sm font-medium text-gray-700">Оставьте отзыв о технике</p>
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Оценка">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} из 5`}
            onClick={() => setRating(n)}
            className={`text-2xl leading-none ${n <= rating ? "text-brand-orange" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="Как прошла аренда? Состояние техники, работа водителя или оператора, сроки"
        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <p className="mt-1 text-xs text-gray-400">
        Отзыв будет опубликован на странице техники вместе с вашим именем (без фамилии и
        телефона) после проверки модератором.
      </p>
      {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-3 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange-dark disabled:opacity-50"
      >
        {submitting ? "Отправляем..." : "Отправить отзыв"}
      </button>
    </form>
  );
}
