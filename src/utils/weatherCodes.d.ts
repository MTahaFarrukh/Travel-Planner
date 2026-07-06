export interface MappedWeather {
  label: string
  icon: string
  category: string
}

export function mapWeatherCode(code: number): MappedWeather
