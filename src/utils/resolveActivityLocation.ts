import { attractions } from '../data/attractions.js'
import type { Reservation } from '../types/hotel'
import type { Activity } from '../types/itinerary'
import type { MapPlace } from '../types/map'
import { spiralOffset } from './resolveDestination'

export interface ResolvedLocation {
  lat: number
  lon: number
  source: 'attraction' | 'ai' | 'hotel' | 'estimated'
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase()
}

function matchByName(title: string, name: string): boolean {
  const a = normalizeName(title)
  const b = normalizeName(name)
  return a === b || a.includes(b) || b.includes(a)
}

export function resolveActivityLocation(
  activity: Activity,
  options: {
    aiMapPlaces: MapPlace[]
    reservations: Reservation[]
    anchor: { lat: number; lon: number }
    index: number
  },
): ResolvedLocation {
  const attraction = attractions.find((item) =>
    matchByName(activity.title, item.name),
  )
  if (attraction) {
    return {
      lat: attraction.lat,
      lon: attraction.lon,
      source: 'attraction',
    }
  }

  const aiPlace = options.aiMapPlaces.find((place) =>
    matchByName(activity.title, place.name),
  )
  if (aiPlace) {
    return { lat: aiPlace.lat, lon: aiPlace.lon, source: 'ai' }
  }

  if (activity.type === 'accommodation' || activity.title.startsWith('Hotel stay:')) {
    const hotelName = activity.title.replace(/^Hotel stay:\s*/i, '').trim()
    const reservation = options.reservations.find(
      (item) =>
        item.id === activity.linkedReservationId ||
        matchByName(hotelName, item.hotelName),
    )
    if (reservation) {
      const offset = spiralOffset(0)
      const fromReservation = options.aiMapPlaces.find((p) =>
        p.name.includes(reservation.hotelName),
      )
      if (fromReservation) {
        return {
          lat: fromReservation.lat,
          lon: fromReservation.lon,
          source: 'hotel',
        }
      }
      return {
        lat: options.anchor.lat + offset.lat * 0.4,
        lon: options.anchor.lon + offset.lon * 0.4,
        source: 'hotel',
      }
    }
  }

  const offset = spiralOffset(options.index + 2)
  return {
    lat: options.anchor.lat + offset.lat,
    lon: options.anchor.lon + offset.lon,
    source: 'estimated',
  }
}
