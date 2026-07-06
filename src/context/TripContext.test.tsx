import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Hotel } from '../types/hotel'
import { clearPersistedState } from '../utils/storage'
import { TripProvider, useTrip } from './TripContext'

const mockHotel: Hotel = {
  id: 'bali-umi',
  destinationId: 'bali',
  name: 'Umi Cliff Resort',
  pricePerNight: 185,
  rating: 4.8,
  amenities: ['Pool', 'Spa'],
  imageUrl: 'https://example.com/hotel.jpg',
}

function wrapper({ children }: { children: ReactNode }) {
  return <TripProvider>{children}</TripProvider>
}

describe('TripContext itinerary logic', () => {
  beforeEach(() => {
    clearPersistedState()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-activity-id')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds an activity to the itinerary', () => {
    const { result } = renderHook(() => useTrip(), { wrapper })

    act(() => {
      result.current.addActivity({
        dayNumber: 2,
        title: 'Temple visit',
        time: '09:30',
        notes: 'Bring camera',
      })
    })

    expect(result.current.activities).toHaveLength(1)
    expect(result.current.activities[0]).toMatchObject({
      id: 'test-activity-id',
      dayNumber: 2,
      title: 'Temple visit',
      time: '09:30',
      notes: 'Bring camera',
    })
  })

  it('removes an activity by id', () => {
    const { result } = renderHook(() => useTrip(), { wrapper })

    act(() => {
      result.current.addActivity({ dayNumber: 1, title: 'Morning walk' })
    })

    const activityId = result.current.activities[0].id

    act(() => {
      result.current.removeActivity(activityId)
    })

    expect(result.current.activities).toHaveLength(0)
  })
})

describe('TripContext hotel booking flow', () => {
  beforeEach(() => {
    clearPersistedState()
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('reservation-id')
      .mockReturnValueOnce('itinerary-id')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a reservation and linked day-1 itinerary item', () => {
    const { result } = renderHook(() => useTrip(), { wrapper })

    let reservation: ReturnType<typeof result.current.bookHotel> = null

    act(() => {
      reservation = result.current.bookHotel(mockHotel, 'Bali', {
        checkIn: '2026-07-20',
        checkOut: '2026-07-23',
      })
    })

    expect(reservation).not.toBeNull()
    expect(result.current.reservations).toHaveLength(1)
    expect(result.current.reservations[0]).toMatchObject({
      id: 'reservation-id',
      hotelId: 'bali-umi',
      hotelName: 'Umi Cliff Resort',
      destinationName: 'Bali',
      pricePerNight: 185,
      checkIn: '2026-07-20',
      checkOut: '2026-07-23',
    })

    expect(result.current.activities).toHaveLength(1)
    expect(result.current.activities[0]).toMatchObject({
      id: 'itinerary-id',
      dayNumber: 1,
      title: 'Hotel stay: Umi Cliff Resort',
      time: '15:00',
      type: 'accommodation',
      linkedReservationId: 'reservation-id',
    })
    expect(result.current.activities[0].notes).toContain('2026-07-20 → 2026-07-23')
    expect(result.current.activities[0].notes).toContain('$185')
    expect(result.current.activities[0].notes).toContain('$555')
    expect(result.current.activities[0].notes).toContain('Bali')
  })

  it('marks a hotel as booked and prevents duplicate reservations', () => {
    const { result } = renderHook(() => useTrip(), { wrapper })

    act(() => {
      result.current.bookHotel(mockHotel, 'Bali', {
        checkIn: '2026-07-20',
        checkOut: '2026-07-23',
      })
    })

    expect(result.current.isHotelBooked('bali-umi')).toBe(true)

    act(() => {
      const duplicate = result.current.bookHotel(mockHotel, 'Bali', {
        checkIn: '2026-07-20',
        checkOut: '2026-07-23',
      })
      expect(duplicate).toBeNull()
    })

    expect(result.current.reservations).toHaveLength(1)
    expect(result.current.activities).toHaveLength(1)
  })

  it('provides placeholder booking defaults when no trip dates exist', () => {
    const { result } = renderHook(() => useTrip(), { wrapper })

    const defaults = result.current.getBookingDateDefaults()
    expect(defaults.checkIn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(defaults.checkOut).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('persists activities and reservations to localStorage', () => {
    const { result } = renderHook(() => useTrip(), { wrapper })

    act(() => {
      result.current.addActivity({ dayNumber: 1, title: 'Beach day' })
      result.current.bookHotel(mockHotel, 'Bali', {
        checkIn: '2026-07-20',
        checkOut: '2026-07-23',
      })
      result.current.setBudgetCategory('flights', 750)
    })

    const { result: reloaded } = renderHook(() => useTrip(), { wrapper })

    expect(reloaded.current.activities).toHaveLength(2)
    expect(reloaded.current.reservations).toHaveLength(1)
    expect(reloaded.current.budget.flights).toBe(750)
  })
})
