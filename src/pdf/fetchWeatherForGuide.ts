import { mapWeatherCode } from '../utils/weatherCodes.js'
import type { GuideWeather } from '../types/travelGuide'

export async function fetchWeatherForGuide(
  lat: number,
  lon: number,
): Promise<GuideWeather | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'temperature_2m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code',
      timezone: 'auto',
      forecast_days: '5',
    })

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
    )
    if (!response.ok) return null

    const json = (await response.json()) as {
      current: { temperature_2m: number; weather_code: number }
      daily: {
        time: string[]
        temperature_2m_max: number[]
        temperature_2m_min: number[]
        weather_code: number[]
      }
    }

    const currentMapped = mapWeatherCode(json.current.weather_code)

    return {
      currentTemp: Math.round(json.current.temperature_2m),
      currentCondition: currentMapped.label,
      daily: json.daily.time.map((date, index) => {
        const mapped = mapWeatherCode(json.daily.weather_code[index])
        return {
          date,
          condition: mapped.label,
          tempMin: Math.round(json.daily.temperature_2m_min[index]),
          tempMax: Math.round(json.daily.temperature_2m_max[index]),
          icon: mapped.icon,
        }
      }),
    }
  } catch {
    return null
  }
}
