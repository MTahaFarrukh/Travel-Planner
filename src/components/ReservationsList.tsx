import { useTrip } from '../context/TripContext'
import { formatCurrency } from '../utils/formatCurrency'
import EmptyState from './EmptyState'

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function nightsBetween(checkIn: string, checkOut: string) {
  const inDate = new Date(`${checkIn}T12:00:00`)
  const outDate = new Date(`${checkOut}T12:00:00`)
  const diff = outDate.getTime() - inDate.getTime()
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
}

export default function ReservationsList() {
  const { reservations } = useTrip()

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No reservations yet"
        description="Book a hotel above and it will appear here — plus on Day 1 of your itinerary."
        icon={
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
          </svg>
        }
      />
    )
  }

  return (
    <ul className="space-y-3" aria-label="Your reservations">
      {reservations.map((reservation, index) => (
        // Booking now stores explicit check-in/out; show both nightly and stay total.
        <li
          key={reservation.id}
          className="animate-card-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <article className="flex flex-col gap-3 rounded-2xl bg-parchment/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="flex size-6 items-center justify-center rounded-full bg-teal/25 text-teal"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <p className="font-mono text-xs uppercase tracking-widest text-teal">
                  Confirmed
                </p>
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold text-parchment">
                {reservation.hotelName}
              </h3>
              <p className="text-sm text-parchment/75">
                {reservation.destinationName}
              </p>
            </div>

            <div className="sm:text-right">
              {(() => {
                const nights = nightsBetween(
                  reservation.checkIn,
                  reservation.checkOut,
                )
                const total = reservation.pricePerNight * nights
                return (
                  <>
                    <p className="font-mono text-sm text-parchment">
                      {formatDate(reservation.checkIn)} →{' '}
                      {formatDate(reservation.checkOut)}
                    </p>
                    <p className="mt-1 font-mono text-xs text-parchment/70">
                      {nights} {nights === 1 ? 'night' : 'nights'}
                    </p>
                    <p className="mt-1 font-mono text-sm text-brass">
                      {formatCurrency(reservation.pricePerNight)}/night
                    </p>
                    <p className="font-mono text-sm text-rust">
                      Total: {formatCurrency(total)}
                    </p>
                  </>
                )
              })()}
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
