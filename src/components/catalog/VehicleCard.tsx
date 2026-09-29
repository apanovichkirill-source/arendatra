import Link from "next/link";
import type { CategoryGroup, Prisma } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import { VehicleIcon } from "./VehicleIcon";
import { LogoMark } from "@/components/Logo";

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
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10"
    >
      <div className="bg-blueprint-light relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-brand-blue-light text-brand-blue">
        <LogoMark className="pointer-events-none absolute -bottom-4 -right-3 h-3/4 w-auto opacity-[0.12] grayscale transition group-hover:opacity-25 group-hover:grayscale-0" />
        <VehicleIcon group={categoryGroup} className="relative h-16 w-16 transition group-hover:scale-110" />
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
