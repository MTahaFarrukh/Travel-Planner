import { describe, expect, it } from 'vitest'
import { DEFAULT_BUDGET } from '../types/budget'
import { collectTravelGuideData } from './collectTravelGuideData'

describe('collectTravelGuideData', () => {
  it('builds guide data from trip state', () => {
    const data = collectTravelGuideData({
      activities: [
        { id: 'a1', dayNumber: 1, title: 'Temple visit', time: '09:00' },
      ],
      reservations: [],
      budget: DEFAULT_BUDGET,
      aiMapPlaces: [],
      aiTripDestination: 'Kyoto, Japan',
      packingChecklist: null,
    })

    expect(data.destinationName).toBe('Kyoto')
    expect(data.country).toBe('Japan')
    expect(data.activityCount).toBe(1)
    expect(data.activitiesByDay[1]).toHaveLength(1)
    expect(data.travelTips.length).toBeGreaterThan(0)
    expect(data.emergencyContacts.length).toBeGreaterThan(0)
  })
})
