import { useEffect, useState } from 'react'
import { mapWeatherCode } from '../utils/weatherCodes.js'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const CACHE_TTL_MS = 10 * 60 * 1000

/** @type {Map<string, { data: unknown; timestamp: number }>} */
const cache = new Map()

/** @type {Map<string, Promise<unknown>>} */
const inflight = new Map()

/**
 * @param {number} lat
 * @param {number} lon
 */
function cacheKey(lat, lon) {
  return `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`
}

/**
 * @param {number} lat
 * @param {number} lon
 */
function buildForecastUrl(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
    forecast_days: '5',
  })
  return `${FORECAST_URL}?${params}`
}

/**
 * @param {Record<string, unknown>} json
 */
function parseForecastResponse(json) {
  const current = /** @type {{ temperature_2m: number; weather_code: number }} */ (
    json.current
  )
  const daily = /** @type {{
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
  }} */ (json.daily)

  const currentMapped = mapWeatherCode(current.weather_code)

  return {
    current: {
      temperature: Math.round(current.temperature_2m),
      unit: 'C',
      weatherCode: current.weather_code,
      condition: currentMapped.label,
      icon: currentMapped.icon,
    },
    daily: daily.time.map((date, index) => {
      const code = daily.weather_code[index]
      const mapped = mapWeatherCode(code)
      return {
        date,
        tempMax: Math.round(daily.temperature_2m_max[index]),
        tempMin: Math.round(daily.temperature_2m_min[index]),
        weatherCode: code,
        condition: mapped.label,
        icon: mapped.icon,
      }
    }),
  }
}

/** Clears in-memory cache — intended for tests only. */
export function clearWeatherCache() {
  cache.clear()
  inflight.clear()
}

/**
 * @param {number} lat
 * @param {number} lon
 */
async function fetchWeather(lat, lon) {
  const key = cacheKey(lat, lon)

  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const pending = inflight.get(key)
  if (pending) return pending

  const promise = (async () => {
    const response = await fetch(buildForecastUrl(lat, lon))
    if (!response.ok) {
      throw new Error(`Weather unavailable (${response.status})`)
    }

    const json = await response.json()
    const data = parseForecastResponse(json)
    cache.set(key, { data, timestamp: Date.now() })
    return data
  })()

  inflight.set(key, promise)

  try {
    return await promise
  } finally {
    inflight.delete(key)
  }
}

/**
 * Fetches current weather and a 5-day forecast from Open-Meteo.
 * Results are cached in-memory for 10 minutes per coordinate pair.
 *
 * @param {number | null | undefined} lat
 * @param {number | null | undefined} lon
 * @returns {{ data: ReturnType<typeof parseForecastResponse> | null, loading: boolean, error: string | null }}
 */
export function useWeather(lat, lon) {
  const [data, setData] = useState(
    /** @type {ReturnType<typeof parseForecastResponse> | null} */ (null),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    if (lat == null || lon == null) {
      setData(null)
      setLoading(false)
      setError('Missing coordinates')
      return
    }

    let cancelled = false

    const key = cacheKey(lat, lon)
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setData(/** @type {ReturnType<typeof parseForecastResponse>} */ (cached.data))
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    fetchWeather(lat, lon)
      .then((result) => {
        if (!cancelled) {
          setData(/** @type {ReturnType<typeof parseForecastResponse>} */ (result))
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to load weather data',
          )
          setData(null)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [lat, lon])

  return { data, loading, error }
}
