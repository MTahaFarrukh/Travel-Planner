import type { BudgetBreakdown } from './budget'
import type { Reservation } from './hotel'
import type { Activity } from './itinerary'
import type { MapPlace } from './map'
import type { PackingCategory, PackingItem } from './packing'

export interface GuideWeatherDay {
  date: string
  condition: string
  tempMin: number
  tempMax: number
  icon: string
}

export interface GuideWeather {
  currentTemp: number
  currentCondition: string
  daily: GuideWeatherDay[]
}

export interface EmergencyContact {
  label: string
  value: string
  icon: 'police' | 'medical' | 'embassy' | 'general'
}

export interface PackingGroup {
  category: PackingCategory
  label: string
  items: PackingItem[]
}

export interface TravelGuideData {
  destinationName: string
  country: string
  tagline: string
  generatedAt: string
  tripLength: number
  activityCount: number
  reservationCount: number
  activitiesByDay: Record<number, Activity[]>
  reservations: Reservation[]
  budget: BudgetBreakdown
  budgetLimit: number
  budgetTotal: number
  weather: GuideWeather | null
  packingGroups: PackingGroup[]
  aiPlaces: MapPlace[]
  travelTips: string[]
  emergencyContacts: EmergencyContact[]
}
