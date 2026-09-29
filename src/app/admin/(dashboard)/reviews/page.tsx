import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/admin-access";
import { can } from "@/lib/admin-permissions";
import { formatDateTime } from "@/lib/format";
import { deleteReview, moderateReview } from "@/lib/actions/admin-reviews";
import { Stars } from "@/components/reviews/Stars";
import { ReviewActions } from "./ReviewActions";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "На модерации",
  APPROVED: "Опубликован",
  REJECTED: "Отклонён",
};

export default async function AdminReviewsPage() {
  const admin = await requirePermission("reviews.view");
  const canEdit = can(admin, "reviews.edit");
  const reviews = await prisma.review.findMany({
    include: { vehicle: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const sorted = [
    ...reviews.filter((r) => r.status === "PENDING"),
    ...reviews.filter((r) => r.status !== "PENDING"),
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">Отзывы</h1>
      <div className="flex flex-col gap-3">
        {sorted.map((r) => (
          <div key={r.id} className="rounded-xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-brand-navy">{r.vehicle.title}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  r.status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : r.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {STATUS_LABELS[r.status]}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Stars value={r.rating} /> {r.authorName} · {formatDateTime(r.createdAt)}
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{r.text}</p>
            {canEdit && (
              <div className="mt-3">
                <ReviewActions
                  id={r.id}
                  status={r.status}
                  onModerate={moderateReview}
                  onDelete={deleteReview}
                />
              </div>
            )}
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="rounded-xl border border-black/10 bg-white p-8 text-center text-gray-500">
            Отзывов пока нет
          </p>
        )}
      </div>
    </div>
  );
}
