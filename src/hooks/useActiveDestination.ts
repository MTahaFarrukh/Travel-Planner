import { useMemo } from 'react'
import { destinations } from '../data/destinations.js'
import { useTrip } from '../context/TripContext'
import type { Destination } from '../types/destination'
import { resolveDestination } from '../utils/resolveDestination'

export function useActiveDestination(): {
  destination: Destination
  setActiveDestinationId: (id: string) => void
} {
  const {
    activeDestinationId,
    setActiveDestinationId,
    aiTripDestination,
    reservations,
  } = useTrip()

  const destination = useMemo(() => {
    if (activeDestinationId) {
      const selected = destinations.find((item) => item.id === activeDestinationId)
      if (selected) return selected
    }

    if (aiTripDestination) {
      const fromAi = resolveDestination(aiTripDestination)
      if (fromAi) return fromAi
    }

    if (reservations.length > 0) {
      const fromReservation = destinations.find(
        (item) => item.id === reservations[0].destinationId,
      )
      if (fromReservation) return fromReservation
    }

    return destinations[0]
  }, [activeDestinationId, aiTripDestination, reservations])

  return { destination, setActiveDestinationId }
}
