export type TravelMode = 'walking' | 'driving' | 'metro' | 'taxi'

export interface TravelModeEstimate {
  mode: TravelMode
  durationMin: number
  label: string
}

export interface RouteStop {
  activityId: string
  title: string
  lat: number
  lon: number
  order: number
  clusterId: number
  visitDurationMin: number
  suggestedTime?: string
}

export interface RouteLeg {
  fromStopId: string
  toStopId: string
  distanceKm: number
  estimates: TravelModeEstimate[]
  recommendedMode: TravelMode
}

export interface OptimizedDayRoute {
  dayNumber: number
  stops: RouteStop[]
  legs: RouteLeg[]
  clusters: number
  totalDistanceKm: number
  originalDistanceKm: number
  savedDistanceKm: number
  totalsByMode: Record<TravelMode, number>
  recommendedTotalMin: number
}

export const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  walking: 'Walking',
  driving: 'Driving',
  metro: 'Metro',
  taxi: 'Taxi',
}

export const TRAVEL_MODE_ICONS: Record<TravelMode, string> = {
  walking: 'W',
  driving: 'D',
  metro: 'M',
  taxi: 'T',
}
