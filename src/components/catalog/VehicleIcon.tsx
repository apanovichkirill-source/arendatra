import type { CategoryGroup } from "@prisma/client";

export function VehicleIcon({
  group,
  className = "h-10 w-10",
}: {
  group: CategoryGroup;
  className?: string;
}) {
  if (group === "LIFTING") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path
          d="M3 20h13M7 20V5m0 0 12 5h-8M18 10v6.5M18 16.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM4.5 20v-3.5a1.5 1.5 0 0 1 1.5-1.5h2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (group === "EARTHMOVING") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path
          d="M3 20h4m0 0a2 2 0 1 0 4 0m-4 0h6m6 0a2 2 0 1 1-4 0m4 0h1.5M3 20v-3a1 1 0 0 1 1-1h6v-3.2c0-.5.3-.9.7-1.1l3-1.5c.5-.2 1 .1 1 .7v3.6l3.5 1.6c.5.2.8.7.8 1.3V20"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.7 10.1 18 6.5m0 0h-2.3M18 6.5v2.3"
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
