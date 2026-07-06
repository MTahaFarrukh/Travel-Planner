import type { DestinationCategory } from '../types/destination'
import { focusRingOnInk } from '../utils/a11y'

interface CategoryFilterProps {
  categories: readonly DestinationCategory[]
  selected: DestinationCategory | null
  onSelect: (category: DestinationCategory | null) => void
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by category"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:scale-[1.03] motion-safe:active:scale-95 ${focusRingOnInk} ${
          selected === null
            ? 'animate-chip-pop bg-brass text-ink'
            : 'border border-parchment/20 text-parchment/80 hover:border-brass/40 hover:text-parchment'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(selected === category ? null : category)}
          className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:scale-[1.03] motion-safe:active:scale-95 ${focusRingOnInk} ${
            selected === category
              ? 'animate-chip-pop bg-brass text-ink'
              : 'border border-parchment/20 text-parchment/80 hover:border-brass/40 hover:text-parchment'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
