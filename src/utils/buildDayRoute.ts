import type { Reservation } from '../types/hotel'
import type { Activity } from '../types/itinerary'
import type { MapPlace } from '../types/map'
import type { OptimizedDayRoute, RouteLeg, TravelMode } from '../types/route'
import {
  estimateDurationMinutes,
  estimatesForAllModes,
  formatDuration,
  recommendTravelMode,
} from './estimateTravelTime'
import { haversineDistanceKm } from './haversine'
import { optimizeStopOrder } from './optimizeRoute'
import { resolveActivityLocation } from './resolveActivityLocation'

const DEFAULT_VISIT_MIN = 60
const DAY_START_HOUR = 9

const METRO_DESTINATION_IDS = new Set([
  'kyoto',
  'barcelona',
  'bali',
  'banff',
  'queenstown',
  'santorini',
])

interface BuildDayRouteInput {
  dayNumber: number
  activities: Activity[]
  aiMapPlaces: MapPlace[]
  reservations: Reservation[]
  anchor: { lat: number; lon: number }
  destinationId: string
}

function toTimeString(totalMinutesFromMidnight: number): string {
  const hours = Math.floor(totalMinutesFromMidnight / 60)
  const minutes = totalMinutesFromMidnight % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function buildDayRoute(input: BuildDayRouteInput): OptimizedDayRoute | null {
  const dayActivities = input.activities.filter(
    (activity) => activity.dayNumber === input.dayNumber,
  )

  if (dayActivities.length < 2) return null

  const located = dayActivities.map((activity, index) => {
    const location = resolveActivityLocation(activity, {
      aiMapPlaces: input.aiMapPlaces,
      reservations: input.reservations,
      anchor: input.anchor,
      index,
    })
    return {
      activityId: activity.id,
      title: activity.title,
      lat: location.lat,
      lon: location.lon,
      visitDurationMin: DEFAULT_VISIT_MIN,
    }
  })

  const hasMetro = METRO_DESTINATION_IDS.has(input.destinationId)
  const { ordered, clusters, originalDistanceKm, optimizedDistanceKm } =
    optimizeStopOrder(located, input.anchor)

  const legs: RouteLeg[] = []
  const totalsByMode: Record<TravelMode, number> = {
    walking: 0,
    driving: 0,
    metro: 0,
    taxi: 0,
  }

  let cursorMin = DAY_START_HOUR * 60
  const stopsWithTimes = ordered.map((stop, index) => {
    if (index > 0) {
      const prev = ordered[index - 1]
      const distanceKm = haversineDistanceKm(
        prev.lat,
        prev.lon,
        stop.lat,
        stop.lon,
      )
      const estimates = estimatesForAllModes(distanceKm)
      const recommendedMode = recommendTravelMode(distanceKm, hasMetro)

      legs.push({
        fromStopId: prev.activityId,
        toStopId: stop.activityId,
        distanceKm,
        estimates,
        recommendedMode,
      })

      const travelMin = estimateDurationMinutes(distanceKm, recommendedMode)
      cursorMin += travelMin
    }

    const suggestedTime = toTimeString(cursorMin)
    cursorMin += stop.visitDurationMin

    return { ...stop, suggestedTime }
  })

  const visitTotal = stopsWithTimes.reduce(
    (sum, stop) => sum + stop.visitDurationMin,
    0,
  )
  for (const mode of ['walking', 'driving', 'metro', 'taxi'] as TravelMode[]) {
    totalsByMode[mode] =
      visitTotal +
      legs.reduce((sum, leg) => {
        const estimate = leg.estimates.find((item) => item.mode === mode)
        return sum + (estimate?.durationMin ?? 0)
      }, 0)
  }

  const recommendedTotalMin =
    visitTotal +
    legs.reduce(
      (sum, leg) =>
        sum +
        estimateDurationMinutes(leg.distanceKm, leg.recommendedMode),
      0,
    )

  return {
    dayNumber: input.dayNumber,
    stops: stopsWithTimes,
    legs,
    clusters,
    totalDistanceKm: optimizedDistanceKm,
    originalDistanceKm,
    savedDistanceKm: Math.max(0, originalDistanceKm - optimizedDistanceKm),
    totalsByMode,
    recommendedTotalMin,
  }
}

export function formatRouteSummary(route: OptimizedDayRoute): string {
  return `${route.stops.length} stops · ${route.clusters} groups · saves ${route.savedDistanceKm.toFixed(1)} km · ~${formatDuration(route.recommendedTotalMin)}`
}
