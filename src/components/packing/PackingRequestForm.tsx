import { destinations } from '../../data/destinations.js'
import {
  MONTH_OPTIONS,
  PACKING_ACTIVITY_OPTIONS,
  TRIP_TYPE_OPTIONS,
  WEATHER_OPTIONS,
} from '../../constants/packing'
import type {
  PackingActivity,
  PackingRequest,
  PackingTripType,
  PackingWeather,
  TravelMonth,
} from '../../types/packing'
import { focusRingOnParchment } from '../../utils/a11y'
import OptionChipGroup from '../OptionChipGroup'
import Skeleton from '../Skeleton'

interface PackingRequestFormProps {
  request: PackingRequest
  loading: boolean
  onDestinationChange: (value: string) => void
  onTravelMonthChange: (month: TravelMonth) => void
  onWeatherChange: (weather: PackingWeather) => void
  onTripTypeChange: (tripType: PackingTripType) => void
  onActivityToggle: (activity: PackingActivity) => void
  onSubmit: () => void
  onReset: () => void
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-2.5 text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/50 focus-visible:border-brass/60 focus-visible:ring-2 focus-visible:ring-brass/25'

export default function PackingRequestForm({
  request,
  loading,
  onDestinationChange,
  onTravelMonthChange,
  onWeatherChange,
  onTripTypeChange,
  onActivityToggle,
  onSubmit,
  onReset,
}: PackingRequestFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="rounded-2xl border border-parchment/10 bg-parchment p-5 text-ink shadow-lg sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Trip details
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">
            What are you packing for?
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            We&apos;ll tailor your checklist to the destination, season, and
            activities.
          </p>
        </div>
        <span
          className="hidden rounded-full bg-teal/15 px-3 py-1 font-mono text-xs uppercase tracking-widest text-teal sm:inline"
          aria-hidden="true"
        >
          Pack
        </span>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Destination
          </span>
          <input
            type="text"
            list="packing-destination-suggestions"
            value={request.destination}
            onChange={(event) => onDestinationChange(event.target.value)}
            placeholder="e.g. Kyoto, Japan"
            required
            className={inputClass}
            aria-label="Destination"
          />
          <datalist id="packing-destination-suggestions">
            {destinations.map((destination) => (
              <option
                key={destination.id}
                value={`${destination.name}, ${destination.country}`}
              />
            ))}
          </datalist>
        </label>

        <OptionChipGroup
          label="Travel month"
          hint="When are you travelling?"
          options={MONTH_OPTIONS}
          selected={request.travelMonth}
          onSelect={onTravelMonthChange}
          mode="single"
          variant="parchment"
        />

        <OptionChipGroup
          label="Weather"
          hint="Expected conditions during your trip"
          options={WEATHER_OPTIONS}
          selected={request.weather}
          onSelect={onWeatherChange}
          mode="single"
          variant="parchment"
        />

        <OptionChipGroup
          label="Trip type"
          options={TRIP_TYPE_OPTIONS}
          selected={request.tripType}
          onSelect={onTripTypeChange}
          mode="single"
          variant="parchment"
        />

        <OptionChipGroup
          label="Activities"
          hint="Select all that apply"
          options={PACKING_ACTIVITY_OPTIONS}
          selected={request.activities}
          onSelect={onActivityToggle}
          mode="multiple"
          variant="parchment"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`rounded-xl bg-teal px-5 py-3 font-mono text-xs uppercase tracking-widest text-parchment motion-safe:transition-colors hover:bg-teal/90 disabled:cursor-wait disabled:opacity-70 ${focusRingOnParchment}`}
        >
          {loading ? 'Generating…' : 'Generate checklist'}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className={`rounded-xl border border-ink/15 px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink/75 motion-safe:transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50 ${focusRingOnParchment}`}
        >
          Reset
        </button>
      </div>

      {loading && (
        <div className="mt-6 space-y-3" aria-hidden="true">
          <Skeleton className="h-3 w-2/3" variant="teal" />
          <Skeleton className="h-3 w-full" variant="teal" />
          <Skeleton className="h-3 w-5/6" variant="teal" />
        </div>
      )}
    </form>
  )
}
