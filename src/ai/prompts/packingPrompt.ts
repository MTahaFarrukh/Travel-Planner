import {
  MONTH_OPTIONS,
  PACKING_ACTIVITY_OPTIONS,
  TRIP_TYPE_OPTIONS,
  WEATHER_OPTIONS,
} from '../../constants/packing'
import type { PackingRequest } from '../../types/packing'
import { PACKING_CATEGORY_IDS } from '../../types/packing'

function labelFor<T extends string>(
  options: { id: T; label: string }[],
  id: T | null,
): string {
  if (!id) return 'not specified'
  return options.find((option) => option.id === id)?.label ?? id
}

export function buildPackingPrompt(request: PackingRequest): string {
  const destination = request.destination.trim()
  const month = labelFor(MONTH_OPTIONS, request.travelMonth)
  const weather = labelFor(WEATHER_OPTIONS, request.weather)
  const tripType = labelFor(TRIP_TYPE_OPTIONS, request.tripType)
  const activities =
    request.activities.length > 0
      ? request.activities
          .map(
            (activity) =>
              PACKING_ACTIVITY_OPTIONS.find((option) => option.id === activity)
                ?.label ?? activity,
          )
          .join(', ')
      : 'general sightseeing'

  const categories = PACKING_CATEGORY_IDS.join(', ')

  return [
    'Create a smart, practical packing checklist for the following trip.',
    '',
    `Destination: ${destination}`,
    `Travel month: ${month}`,
    `Expected weather: ${weather}`,
    `Trip type: ${tripType}`,
    `Planned activities: ${activities}`,
    '',
    'Return ONLY valid JSON (no markdown fences) with exactly these keys:',
    categories,
    '',
    'Each key must be an array of 4–8 concise item strings tailored to this trip.',
    'Be specific to the destination climate, activities, and trip style.',
    'Do not repeat the same item across categories.',
    'Example shape:',
    '{"documents":["Passport","Travel insurance printout"],"clothing":["Light rain jacket"],"electronics":[],"medicine":[],"accessories":[],"essentials":[]}',
  ].join('\n')
}

export function validatePackingRequest(request: PackingRequest): string | null {
  if (!request.destination.trim()) return 'Please enter a destination.'
  if (!request.travelMonth) return 'Please select a travel month.'
  if (!request.weather) return 'Please select expected weather.'
  if (!request.tripType) return 'Please select a trip type.'
  return null
}
