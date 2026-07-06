import { useMemo } from 'react'
import { attractions } from '../data/attractions.js'
import { useTrip } from '../context/TripContext'
import { useActiveDestination } from '../hooks/useActiveDestination'
import DestinationPicker from '../components/DestinationPicker'
import EmptyState from '../components/EmptyState'
import NearbyAttractionsPanel from '../components/NearbyAttractionsPanel'
import TripMap from '../components/map/TripMap'
import { buildMapPlaces } from '../utils/buildMapPlaces'
import { getNearbyAttractions } from '../utils/getNearbyAttractions'
import { pageHeading, pageSection } from '../utils/a11y'

export default function MapPage() {
  const { activities, reservations, aiMapPlaces, aiTripDestination } = useTrip()
  const { destination: selectedDestination, setActiveDestinationId } =
    useActiveDestination()

  const selectedDestinationId = selectedDestination.id

  const places = useMemo(
    () =>
      buildMapPlaces({
        activities,
        reservations,
        aiMapPlaces,
        aiTripDestination,
      }),
    [activities, reservations, aiMapPlaces, aiTripDestination],
  )

  const nearbyAttractions = useMemo(
    () =>
      getNearbyAttractions(
        selectedDestination.lat,
        selectedDestination.lon,
        attractions.filter(
          (item) => item.destinationId === selectedDestination.id,
        ),
        5,
      ),
    [selectedDestination],
  )

  return (
    <section className={pageSection}>
      <header className="animate-section-header mb-8 sm:mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-teal">
          Map
        </p>
        <h1 className={pageHeading}>Your trip on the map</h1>
        <p className="mt-3 max-w-2xl text-parchment/80">
          Select a destination to explore nearby attractions within 5 km, then
          add your favourites straight into the itinerary.
        </p>
      </header>

      <div className="mb-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-parchment/60">
          Destination
        </p>
        <DestinationPicker
          selectedId={selectedDestinationId}
          onSelect={(destination) => setActiveDestinationId(destination.id)}
        />
      </div>

      <TripMap
        places={places}
        selectedDestination={selectedDestination}
        nearbyAttractions={nearbyAttractions}
      />

      <p className="mt-4 font-mono text-xs text-parchment/60">
        {places.length} itinerary {places.length === 1 ? 'marker' : 'markers'} ·{' '}
        {nearbyAttractions.length} nearby{' '}
        {nearbyAttractions.length === 1 ? 'attraction' : 'attractions'}
      </p>

      {places.length === 0 && (
        <EmptyState
          className="mt-6"
          title="No itinerary markers yet"
          description="Add activities on the Itinerary tab, book a hotel, or generate an AI trip plan to see your stops on the map."
          icon={
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 22s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
            </svg>
          }
        />
      )}

      <NearbyAttractionsPanel destination={selectedDestination} />
    </section>
  )
}
