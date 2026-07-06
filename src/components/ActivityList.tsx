import { useMemo, useState } from 'react'
import type { Activity } from '../types/itinerary'
import { focusRingOnParchment } from '../utils/a11y'
import { sortActivitiesByTime } from '../utils/sortActivitiesByTime'

interface ActivityListProps {
  activities: Activity[]
  onRemove: (id: string) => void
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
}: ActivityListProps) {
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())

  const sorted = useMemo(() => sortActivitiesByTime(activities), [activities])

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

  if (sorted.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-parchment/25 px-4 py-12 text-center sm:px-6">
        <p className="font-display text-xl text-parchment">
          Nothing planned yet
        </p>
        <p className="mt-2 max-w-xs text-sm text-parchment/75">
          Add your first stop — a café, museum, hike, or lazy afternoon counts.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3" aria-label="Day activities">
      {sorted.map((activity, index) => {
        const isExiting = exitingIds.has(activity.id)

        return (
          <li
            key={activity.id}
            className={isExiting ? 'animate-list-out' : 'animate-card-in'}
            style={isExiting ? undefined : { animationDelay: `${index * 50}ms` }}
          >
            <article className="group flex gap-3 rounded-2xl bg-parchment p-4 text-ink shadow-sm motion-safe:transition-shadow motion-safe:hover:shadow-md sm:gap-4">
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
                </div>
                {activity.notes && (
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">
                    {activity.notes}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemove(activity.id)}
                className={`shrink-0 self-start rounded-lg p-2 text-ink/50 transition-colors hover:bg-rust/10 hover:text-rust ${focusRingOnParchment}`}
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
