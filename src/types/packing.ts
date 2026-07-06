export const PACKING_CATEGORY_IDS = [
  'documents',
  'clothing',
  'electronics',
  'medicine',
  'accessories',
  'essentials',
] as const

export type PackingCategory = (typeof PACKING_CATEGORY_IDS)[number]

export type TravelMonth =
  | 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december'

export type PackingWeather =
  | 'sunny'
  | 'rainy'
  | 'cold'
  | 'hot'
  | 'mixed'

export type PackingTripType =
  | 'leisure'
  | 'business'
  | 'adventure'
  | 'backpacking'
  | 'family'

export type PackingActivity =
  | 'hiking'
  | 'beach'
  | 'dining'
  | 'nightlife'
  | 'sightseeing'
  | 'skiing'
  | 'photography'

export interface PackingRequest {
  destination: string
  travelMonth: TravelMonth | null
  weather: PackingWeather | null
  tripType: PackingTripType | null
  activities: PackingActivity[]
}

export interface PackingItem {
  id: string
  label: string
  category: PackingCategory
  checked: boolean
}

export interface PackingChecklist {
  items: PackingItem[]
  generatedAt: string
  source: 'ai' | 'local'
}

export type PackingListByCategory = Record<PackingCategory, string[]>
