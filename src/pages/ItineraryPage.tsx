import { useEffect, useMemo, useState } from 'react'
import ActivityForm from '../components/ActivityForm'
import ActivityList from '../components/ActivityList'
import DaySelector from '../components/DaySelector'
import ItineraryOptimizerPanel from '../components/itinerary/ItineraryOptimizerPanel'
import { useTrip } from '../context/TripContext'
import { useActiveDestination } from '../hooks/useActiveDestination'
import type { NewActivity } from '../types/itinerary'
import type { OptimizedDayRoute } from '../types/route'
import { pageHeading, pageSection } from '../utils/a11y'
import { buildDayRoute } from '../utils/buildDayRoute'

const DEFAULT_TRIP_LENGTH = 5

export default function ItineraryPage() {
  const {
    activities,
    aiMapPlaces,
    reservations,
    addActivity,
    removeActivity,
    applyDayRoute,
  } = useTrip()
  const { destination } = useActiveDestination()
  const [selectedDay, setSelectedDay] = useState(1)
  const [route, setRoute] = useState<OptimizedDayRoute | null>(null)
  const [applied, setApplied] = useState(false)
  const [optimizing, setOptimizing] = useState(false)

  const dayActivities = useMemo(
    () => activities.filter((activity) => activity.dayNumber === selectedDay),
    [activities, selectedDay],
  )

  const canOptimize = dayActivities.length >= 2

  useEffect(() => {
    setRoute(null)
    setApplied(false)
  }, [selectedDay, dayActivities.length])

  function handleAddActivity(newActivity: NewActivity) {
    addActivity({ dayNumber: selectedDay, ...newActivity })
    setRoute(null)
    setApplied(false)
  }

  function handleOptimize() {
    setOptimizing(true)
    window.requestAnimationFrame(() => {
      const nextRoute = buildDayRoute({
        dayNumber: selectedDay,
        activities,
        aiMapPlaces,
        reservations,
        anchor: { lat: destination.lat, lon: destination.lon },
        destinationId: destination.id,
      })
      setRoute(nextRoute)
      setApplied(false)
      setOptimizing(false)
    })
  }

  function handleApply() {
    if (!route) return
    applyDayRoute(selectedDay, route)
    setApplied(true)
  }

  return (
    <section className={pageSection}>
      <header className="animate-section-header mb-8 sm:mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-teal">
          Itinerary
        </p>
        <h1 className={pageHeading}>
          Plan day by day
        </h1>
        <p className="mt-3 max-w-xl text-parchment/80">
          Build your schedule one day at a time — add activities, optimize
          routes to cut travel time, and let Waymark suggest arrival times.
        </p>
      </header>

      <DaySelector
        tripLength={DEFAULT_TRIP_LENGTH}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <ItineraryOptimizerPanel
        destination={destination}
        route={route}
        canOptimize={canOptimize}
        applied={applied}
        optimizing={optimizing}
        onOptimize={handleOptimize}
        onApply={handleApply}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <ActivityForm onAdd={handleAddActivity} />
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-parchment/70">
            Day {selectedDay} schedule
            {route && !applied && ' · preview order below'}
          </p>
          <ActivityList
            activities={dayActivities}
            onRemove={(id) => {
              removeActivity(id)
              setRoute(null)
              setApplied(false)
            }}
            route={route}
          />
        </div>
      </div>
    </section>
  )
}
