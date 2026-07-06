import { useMemo, useState } from 'react'
import type { Activity } from '../types/itinerary'
import type { OptimizedDayRoute, RouteLeg } from '../types/route'
import { focusRingOnParchment } from '../utils/a11y'
import RouteLegCard from './itinerary/RouteLegCard'
import EmptyState from './EmptyState'

interface ActivityListProps {
  activities: Activity[]
  onRemove: (id: string) => void
  route?: OptimizedDayRoute | null
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function ActivityList({
  activities,
  onRemove,
  route = null,
}: ActivityListProps) {
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())

  const displayActivities = useMemo((): Activity[] => {
    if (!route) return activities

    const orderMap = new Map(
      route.stops.map((stop) => [stop.activityId, stop]),
    )
    const ordered: Activity[] = []
    for (const stop of route.stops) {
      const activity = activities.find((item) => item.id === stop.activityId)
      if (!activity) continue
      ordered.push({
        ...activity,
        time: stop.suggestedTime ?? activity.time,
      })
    }

    const missing = activities.filter((activity) => !orderMap.has(activity.id))
    return [...ordered, ...missing]
  }, [activities, route])

  const legByToId = useMemo(() => {
    if (!route) return new Map<string, RouteLeg>()
    return new Map(route.legs.map((leg) => [leg.toStopId, leg]))
  }, [route])

  const stopMeta = useMemo(() => {
    if (!route) return new Map<string, OptimizedDayRoute['stops'][number]>()
    return new Map(route.stops.map((stop) => [stop.activityId, stop]))
  }, [route])

  function handleRemove(id: string) {
    setExitingIds((prev) => new Set(prev).add(id))
    window.setTimeout(() => {
      onRemove(id)
      setExitingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 200)
  }

  if (displayActivities.length === 0) {
    return (
      <EmptyState
        title="Nothing planned yet"
        description="Add your first stop — a café, museum, hike, or lazy afternoon counts."
      />
    )
  }

  return (
    <ul className="space-y-3" aria-label="Day activities">
      {displayActivities.map((activity, index) => {
        const isExiting = exitingIds.has(activity.id)
        const meta = stopMeta.get(activity.id)
        const leg = legByToId.get(activity.id)
        const prevActivity =
          index > 0 ? displayActivities[index - 1] : undefined

        return (
          <li key={activity.id}>
            {leg && prevActivity && (
              <div className="mb-3">
                <RouteLegCard
                  leg={leg}
                  fromTitle={prevActivity.title}
                  toTitle={activity.title}
                  expanded
                />
              </div>
            )}

            <article
              className={`group flex flex-col gap-3 rounded-2xl bg-parchment p-4 text-ink shadow-sm motion-safe:transition-shadow motion-safe:hover:shadow-md sm:flex-row sm:gap-4 ${
                isExiting ? 'animate-list-out' : 'animate-card-in'
              }`}
              style={isExiting ? undefined : { animationDelay: `${index * 50}ms` }}
            >
              <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
              {meta && (
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-sm font-bold text-parchment"
                  aria-label={`Route stop ${meta.order}`}
                >
                  {meta.order}
                </span>
              )}

              {activity.time ? (
                <time
                  dateTime={activity.time}
                  className="shrink-0 font-mono text-sm font-medium text-teal"
                >
                  {formatTime(activity.time)}
                </time>
              ) : (
                <span
                  className="shrink-0 font-mono text-sm text-ink/50"
                  aria-label="No time set"
                >
                  ——
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {activity.title}
                  </h3>
                  {activity.type === 'accommodation' && (
                    <span className="rounded-full bg-brass/20 px-2 py-0.5 font-mono text-xs text-brass">
                      Hotel stay
                    </span>
                  )}
                  {meta && route && route.clusters > 1 && (
                    <span className="rounded-full bg-teal/15 px-2 py-0.5 font-mono text-xs text-teal">
                      Group {meta.clusterId + 1}
                    </span>
                  )}
                </div>
                {activity.notes && (
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">
                    {activity.notes}
                  </p>
                )}
              </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(activity.id)}
                className={`self-end rounded-lg p-2 text-ink/50 motion-safe:transition-colors hover:bg-rust/10 hover:text-rust sm:self-start ${focusRingOnParchment}`}
                aria-label={`Remove ${activity.title}`}
              >
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
