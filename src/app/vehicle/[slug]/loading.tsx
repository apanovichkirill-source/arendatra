export default function VehicleLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 h-4 w-32 animate-pulse rounded bg-gray-100" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="aspect-[16/9] animate-pulse rounded-xl bg-gray-100" />
          <div className="mt-4 h-7 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-100" />
          <div className="mt-6 h-32 animate-pulse rounded-xl border border-black/10 bg-white" />
        </div>
        <div className="h-96 animate-pulse rounded-xl border border-black/10 bg-white" />
      </div>
    </div>
  );
}
