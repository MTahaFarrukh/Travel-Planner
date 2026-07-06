export type TravelStyle =
  | 'luxury'
  | 'budget'
  | 'family'
  | 'adventure'
  | 'solo'

export type TripInterest =
  | 'food'
  | 'nature'
  | 'museums'
  | 'shopping'
  | 'beaches'
  | 'nightlife'
  | 'hiking'
  | 'photography'

export interface TripRequest {
  destination: string
  days: number
  budget: number
  travelStyle: TravelStyle | null
  interests: TripInterest[]
}

export interface TripPlannerState {
  prompt: string | null
  result: string | null
  loading: boolean
  error: string | null
}
