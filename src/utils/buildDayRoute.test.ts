import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildDayRoute } from './buildDayRoute'
import type { Activity } from '../types/itinerary'

describe('buildDayRoute', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('activity-1')
      .mockReturnValueOnce('activity-2')
      .mockReturnValueOnce('activity-3')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when fewer than two activities', () => {
    const activities: Activity[] = [
      {
        id: 'activity-1',
        dayNumber: 1,
        title: 'Temple',
        time: '09:00',
        notes: '',
      },
    ]

    expect(
      buildDayRoute({
        dayNumber: 1,
        activities,
        aiMapPlaces: [],
        reservations: [],
        anchor: { lat: 35.0116, lon: 135.7681 },
        destinationId: 'kyoto',
      }),
    ).toBeNull()
  })

  it('builds legs with all travel modes and suggested times', () => {
    const activities: Activity[] = [
      {
        id: 'activity-1',
        dayNumber: 1,
        title: 'Kinkaku-ji',
        time: '10:00',
        notes: '',
      },
      {
        id: 'activity-2',
        dayNumber: 1,
        title: 'Fushimi Inari',
        time: '14:00',
        notes: '',
      },
      {
        id: 'activity-3',
        dayNumber: 2,
        title: 'Other day',
        time: '11:00',
        notes: '',
      },
    ]

    const route = buildDayRoute({
      dayNumber: 1,
      activities,
      aiMapPlaces: [],
      reservations: [],
      anchor: { lat: 35.0116, lon: 135.7681 },
      destinationId: 'kyoto',
    })

    expect(route).not.toBeNull()
    expect(route!.stops).toHaveLength(2)
    expect(route!.legs).toHaveLength(1)
    expect(route!.legs[0].estimates).toHaveLength(4)
    expect(route!.stops[0].suggestedTime).toMatch(/^\d{2}:\d{2}$/)
    expect(route!.totalsByMode.walking).toBeGreaterThan(0)
    expect(route!.recommendedTotalMin).toBeGreaterThan(0)
  })
})
