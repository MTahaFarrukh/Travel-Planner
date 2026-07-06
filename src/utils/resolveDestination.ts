import { destinations } from '../data/destinations.js'
import type { Destination } from '../types/destination'

export function resolveDestination(query: string): Destination | null {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return null

  const exact = destinations.find(
    (destination) =>
      `${destination.name}, ${destination.country}`.toLowerCase() ===
      normalized,
  )
  if (exact) return exact

  return (
    destinations.find(
      (destination) =>
        normalized.includes(destination.name.toLowerCase()) ||
        normalized.includes(destination.country.toLowerCase()),
    ) ?? null
  )
}

export function resolveDestinationById(id: string): Destination | null {
  return destinations.find((destination) => destination.id === id) ?? null
}

/** Spread markers around a center so they remain visible when colocated. */
export function spiralOffset(index: number): { lat: number; lon: number } {
  const angle = index * 1.2
  const radius = 0.012 + index * 0.004
  return {
    lat: Math.sin(angle) * radius,
    lon: Math.cos(angle) * radius,
  }
}
