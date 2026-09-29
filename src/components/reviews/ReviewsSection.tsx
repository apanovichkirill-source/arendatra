import { formatDate } from "@/lib/format";
import { pluralize } from "@/lib/landing";
import { Stars } from "./Stars";

type Review = { id: string; rating: number; text: string; authorName: string; createdAt: Date };

export function ReviewsSection({
  reviews,
  count,
  average,
}: {
  reviews: Review[];
  count: number;
  average: number | null;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-brand-navy">Отзывы арендаторов</h2>
      {count === 0 || average === null ? (
        <p className="mt-2 text-sm text-gray-500">
          Отзывов пока нет. Оставить отзыв можно в личном кабинете после завершения аренды.
        </p>
      ) : (
        <>
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Stars value={average} className="text-lg" />
            <span className="font-semibold text-brand-navy">{average.toFixed(1)}</span>·
            {count} {pluralize(count, ["отзыв", "отзыва", "отзывов"])}
          </p>
          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-brand-navy">{r.authorName}</p>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{r.text}</p>
                <p className="mt-2 text-xs text-gray-400">{formatDate(r.createdAt)}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
