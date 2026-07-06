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
import type { MapPlace } from '../types/map'
import type { OptimizedDayRoute } from '../types/route'
import { formatCurrency } from '../utils/formatCurrency'
import { loadPersistedState, savePersistedState } from '../utils/storage'
import { resolveDestination } from '../utils/resolveDestination'

interface TripContextValue {
  activities: Activity[]
  reservations: Reservation[]
  budget: BudgetBreakdown
  aiMapPlaces: MapPlace[]
  aiTripDestination: string | null
  activeDestinationId: string | null
  addActivity: (activity: NewActivity & { dayNumber: number }) => void
  removeActivity: (id: string) => void
  applyDayRoute: (dayNumber: number, route: OptimizedDayRoute) => void
  setBudgetCategory: (category: BudgetCategory, value: number) => void
  setAiItinerary: (places: MapPlace[], destination: string) => void
  clearAiItinerary: () => void
  setActiveDestinationId: (id: string) => void
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
  const [aiMapPlaces, setAiMapPlaces] = useState<MapPlace[]>(
    () => loadPersistedState().aiMapPlaces,
  )
  const [aiTripDestination, setAiTripDestination] = useState<string | null>(
    () => loadPersistedState().aiTripDestination,
  )
  const [activeDestinationId, setActiveDestinationIdState] = useState<
    string | null
  >(() => loadPersistedState().activeDestinationId)

  useEffect(() => {
    savePersistedState({
      activities,
      reservations,
      budget,
      aiMapPlaces,
      aiTripDestination,
      activeDestinationId,
    })
  }, [activities, reservations, budget, aiMapPlaces, aiTripDestination, activeDestinationId])

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

  const applyDayRoute = useCallback(
    (dayNumber: number, route: OptimizedDayRoute) => {
      const orderMap = new Map(
        route.stops.map((stop) => [stop.activityId, stop]),
      )

      setActivities((prev) => {
        const dayItems = prev.filter((activity) => activity.dayNumber === dayNumber)
        const otherDays = prev.filter((activity) => activity.dayNumber !== dayNumber)

        const reordered: Activity[] = []
        for (const stop of route.stops) {
          const activity = dayItems.find((item) => item.id === stop.activityId)
          if (!activity) continue
          reordered.push({
            ...activity,
            time: stop.suggestedTime ?? activity.time,
          })
        }

        const missing = dayItems.filter(
          (activity) => !orderMap.has(activity.id),
        )

        return [...otherDays, ...reordered, ...missing]
      })
    },
    [],
  )

  const setBudgetCategory = useCallback(
    (category: BudgetCategory, value: number) => {
      setBudget((prev) => ({ ...prev, [category]: value }))
    },
    [],
  )

  const setAiItinerary = useCallback((places: MapPlace[], destination: string) => {
    setAiMapPlaces(places)
    setAiTripDestination(destination)
    const match = resolveDestination(destination)
    if (match) setActiveDestinationIdState(match.id)
  }, [])

  const setActiveDestinationId = useCallback((id: string) => {
    setActiveDestinationIdState(id)
  }, [])

  const clearAiItinerary = useCallback(() => {
    setAiMapPlaces([])
    setAiTripDestination(null)
  }, [])

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
      aiMapPlaces,
      aiTripDestination,
      activeDestinationId,
      addActivity,
      removeActivity,
      applyDayRoute,
      setBudgetCategory,
      setAiItinerary,
      clearAiItinerary,
      setActiveDestinationId,
      getBookingDateDefaults,
      bookHotel,
      isHotelBooked,
    }),
    [
      activities,
      reservations,
      budget,
      aiMapPlaces,
      aiTripDestination,
      activeDestinationId,
      addActivity,
      removeActivity,
      applyDayRoute,
      setBudgetCategory,
      setAiItinerary,
      clearAiItinerary,
      setActiveDestinationId,
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
