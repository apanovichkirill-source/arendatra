import { LogoMark } from "@/components/Logo";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="aspect-[16/10] animate-pulse bg-gray-100" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="mt-2 h-6 w-1/3 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <LogoMark className="h-10 w-auto animate-pulse" />
        <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="h-[520px] animate-pulse rounded-xl border border-black/10 bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
