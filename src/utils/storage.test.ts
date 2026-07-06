import { describe, expect, it } from 'vitest'
import { DEFAULT_BUDGET } from '../types/budget'
import {
  DEFAULT_APP_STATE,
  parsePersistedState,
  STORAGE_VERSION,
} from './storage'

describe('parsePersistedState', () => {
  it('returns defaults for null or empty input', () => {
    expect(parsePersistedState(null)).toEqual(DEFAULT_APP_STATE)
    expect(parsePersistedState('')).toEqual(DEFAULT_APP_STATE)
  })

  it('parses valid persisted state', () => {
    const payload = {
      version: STORAGE_VERSION,
      activities: [
        { id: 'a1', dayNumber: 1, title: 'Museum' },
      ],
      reservations: [
        {
          id: 'r1',
          hotelId: 'h1',
          checkIn: '2026-07-01',
          checkOut: '2026-07-04',
        },
      ],
      budget: { flights: 500, hotels: 800, food: 200, activities: 100 },
      aiMapPlaces: [
        {
          id: 'p1',
          name: 'Temple',
          description: 'Visit',
          estimatedTime: 'Morning',
          lat: 35,
          lon: 135,
        },
      ],
      aiTripDestination: 'Kyoto, Japan',
    }

    const result = parsePersistedState(JSON.stringify(payload))
    expect(result.activities).toHaveLength(1)
    expect(result.reservations).toHaveLength(1)
    expect(result.budget).toEqual({
      hotels: 800,
      food: 200,
      transport: 500,
      activities: 100,
      shopping: 0,
    })
    expect(result.aiMapPlaces).toHaveLength(1)
    expect(result.aiTripDestination).toBe('Kyoto, Japan')
  })

  it('falls back to defaults for invalid JSON or version mismatch', () => {
    expect(parsePersistedState('{not json')).toEqual(DEFAULT_APP_STATE)
    expect(
      parsePersistedState(JSON.stringify({ version: 99, activities: [] })),
    ).toEqual(DEFAULT_APP_STATE)
  })

  it('filters invalid activities and reservations', () => {
    const payload = {
      version: STORAGE_VERSION,
      activities: [{ bad: true }, { id: 'ok', dayNumber: 2, title: 'Hike' }],
      reservations: [{ id: 'r1' }, { id: 'r2', hotelId: 'h1', checkIn: '2026-01-01', checkOut: '2026-01-03' }],
      budget: DEFAULT_BUDGET,
    }

    const result = parsePersistedState(JSON.stringify(payload))
    expect(result.activities).toHaveLength(1)
    expect(result.reservations).toHaveLength(1)
  })
})
