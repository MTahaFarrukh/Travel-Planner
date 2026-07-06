import { focusRingOnInk } from '../utils/a11y'

interface DaySelectorProps {
  tripLength: number
  selectedDay: number
  onSelectDay: (day: number) => void
}

export default function DaySelector({
  tripLength,
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  const days = Array.from({ length: tripLength }, (_, i) => i + 1)

  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Select day"
    >
      {days.map((day) => (
        <button
          key={day}
          type="button"
          role="tab"
          aria-selected={selectedDay === day}
          onClick={() => onSelectDay(day)}
          className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:scale-[1.03] motion-safe:active:scale-95 sm:px-5 ${focusRingOnInk} ${
            selectedDay === day
              ? 'animate-chip-pop bg-brass text-ink'
              : 'border border-parchment/20 text-parchment/80 hover:border-brass/40 hover:text-parchment'
          }`}
        >
          Day {day}
        </button>
      ))}
    </div>
  )
}
