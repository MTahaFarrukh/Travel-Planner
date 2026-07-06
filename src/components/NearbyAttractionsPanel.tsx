import { useMemo, useState } from 'react'
import { attractions } from '../data/attractions.js'
import { useTrip } from '../context/TripContext'
import type { AttractionWithDistance } from '../types/attraction'
import type { Destination } from '../types/destination'
import { formatDistanceKm } from '../utils/haversine'
import { getNearbyAttractions } from '../utils/getNearbyAttractions'
import AttractionCardGrid from './AttractionCardGrid'
import DaySelector from './DaySelector'

interface NearbyAttractionsPanelProps {
  destination: Destination
}

const NEARBY_RADIUS_KM = 5
const TRIP_LENGTH = 5

export default function NearbyAttractionsPanel({
  destination,
}: NearbyAttractionsPanelProps) {
  const { activities, addActivity } = useTrip()
  const [selectedDay, setSelectedDay] = useState(1)
  const [addedIds, setAddedIds] = useState<Set<string>>(() => new Set())

  const nearby = useMemo(
    () =>
      getNearbyAttractions(
        destination.lat,
        destination.lon,
        attractions.filter((item) => item.destinationId === destination.id),
        NEARBY_RADIUS_KM,
      ),
    [destination],
  )

  const syncedAddedIds = useMemo(() => {
    const titles = new Set(activities.map((activity) => activity.title))
    const ids = new Set(addedIds)
    for (const attraction of nearby) {
      if (titles.has(attraction.name)) ids.add(attraction.id)
    }
    return ids
  }, [activities, addedIds, nearby])

  function handleAdd(attraction: AttractionWithDistance) {
    addActivity({
      dayNumber: selectedDay,
      title: attraction.name,
      notes: `${attraction.category} · ${formatDistanceKm(attraction.distanceKm)} from ${destination.name} · ${attraction.description}`,
    })
    setAddedIds((prev) => new Set(prev).add(attraction.id))
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-parchment/10 bg-parchment/5 p-5 backdrop-blur-sm sm:p-6"
      aria-labelledby="nearby-attractions-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Nearby
          </p>
          <h2
            id="nearby-attractions-heading"
            className="mt-1 font-display text-2xl font-semibold text-parchment"
          >
            Attractions near {destination.name}
          </h2>
          <p className="mt-2 text-sm text-parchment/75">
            Within {NEARBY_RADIUS_KM} km · {nearby.length}{' '}
            {nearby.length === 1 ? 'place' : 'places'} found
          </p>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-parchment/60">
            Add to day
          </p>
          <DaySelector
            tripLength={TRIP_LENGTH}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </div>
      </div>

      <div className="mt-6">
        <AttractionCardGrid
          attractions={nearby}
          addedIds={syncedAddedIds}
          onAdd={handleAdd}
        />
      </div>
    </section>
  )
}
