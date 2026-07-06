import { destinations } from '../data/destinations.js'
import { getHotelsForDestination } from '../data/hotels.js'
import { useTrip } from '../context/TripContext'
import type { Hotel } from '../types/hotel'
import { focusRingOnInk } from '../utils/a11y'
import EmptyState from './EmptyState'
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
        className="tab-nav-scroll flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto"
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
            className={`shrink-0 rounded-full px-3 py-2 font-mono text-xs uppercase tracking-wide motion-safe:transition-colors motion-safe:duration-200 sm:px-4 ${focusRingOnInk} ${
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
        <EmptyState
          className="mt-10"
          title="No hotels listed yet"
          description={`We're still curating stays for ${destination?.name ?? 'this destination'}. Try another destination or check back soon.`}
          icon={
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
          }
        />
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel, index) => (
            <li key={hotel.id} className="motion-safe:animate-card-in" style={{ animationDelay: `${index * 60}ms` }}>
              <HotelCard
                hotel={hotel}
                isBooked={isHotelBooked(hotel.id)}
                defaultDateRange={getBookingDateDefaults()}
                onBook={handleBook}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
