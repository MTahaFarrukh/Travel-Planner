export type DestinationCategory =
  | 'beach'
  | 'city'
  | 'mountain'
  | 'cultural'
  | 'adventure'

export interface Destination {
  id: string
  name: string
  country: string
  category: DestinationCategory
  tagline: string
  imageUrl: string
  lat: number
  lon: number
}

export interface WeatherData {
  temperature?: number
  unit?: 'C' | 'F'
  condition?: string
  icon?: string
}

export interface CurrentWeather {
  temperature: number
  unit: 'C' | 'F'
  weatherCode: number
  condition: string
  icon: string
}

export interface DailyForecast {
  date: string
  tempMax: number
  tempMin: number
  weatherCode: number
  condition: string
  icon: string
}

export interface WeatherForecast {
  current: CurrentWeather
  daily: DailyForecast[]
}
