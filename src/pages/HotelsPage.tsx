import { useState } from 'react'
import HotelList from '../components/HotelList'
import ReservationsList from '../components/ReservationsList'
import { destinations } from '../data/destinations.js'
import { pageHeading, pageSection } from '../utils/a11y'

export default function HotelsPage() {
  const [selectedDestinationId, setSelectedDestinationId] = useState(
    destinations[0].id,
  )

  return (
    <section className={pageSection}>
      <header className="animate-section-header mb-8 sm:mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-teal">
          Hotels
        </p>
        <h1 className={pageHeading}>
          Find a place to stay
        </h1>
        <p className="mt-3 max-w-xl text-parchment/80">
          Browse mock listings and book instantly — no payment required. Your
          stay is added to the itinerary automatically.
        </p>
      </header>

      <HotelList
        selectedDestinationId={selectedDestinationId}
        onDestinationChange={setSelectedDestinationId}
      />

      <div className="mt-10 sm:mt-14">
        <h2 className="mb-5 font-display text-xl font-semibold text-parchment sm:text-2xl">
          Your reservations
        </h2>
        <ReservationsList />
      </div>
    </section>
  )
}
