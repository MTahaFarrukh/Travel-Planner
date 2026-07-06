import type { TravelMode, TravelModeEstimate } from '../../types/route'
import { TRAVEL_MODE_ICONS, TRAVEL_MODE_LABELS } from '../../types/route'
import { formatDuration } from '../../utils/estimateTravelTime'

interface TravelModeDisplayProps {
  estimates: TravelModeEstimate[]
  recommendedMode?: TravelMode
  compact?: boolean
}

export default function TravelModeDisplay({
  estimates,
  recommendedMode,
  compact = false,
}: TravelModeDisplayProps) {
  return (
    <ul
      className={
        compact
          ? 'flex flex-wrap gap-2'
          : 'grid grid-cols-2 gap-2 sm:grid-cols-4'
      }
      aria-label="Travel time by mode"
    >
      {estimates.map((estimate) => {
        const isRecommended = estimate.mode === recommendedMode
        return (
          <li
            key={estimate.mode}
            className={`rounded-xl border px-3 py-2 ${
              isRecommended
                ? 'border-teal/50 bg-teal/10'
                : 'border-parchment/15 bg-parchment/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                  isRecommended
                    ? 'bg-teal text-parchment'
                    : 'bg-parchment/15 text-parchment/80'
                }`}
                aria-hidden="true"
              >
                {TRAVEL_MODE_ICONS[estimate.mode]}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-wider text-parchment/70">
                  {TRAVEL_MODE_LABELS[estimate.mode]}
                </p>
                <p
                  className={`font-mono text-sm ${
                    isRecommended ? 'font-semibold text-teal' : 'text-parchment'
                  }`}
                >
                  {formatDuration(estimate.durationMin)}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
