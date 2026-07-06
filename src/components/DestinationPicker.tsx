import { destinations } from '../data/destinations.js'
import type { Destination } from '../types/destination'
import { focusRingOnInk } from '../utils/a11y'

interface DestinationPickerProps {
  selectedId: string
  onSelect: (destination: Destination) => void
}

export default function DestinationPicker({
  selectedId,
  onSelect,
}: DestinationPickerProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="radiogroup"
      aria-label="Select destination"
    >
      {destinations.map((destination) => {
        const isSelected = destination.id === selectedId

        return (
          <button
            key={destination.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(destination)}
            className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:scale-[1.03] motion-safe:active:scale-95 ${focusRingOnInk} ${
              isSelected
                ? 'animate-chip-pop bg-brass text-ink'
                : 'border border-parchment/20 text-parchment/80 hover:border-brass/40 hover:text-parchment'
            }`}
          >
            {destination.name}
          </button>
        )
      })}
    </div>
  )
}
