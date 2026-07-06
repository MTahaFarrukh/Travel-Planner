export type AttractionCategory =
  | 'cultural'
  | 'nature'
  | 'food'
  | 'adventure'
  | 'shopping'
  | 'beach'

export interface Attraction {
  id: string
  destinationId: string
  name: string
  description: string
  category: AttractionCategory
  rating: number
  imageUrl: string
  lat: number
  lon: number
}

export interface AttractionWithDistance extends Attraction {
  distanceKm: number
}
