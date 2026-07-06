import type { TravelMode, TravelModeEstimate } from '../types/route'
import { TRAVEL_MODE_LABELS } from '../types/route'

/** Average speeds in km/h including stops / transfers. */
const MODE_SPEED_KMH: Record<TravelMode, number> = {
  walking: 4.8,
  driving: 28,
  metro: 22,
  taxi: 24,
}

const MODE_BUFFER_MIN: Record<TravelMode, number> = {
  walking: 0,
  driving: 3,
  metro: 5,
  taxi: 4,
}

export function estimateDurationMinutes(
  distanceKm: number,
  mode: TravelMode,
): number {
  if (distanceKm <= 0) return 0
  const hours = distanceKm / MODE_SPEED_KMH[mode]
  return Math.max(1, Math.round(hours * 60 + MODE_BUFFER_MIN[mode]))
}

export function estimatesForAllModes(distanceKm: number): TravelModeEstimate[] {
  const modes: TravelMode[] = ['walking', 'driving', 'metro', 'taxi']
  return modes.map((mode) => ({
    mode,
    label: TRAVEL_MODE_LABELS[mode],
    durationMin: estimateDurationMinutes(distanceKm, mode),
  }))
}

export function recommendTravelMode(
  distanceKm: number,
  hasMetro: boolean,
): TravelMode {
  if (distanceKm < 1.2) return 'walking'
  if (distanceKm < 4.5 && hasMetro) return 'metro'
  if (distanceKm < 10) return 'taxi'
  return 'driving'
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}
