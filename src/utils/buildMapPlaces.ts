import type { Reservation } from '../types/hotel'
import type { Activity } from '../types/itinerary'
import type { MapPlace } from '../types/map'
import {
  resolveDestination,
  resolveDestinationById,
  spiralOffset,
} from './resolveDestination'

interface BuildMapPlacesInput {
  activities: Activity[]
  reservations: Reservation[]
  aiMapPlaces: MapPlace[]
  aiTripDestination: string | null
}

function formatActivityTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function resolveAnchor(
  reservations: Reservation[],
  aiTripDestination: string | null,
): { lat: number; lon: number } | null {
  if (aiTripDestination) {
    const fromAi = resolveDestination(aiTripDestination)
    if (fromAi) return { lat: fromAi.lat, lon: fromAi.lon }
  }

  if (reservations.length > 0) {
    const fromReservation = resolveDestinationById(reservations[0].destinationId)
    if (fromReservation) {
      return { lat: fromReservation.lat, lon: fromReservation.lon }
    }
    const fromName = resolveDestination(reservations[0].destinationName)
    if (fromName) return { lat: fromName.lat, lon: fromName.lon }
  }

  return null
}

function buildActivityPlaces(
  activities: Activity[],
  anchor: { lat: number; lon: number },
): MapPlace[] {
  return activities.map((activity, index) => {
    const offset = spiralOffset(index + 2)
    return {
      id: `activity-${activity.id}`,
      name: activity.title,
      description:
        activity.notes ??
        `Planned stop on day ${activity.dayNumber} of your Waymark itinerary.`,
      estimatedTime: activity.time
        ? formatActivityTime(activity.time)
        : `Day ${activity.dayNumber}`,
      lat: anchor.lat + offset.lat,
      lon: anchor.lon + offset.lon,
      dayNumber: activity.dayNumber,
    }
  })
}

function buildReservationPlaces(reservations: Reservation[]): MapPlace[] {
  return reservations.flatMap((reservation, index) => {
    const destination =
      resolveDestinationById(reservation.destinationId) ??
      resolveDestination(reservation.destinationName)
    if (!destination) return []

    const offset = spiralOffset(index)
    return [
      {
        id: `hotel-${reservation.id}`,
        name: reservation.hotelName,
        description: `Confirmed stay in ${reservation.destinationName} · ${reservation.checkIn} → ${reservation.checkOut}`,
        estimatedTime: 'Check-in 3:00 PM',
        lat: destination.lat + offset.lat * 0.6,
        lon: destination.lon + offset.lon * 0.6,
      },
    ]
  })
}

export function buildMapPlaces({
  activities,
  reservations,
  aiMapPlaces,
  aiTripDestination,
}: BuildMapPlacesInput): MapPlace[] {
  const merged = new Map<string, MapPlace>()

  for (const place of aiMapPlaces) {
    merged.set(place.id, place)
  }

  const anchor = resolveAnchor(reservations, aiTripDestination)
  if (anchor) {
    for (const place of buildActivityPlaces(activities, anchor)) {
      merged.set(place.id, place)
    }
  }

  for (const place of buildReservationPlaces(reservations)) {
    merged.set(place.id, place)
  }

  return Array.from(merged.values())
}
