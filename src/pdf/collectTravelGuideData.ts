import { destinations } from '../data/destinations.js'
import { PACKING_CATEGORY_IDS } from '../types/packing'
import type { BudgetBreakdown } from '../types/budget'
import type { Reservation } from '../types/hotel'
import type { Activity } from '../types/itinerary'
import type { MapPlace } from '../types/map'
import type { PackingChecklist } from '../types/packing'
import type { TravelGuideData } from '../types/travelGuide'
import { calculateBudgetTotal } from '../utils/budget'
import { loadBudgetOptimizerState } from '../utils/budgetOptimizerStorage'
import { resolveDestination } from '../utils/resolveDestination'
import { sortActivitiesByTime } from '../utils/sortActivitiesByTime'
import { getEmergencyContacts } from './emergencyContacts'
import { buildTravelTips } from './travelTips'
import { PACKING_LABELS } from './theme'

const TRIP_LENGTH = 5

interface CollectInput {
  activities: Activity[]
  reservations: Reservation[]
  budget: BudgetBreakdown
  aiMapPlaces: MapPlace[]
  aiTripDestination: string | null
  packingChecklist: PackingChecklist | null
  weather?: TravelGuideData['weather']
}

function groupActivitiesByDay(activities: Activity[]) {
  const byDay: Record<number, Activity[]> = {}
  for (let day = 1; day <= TRIP_LENGTH; day += 1) {
    byDay[day] = sortActivitiesByTime(
      activities.filter((activity) => activity.dayNumber === day),
    )
  }
  return byDay
}

function resolveGuideDestination(
  aiTripDestination: string | null,
  reservations: Reservation[],
) {
  if (aiTripDestination) {
    const match = resolveDestination(aiTripDestination)
    if (match) return match
  }

  if (reservations.length > 0) {
    const fromReservation = destinations.find(
      (item) => item.id === reservations[0].destinationId,
    )
    if (fromReservation) return fromReservation
  }

  return destinations[0]
}

export function collectTravelGuideData(input: CollectInput): TravelGuideData {
  const destination = resolveGuideDestination(
    input.aiTripDestination,
    input.reservations,
  )
  const budgetLimit = loadBudgetOptimizerState().budgetLimit
  const activitiesByDay = groupActivitiesByDay(input.activities)

  const packingGroups = PACKING_CATEGORY_IDS.map((category) => ({
    category,
    label: PACKING_LABELS[category] ?? category,
    items:
      input.packingChecklist?.items.filter(
        (item) => item.category === category,
      ) ?? [],
  })).filter((group) => group.items.length > 0)

  return {
    destinationName: destination.name,
    country: destination.country,
    tagline: destination.tagline,
    generatedAt: new Date().toISOString(),
    tripLength: TRIP_LENGTH,
    activityCount: input.activities.length,
    reservationCount: input.reservations.length,
    activitiesByDay,
    reservations: input.reservations,
    budget: input.budget,
    budgetLimit,
    budgetTotal: calculateBudgetTotal(input.budget),
    weather: input.weather ?? null,
    packingGroups,
    aiPlaces: input.aiMapPlaces,
    travelTips: buildTravelTips(destination.category, input.aiMapPlaces),
    emergencyContacts: getEmergencyContacts(destination.country),
  }
}
