import type { Activity } from '../types/itinerary'

/** Sorts activities by time ascending; items without a time appear last. */
export function sortActivitiesByTime(items: Activity[]): Activity[] {
  return [...items].sort((a, b) => {
    if (!a.time && !b.time) return 0
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time.localeCompare(b.time)
  })
}
