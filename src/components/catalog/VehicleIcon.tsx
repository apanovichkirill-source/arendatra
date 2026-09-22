import type { CategoryGroup } from "@prisma/client";

export function VehicleIcon({
  group,
  className = "h-10 w-10",
}: {
  group: CategoryGroup;
  className?: string;
}) {
  if (group === "SPECIAL") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path
          d="M2 16h2m0 0V9a1 1 0 0 1 1-1h5l3 4h4a2 2 0 0 1 2 2v2m-14 0h9m-9 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m5 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M9 8V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 16v-3.2a2 2 0 0 1 .38-1.17l1.72-2.4A2 2 0 0 1 7.72 8.4h8.56a2 2 0 0 1 1.62.83l1.72 2.4a2 2 0 0 1 .38 1.17V16M4 16a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 8 16m-4 0v-1.5h16V16m0 0a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 16 16m-8 0h8M6.5 13h1m9 0h1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
