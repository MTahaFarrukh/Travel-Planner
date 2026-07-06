import { describe, expect, it } from 'vitest'
import { buildMapPlaces } from './buildMapPlaces'

describe('buildMapPlaces', () => {
  it('merges AI places, activities, and hotel reservations', () => {
    const places = buildMapPlaces({
      aiMapPlaces: [
        {
          id: 'ai-1',
          name: 'Temple visit',
          description: 'Morning temple tour',
          estimatedTime: 'Morning',
          lat: 35.02,
          lon: 135.77,
          dayNumber: 1,
        },
      ],
      aiTripDestination: 'Kyoto, Japan',
      activities: [
        {
          id: 'act-1',
          dayNumber: 2,
          title: 'Tea ceremony',
          time: '10:30',
        },
      ],
      reservations: [
        {
          id: 'res-1',
          hotelId: 'kyoto-ryokan',
          hotelName: 'Gion Heritage Ryokan',
          destinationId: 'kyoto',
          destinationName: 'Kyoto',
          pricePerNight: 240,
          checkIn: '2026-08-01',
          checkOut: '2026-08-04',
          bookedAt: '2026-07-01T00:00:00.000Z',
        },
      ],
    })

    expect(places.length).toBe(3)
    expect(places.some((place) => place.id === 'ai-1')).toBe(true)
    expect(places.some((place) => place.id === 'activity-act-1')).toBe(true)
    expect(places.some((place) => place.id === 'hotel-res-1')).toBe(true)
  })
})
