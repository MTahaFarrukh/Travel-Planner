import { describe, expect, it } from 'vitest'
import { DEFAULT_BUDGET } from '../types/budget'
import { buildTravelGuidePdf } from './buildTravelGuidePdf'
import { collectTravelGuideData } from './collectTravelGuideData'

describe('buildTravelGuidePdf', () => {
  it('generates a multi-page document', () => {
    const data = collectTravelGuideData({
      activities: [
        { id: 'a1', dayNumber: 1, title: 'City walk', time: '10:00', notes: 'Old town' },
        { id: 'a2', dayNumber: 2, title: 'Museum', time: '14:00' },
      ],
      reservations: [
        {
          id: 'r1',
          hotelId: 'h1',
          hotelName: 'Harbour Inn',
          destinationId: 'kyoto',
          destinationName: 'Kyoto, Japan',
          pricePerNight: 120,
          checkIn: '2026-07-01',
          checkOut: '2026-07-04',
          bookedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      budget: DEFAULT_BUDGET,
      aiMapPlaces: [
        {
          id: 'p1',
          name: 'Fushimi Inari',
          description: 'Iconic shrine gates',
          estimatedTime: 'Morning',
          lat: 34.97,
          lon: 135.77,
          dayNumber: 1,
        },
      ],
      aiTripDestination: 'Kyoto, Japan',
      packingChecklist: {
        items: [
          {
            id: 'p1',
            label: 'Passport',
            category: 'documents',
            checked: true,
          },
        ],
        generatedAt: new Date().toISOString(),
        source: 'local',
      },
      weather: {
        currentTemp: 22,
        currentCondition: 'Partly cloudy',
        daily: [
          {
            date: '2026-07-01',
            condition: 'Sunny',
            tempMin: 18,
            tempMax: 26,
            icon: 'sun',
          },
        ],
      },
    })

    const doc = buildTravelGuidePdf(data)
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(8)
  })
})
