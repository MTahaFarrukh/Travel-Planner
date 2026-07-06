import type { Destination } from '../../types/destination'
import type { OptimizedDayRoute, TravelMode } from '../../types/route'
import { TRAVEL_MODE_LABELS } from '../../types/route'
import { formatDuration } from '../../utils/estimateTravelTime'
import { formatDistanceKm } from '../../utils/haversine'
import { formatRouteSummary } from '../../utils/buildDayRoute'
import { focusRingOnInk } from '../../utils/a11y'
import EmptyState from '../EmptyState'
import LoadingOverlay from '../LoadingOverlay'
import ItineraryRouteMap from './ItineraryRouteMap'
import TravelModeDisplay from './TravelModeDisplay'

interface ItineraryOptimizerPanelProps {
  destination: Destination
  route: OptimizedDayRoute | null
  canOptimize: boolean
  applied: boolean
  optimizing?: boolean
  onOptimize: () => void
  onApply: () => void
}

export default function ItineraryOptimizerPanel({
  destination,
  route,
  canOptimize,
  applied,
  optimizing = false,
  onOptimize,
  onApply,
}: ItineraryOptimizerPanelProps) {
  if (!canOptimize) {
    return (
      <EmptyState
        className="mt-8"
        title="Add at least two stops to optimize your route"
        description="Waymark will group nearby attractions, reorder them to cut travel time, and estimate walking, driving, metro, and taxi durations."
        icon={
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.947L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A2 2 0 0021 17.382V8.618a2 2 0 00-1.553-1.947L15 4m0 13V4M9 7h6" />
          </svg>
        }
      />
    )
  }

  const recommendedModes = route
    ? route.legs.reduce(
        (counts, leg) => {
          counts[leg.recommendedMode] += 1
          return counts
        },
        { walking: 0, driving: 0, metro: 0, taxi: 0 },
      )
    : null

  const dominantMode: TravelMode | undefined = recommendedModes
    ? (Object.entries(recommendedModes).sort((a, b) => b[1] - a[1])[0]?.[0] as
        | TravelMode
        | undefined)
    : undefined

  return (
    <section
      className="mt-8 rounded-2xl border border-parchment/10 bg-parchment/5 p-5 sm:p-6"
      aria-labelledby="route-optimizer-heading"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Route optimizer
          </p>
          <h2
            id="route-optimizer-heading"
            className="mt-1 font-display text-2xl font-semibold text-parchment"
          >
            Smart day routing
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-parchment/75">
            Groups nearby places, reorders stops to reduce travel, and estimates
            time for walking, driving, metro, and taxi.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOptimize}
            disabled={optimizing}
            aria-busy={optimizing}
            className={`rounded-xl border border-parchment/25 px-5 py-3 font-mono text-xs uppercase tracking-widest text-parchment motion-safe:transition-colors hover:border-teal/50 hover:bg-teal/10 disabled:cursor-wait disabled:opacity-70 ${focusRingOnInk}`}
          >
            {optimizing ? 'Optimizing…' : route ? 'Re-optimize' : 'Optimize route'}
          </button>
          {route && (
            <button
              type="button"
              onClick={onApply}
              disabled={applied}
              className={`rounded-xl bg-brass px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink motion-safe:transition-colors hover:bg-brass/90 disabled:cursor-default disabled:opacity-60 ${focusRingOnInk}`}
            >
              {applied ? 'Applied to schedule' : 'Apply to itinerary'}
            </button>
          )}
        </div>
      </div>

      {route && (
        <div className="relative mt-6 space-y-6">
          {optimizing && <LoadingOverlay label="Optimizing route…" />}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Stops"
              value={String(route.stops.length)}
            />
            <StatCard
              label="Nearby groups"
              value={String(route.clusters)}
            />
            <StatCard
              label="Distance saved"
              value={formatDistanceKm(route.savedDistanceKm)}
            />
            <StatCard
              label="Day total"
              value={formatDuration(route.recommendedTotalMin)}
              hint={
                dominantMode
                  ? `Mostly ${TRAVEL_MODE_LABELS[dominantMode]}`
                  : undefined
              }
            />
          </div>

          <p className="font-mono text-xs text-parchment/70">
            {formatRouteSummary(route)}
          </p>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-parchment/70">
              Total day time by mode
            </p>
            <TravelModeDisplay
              estimates={(
                ['walking', 'driving', 'metro', 'taxi'] as const
              ).map((mode) => ({
                mode,
                label: TRAVEL_MODE_LABELS[mode],
                durationMin: route.totalsByMode[mode],
              }))}
              recommendedMode={dominantMode}
            />
          </div>

          <ItineraryRouteMap route={route} destination={destination} />
        </div>
      )}
    </section>
  )
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-parchment/10 bg-ink/20 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-parchment/60">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-semibold text-parchment">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-parchment/60">{hint}</p>
      )}
    </div>
  )
}
