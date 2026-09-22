"use client";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  // понедельник = 0
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export function AvailabilityCalendar({
  bookedRanges,
  monthsAhead = 2,
  selectedStart,
  selectedEnd,
  onSelectDay,
}: {
  bookedRanges: { startAt: string; endAt: string }[];
  monthsAhead?: number;
  selectedStart?: Date | null;
  selectedEnd?: Date | null;
  onSelectDay?: (day: Date) => void;
}) {
  const today = startOfDay(new Date());
  const ranges = bookedRanges.map((r) => ({ start: new Date(r.startAt), end: new Date(r.endAt) }));

  function isBooked(day: Date) {
    const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    return ranges.some((r) => r.start < dayEnd && r.end > day);
  }

  function isInSelection(day: Date) {
    if (!selectedStart) return false;
    const end = selectedEnd ?? selectedStart;
    return day >= startOfDay(selectedStart) && day <= startOfDay(end);
  }

  const months = Array.from({ length: monthsAhead }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {months.map(({ year, month }) => (
        <div key={`${year}-${month}`}>
          <p className="mb-2 text-center text-sm font-semibold text-brand-navy">
            {MONTH_NAMES[month]} {year}
          </p>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {buildMonthGrid(year, month).map((day, idx) => {
              if (!day) return <span key={idx} />;
              const past = day < today;
              const booked = !past && isBooked(day);
              const selected = !past && !booked && isInSelection(day);
              const disabled = past || booked;

              return (
                <button
                  type="button"
                  key={idx}
                  disabled={disabled}
                  onClick={() => onSelectDay?.(day)}
                  title={booked ? "Занято" : undefined}
                  className={[
                    "aspect-square rounded-md text-xs transition",
                    disabled
                      ? booked
                        ? "bg-red-50 text-red-300 line-through cursor-not-allowed"
                        : "text-gray-300 cursor-not-allowed"
                      : selected
                        ? "bg-brand-blue text-white font-semibold"
                        : "hover:bg-brand-blue-light text-gray-700 cursor-pointer",
                  ].join(" ")}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="col-span-full flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-50" /> занято
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-brand-blue" /> выбрано
        </span>
      </div>
    </div>
  );
}
