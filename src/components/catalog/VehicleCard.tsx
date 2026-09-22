import Link from "next/link";
import type { CategoryGroup, Prisma } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import { VehicleIcon } from "./VehicleIcon";

export function VehicleCard({
  slug,
  title,
  pricePerHour,
  city,
  ownerName,
  categoryName,
  categoryGroup,
  attributes,
}: {
  slug: string;
  title: string;
  pricePerHour: number | string | Prisma.Decimal | null;
  city: string | null;
  ownerName: string;
  categoryName: string;
  categoryGroup: CategoryGroup;
  attributes?: Record<string, string> | null;
}) {
  const specs = attributes ? Object.entries(attributes).slice(0, 2) : [];

  return (
    <Link
      href={`/vehicle/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition hover:border-brand-blue hover:shadow-md"
    >
      <div className="flex aspect-[16/10] items-center justify-center bg-brand-blue-light text-brand-blue">
        <VehicleIcon group={categoryGroup} className="h-14 w-14 opacity-70" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 inline-block w-fit rounded-full bg-brand-blue-light px-2.5 py-0.5 text-xs font-medium text-brand-blue">
          {categoryName}
        </span>
        <h3 className="font-semibold text-brand-navy group-hover:text-brand-blue">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {ownerName}
          {city ? ` · ${city}` : ""}
        </p>

        {specs.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {specs.map(([key, value]) => (
              <span
                key={key}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {value}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-lg font-bold text-brand-navy">
            {formatPrice(pricePerHour)}
            <span className="ml-1 text-sm font-normal text-gray-500">/ час</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
