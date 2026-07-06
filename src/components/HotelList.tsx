import { destinations } from '../data/destinations.js'
import { getHotelsForDestination } from '../data/hotels.js'
import { useTrip } from '../context/TripContext'
import type { Hotel } from '../types/hotel'
import { focusRingOnInk } from '../utils/a11y'
import HotelCard from './HotelCard'

interface HotelListProps {
  selectedDestinationId: string
  onDestinationChange: (id: string) => void
}

export default function HotelList({
  selectedDestinationId,
  onDestinationChange,
}: HotelListProps) {
  const { bookHotel, isHotelBooked, getBookingDateDefaults } = useTrip()

  const hotels = getHotelsForDestination(selectedDestinationId)
  const destination = destinations.find((d) => d.id === selectedDestinationId)

  function handleBook(
    hotel: Hotel,
    dateRange: { checkIn: string; checkOut: string },
  ) {
    if (!destination) return false
    return bookHotel(hotel, destination.name, dateRange) !== null
  }

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Select destination"
      >
        {destinations.map((dest) => (
          <button
            key={dest.id}
            type="button"
            role="tab"
            aria-selected={selectedDestinationId === dest.id}
            onClick={() => onDestinationChange(dest.id)}
            className={`rounded-full px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors duration-200 sm:px-4 ${focusRingOnInk} ${
              selectedDestinationId === dest.id
                ? 'bg-brass text-ink'
                : 'border border-parchment/20 text-parchment/80 hover:border-brass/40 hover:text-parchment'
            }`}
          >
            {dest.name}
          </button>
        ))}
      </div>

      {hotels.length === 0 ? (
        <p className="mt-10 text-center font-mono text-sm text-parchment/70">
          No hotels listed for this destination yet.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel, index) => (
            <li key={hotel.id}>
              <div style={{ animationDelay: `${index * 60}ms` }}>
                <HotelCard
                  hotel={hotel}
                  isBooked={isHotelBooked(hotel.id)}
                  defaultDateRange={getBookingDateDefaults()}
                  onBook={handleBook}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
