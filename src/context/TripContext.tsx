import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  type BudgetBreakdown,
  type BudgetCategory,
} from '../types/budget'
import type { BookingDateRange, Hotel, Reservation } from '../types/hotel'
import type { Activity, NewActivity } from '../types/itinerary'
import { formatCurrency } from '../utils/formatCurrency'
import { loadPersistedState, savePersistedState } from '../utils/storage'

interface TripContextValue {
  activities: Activity[]
  reservations: Reservation[]
  budget: BudgetBreakdown
  addActivity: (activity: NewActivity & { dayNumber: number }) => void
  removeActivity: (id: string) => void
  setBudgetCategory: (category: BudgetCategory, value: number) => void
  getBookingDateDefaults: () => BookingDateRange
  bookHotel: (
    hotel: Hotel,
    destinationName: string,
    dateRange: BookingDateRange,
  ) => Reservation | null
  isHotelBooked: (hotelId: string) => boolean
}

const TripContext = createContext<TripContextValue | null>(null)

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toDateString(date: Date) {
  return date.toISOString().split('T')[0]
}

function nightsBetween(checkIn: string, checkOut: string) {
  const inDate = new Date(`${checkIn}T12:00:00`)
  const outDate = new Date(`${checkOut}T12:00:00`)
  const diff = outDate.getTime() - inDate.getTime()
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(
    () => loadPersistedState().activities,
  )
  const [reservations, setReservations] = useState<Reservation[]>(
    () => loadPersistedState().reservations,
  )
  const [budget, setBudget] = useState<BudgetBreakdown>(
    () => loadPersistedState().budget,
  )

  useEffect(() => {
    savePersistedState({ activities, reservations, budget })
  }, [activities, reservations, budget])

  const addActivity = useCallback(
    (activity: NewActivity & { dayNumber: number }) => {
      setActivities((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...activity },
      ])
    },
    [],
  )

  const removeActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const setBudgetCategory = useCallback(
    (category: BudgetCategory, value: number) => {
      setBudget((prev) => ({ ...prev, [category]: value }))
    },
    [],
  )

  const getBookingDateDefaults = useCallback((): BookingDateRange => {
    if (reservations.length > 0) {
      const sorted = [...reservations].sort((a, b) =>
        a.checkIn.localeCompare(b.checkIn),
      )
      return {
        checkIn: sorted[0].checkIn,
        checkOut: sorted[sorted.length - 1].checkOut,
      }
    }

    const today = new Date()
    const checkOut = addDays(today, 3)
    return {
      checkIn: toDateString(today),
      checkOut: toDateString(checkOut),
    }
  }, [reservations])

  const isHotelBooked = useCallback(
    (hotelId: string) => reservations.some((r) => r.hotelId === hotelId),
    [reservations],
  )

  const bookHotel = useCallback(
    (
      hotel: Hotel,
      destinationName: string,
      dateRange: BookingDateRange,
    ): Reservation | null => {
      if (reservations.some((r) => r.hotelId === hotel.id)) return null

      const { checkIn, checkOut } = dateRange
      const nights = nightsBetween(checkIn, checkOut)
      const totalCost = hotel.pricePerNight * nights

      const reservation: Reservation = {
        id: crypto.randomUUID(),
        hotelId: hotel.id,
        hotelName: hotel.name,
        destinationId: hotel.destinationId,
        destinationName,
        pricePerNight: hotel.pricePerNight,
        checkIn,
        checkOut,
        bookedAt: new Date().toISOString(),
      }

      setReservations((prev) => [...prev, reservation])

      setActivities((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          dayNumber: 1,
          title: `Hotel stay: ${hotel.name}`,
          time: '15:00',
          notes: `Confirmed stay ${checkIn} → ${checkOut} · ${formatCurrency(hotel.pricePerNight)}/night × ${nights} nights = ${formatCurrency(totalCost)} · ${destinationName}`,
          type: 'accommodation',
          linkedReservationId: reservation.id,
        },
      ])

      return reservation
    },
    [reservations],
  )

  const value = useMemo(
    () => ({
      activities,
      reservations,
      budget,
      addActivity,
      removeActivity,
      setBudgetCategory,
      getBookingDateDefaults,
      bookHotel,
      isHotelBooked,
    }),
    [
      activities,
      reservations,
      budget,
      addActivity,
      removeActivity,
      setBudgetCategory,
      getBookingDateDefaults,
      bookHotel,
      isHotelBooked,
    ],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
