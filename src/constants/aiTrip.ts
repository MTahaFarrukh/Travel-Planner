import type { TravelStyle, TripInterest } from '../types/aiTrip'

export interface SelectOption<T extends string> {
  id: T
  label: string
  description: string
}

export const TRAVEL_STYLE_OPTIONS: SelectOption<TravelStyle>[] = [
  { id: 'luxury', label: 'Luxury', description: 'Premium stays & fine dining' },
  { id: 'budget', label: 'Budget', description: 'Smart spending, max value' },
  { id: 'family', label: 'Family', description: 'Kid-friendly & relaxed pace' },
  { id: 'adventure', label: 'Adventure', description: 'Active & off the beaten path' },
  { id: 'solo', label: 'Solo', description: 'Independent & flexible' },
]

export const INTEREST_OPTIONS: SelectOption<TripInterest>[] = [
  { id: 'food', label: 'Food', description: 'Local cuisine & markets' },
  { id: 'nature', label: 'Nature', description: 'Parks, wildlife & scenery' },
  { id: 'museums', label: 'Museums', description: 'Art, history & culture' },
  { id: 'shopping', label: 'Shopping', description: 'Markets & boutiques' },
  { id: 'beaches', label: 'Beaches', description: 'Coastlines & water activities' },
  { id: 'nightlife', label: 'Nightlife', description: 'Bars, music & evenings out' },
  { id: 'hiking', label: 'Hiking', description: 'Trails & outdoor treks' },
  { id: 'photography', label: 'Photography', description: 'Scenic spots & golden hour' },
]

export const DEFAULT_TRIP_REQUEST = {
  destination: '',
  days: 5,
  budget: 2000,
  travelStyle: null as TravelStyle | null,
  interests: [] as TripInterest[],
}

export const MIN_TRIP_DAYS = 1
export const MAX_TRIP_DAYS = 30
export const MIN_TRIP_BUDGET = 100
