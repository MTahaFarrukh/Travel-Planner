import type { RouteLeg } from '../../types/route'
import { TRAVEL_MODE_LABELS } from '../../types/route'
import { formatDuration } from '../../utils/estimateTravelTime'
import { formatDistanceKm } from '../../utils/haversine'
import TravelModeDisplay from './TravelModeDisplay'

interface RouteLegCardProps {
  leg: RouteLeg
  fromTitle: string
  toTitle: string
  expanded?: boolean
}

export default function RouteLegCard({
  leg,
  fromTitle,
  toTitle,
  expanded = false,
}: RouteLegCardProps) {
  const recommended = leg.estimates.find(
    (estimate) => estimate.mode === leg.recommendedMode,
  )

  return (
    <div
      className="rounded-xl border border-dashed border-teal/30 bg-teal/5 px-3 py-2.5"
      aria-label={`Travel from ${fromTitle} to ${toTitle}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="font-mono uppercase tracking-wider text-teal">
          {formatDistanceKm(leg.distanceKm)}
        </span>
        <span className="text-parchment/50" aria-hidden="true">
          ·
        </span>
        <span className="font-mono text-parchment/80">
          Best: {TRAVEL_MODE_LABELS[leg.recommendedMode]}{' '}
          {recommended ? `(${formatDuration(recommended.durationMin)})` : ''}
        </span>
      </div>

      {expanded && (
        <div className="mt-3">
          <TravelModeDisplay
            estimates={leg.estimates}
            recommendedMode={leg.recommendedMode}
            compact
          />
        </div>
      )}
    </div>
  )
}
