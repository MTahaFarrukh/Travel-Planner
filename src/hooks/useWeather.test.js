import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearWeatherCache, useWeather } from './useWeather.js'

const mockForecastResponse = {
  current: {
    temperature_2m: 24.6,
    weather_code: 0,
  },
  daily: {
    time: [
      '2026-07-06',
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
    ],
    temperature_2m_max: [28.2, 29.1, 27.5, 26.8, 28.0],
    temperature_2m_min: [20.1, 21.0, 19.8, 19.2, 20.5],
    weather_code: [0, 1, 2, 61, 95],
  },
}

function mockFetchSuccess() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockForecastResponse,
    }),
  )
}

function mockFetchFailure(status = 500) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status,
    }),
  )
}

describe('useWeather', () => {
  beforeEach(() => {
    clearWeatherCache()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearWeatherCache()
  })

  it('starts in a loading state then returns forecast data on success', async () => {
    mockFetchSuccess()

    const { result } = renderHook(() => useWeather(-8.4095, 115.1889))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data?.current.temperature).toBe(25)
    expect(result.current.data?.current.condition).toBe('Clear')
    expect(result.current.data?.daily).toHaveLength(5)
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('returns an error when the API request fails', async () => {
    mockFetchFailure(503)

    const { result } = renderHook(() => useWeather(35.0116, 135.7681))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Weather unavailable (503)')
  })

  it('returns an error when coordinates are missing', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useWeather(null, undefined))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Missing coordinates')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('serves cached data without refetching the same coordinates', async () => {
    mockFetchSuccess()

    const lat = 41.3874
    const lon = 2.1686

    const first = renderHook(() => useWeather(lat, lon))
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    expect(fetch).toHaveBeenCalledTimes(1)

    first.unmount()

    const second = renderHook(() => useWeather(lat, lon))
    await waitFor(() => expect(second.result.current.loading).toBe(false))

    expect(second.result.current.data?.current.temperature).toBe(25)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
