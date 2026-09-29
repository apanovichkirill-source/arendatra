import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getVehicleBySlug, getUpcomingBookings } from "@/lib/vehicles";
import { getBuyerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { VehicleIcon } from "@/components/catalog/VehicleIcon";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { getVehicleReviews } from "@/lib/reviews";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Транспорт не найден" };

  const description = `${formatPrice(vehicle.pricePerHour)} / час. ${
    vehicle.description ?? `Аренда: ${vehicle.title} в ${vehicle.city ?? "Республике Коми"}.`
  }`;

  return {
    title: `${vehicle.title} — аренда от ${formatPrice(vehicle.pricePerHour)}/ч`,
    description,
    alternates: { canonical: `/vehicle/${vehicle.slug}` },
    openGraph: { title: vehicle.title, description },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle || !vehicle.isActive) notFound();

  const session = await getBuyerSession();
  const [bookings, reviewData, buyer] = await Promise.all([
    getUpcomingBookings(vehicle.id),
    getVehicleReviews(vehicle.id),
    session ? prisma.buyer.findUnique({ where: { id: session.buyerId } }) : null,
  ]);

  const attributes =
    vehicle.attributes && typeof vehicle.attributes === "object"
      ? (vehicle.attributes as Record<string, string>)
      : {};

  const nonce = (await headers()).get("x-nonce") || undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.title,
    description: vehicle.description ?? vehicle.title,
    url: `${SITE_URL}/vehicle/${vehicle.slug}`,
    category: vehicle.category.name,
    brand: { "@type": "Organization", name: vehicle.owner.name },
    ...(vehicle.pricePerHour
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            price: vehicle.pricePerHour.toString(),
            unitText: "HOUR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/vehicle/${vehicle.slug}`,
          },
        }
      : {}),
    ...(reviewData.count > 0 && reviewData.average !== null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewData.average,
            reviewCount: reviewData.count,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviewData.reviews.slice(0, 10).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.authorName },
            datePublished: r.createdAt.toISOString().slice(0, 10),
            reviewBody: r.text,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
          })),
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        nonce={nonce}
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/catalog" className="hover:text-brand-blue">
          Каталог
        </Link>{" "}
        /{" "}
        <Link href={`/catalog?category=${vehicle.category.slug}`} className="hover:text-brand-blue">
          {vehicle.category.name}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
            <VehicleIcon group={vehicle.category.group} className="h-24 w-24 opacity-60" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-brand-navy">{vehicle.title}</h1>
          <p className="mt-1 text-gray-500">
            {vehicle.city ? `${vehicle.city} · ` : ""}
            {vehicle.category.name}
          </p>

          {vehicle.description && (
            <p className="mt-4 whitespace-pre-line text-gray-700">{vehicle.description}</p>
          )}

          {Object.keys(attributes).length > 0 && (
            <div className="mt-6 rounded-xl border border-black/10 bg-white p-4">
              <h2 className="mb-3 font-semibold text-brand-navy">Характеристики</h2>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-gray-500">{key}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <ReviewsSection
            reviews={reviewData.reviews}
            count={reviewData.count}
            average={reviewData.average}
          />

          <Link
            href={`/owner/${vehicle.owner.id}`}
            className="mt-6 block rounded-xl border border-black/10 bg-white p-5 transition hover:border-brand-blue"
          >
            <p className="text-xs font-medium uppercase text-gray-500">Владелец</p>
            <p className="mt-1 font-semibold text-brand-navy">{vehicle.owner.name}</p>
            {vehicle.owner.city && (
              <p className="mt-1 text-sm text-gray-500">{vehicle.owner.city}</p>
            )}
            {vehicle.owner.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {vehicle.owner.description}
              </p>
            )}
            <span className="mt-3 inline-block text-sm font-medium text-brand-blue">
              Весь транспорт владельца →
            </span>
          </Link>
        </div>

        <div className="h-fit">
          <BookingWidget
            vehicleId={vehicle.id}
            pricePerHour={vehicle.pricePerHour ? Number(vehicle.pricePerHour) : null}
            minHours={vehicle.minHours}
            bookedRanges={bookings.map((b) => ({
              startAt: b.startAt.toISOString(),
              endAt: b.endAt.toISOString(),
            }))}
            buyerName={buyer?.name}
            buyerPhone={buyer?.phone}
          />
        </div>
      </div>
    </div>
  );
}
