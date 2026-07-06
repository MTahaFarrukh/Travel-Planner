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

export interface UseWeatherResult {
  data: WeatherForecast | null
  loading: boolean
  error: string | null
}

export declare function useWeather(
  lat: number | null | undefined,
  lon: number | null | undefined,
): UseWeatherResult
