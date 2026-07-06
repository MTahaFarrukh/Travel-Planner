import { useMemo, useState } from 'react'
import ActivityForm from '../components/ActivityForm'
import ActivityList from '../components/ActivityList'
import DaySelector from '../components/DaySelector'
import { useTrip } from '../context/TripContext'
import type { NewActivity } from '../types/itinerary'
import { pageHeading, pageSection } from '../utils/a11y'

const DEFAULT_TRIP_LENGTH = 5

export default function ItineraryPage() {
  const { activities, addActivity, removeActivity } = useTrip()
  const [selectedDay, setSelectedDay] = useState(1)

  const dayActivities = useMemo(
    () => activities.filter((a) => a.dayNumber === selectedDay),
    [activities, selectedDay],
  )

  function handleAddActivity(newActivity: NewActivity) {
    addActivity({ dayNumber: selectedDay, ...newActivity })
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
          Build your schedule one day at a time — add activities, set times, and
          jot down notes. Hotel bookings appear here automatically.
        </p>
      </header>

      <DaySelector
        tripLength={DEFAULT_TRIP_LENGTH}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <ActivityForm onAdd={handleAddActivity} />
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-parchment/70">
            Day {selectedDay} schedule
          </p>
          <ActivityList
            activities={dayActivities}
            onRemove={removeActivity}
          />
        </div>
      </div>
    </section>
  )
}
