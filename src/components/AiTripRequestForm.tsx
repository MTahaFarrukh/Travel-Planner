import { destinations } from '../data/destinations.js'
import {
  INTEREST_OPTIONS,
  MAX_TRIP_DAYS,
  MIN_TRIP_BUDGET,
  MIN_TRIP_DAYS,
  TRAVEL_STYLE_OPTIONS,
} from '../constants/aiTrip'
import type { TravelStyle, TripInterest, TripRequest } from '../types/aiTrip'
import { focusRingOnParchment } from '../utils/a11y'
import OptionChipGroup from './OptionChipGroup'

interface AiTripRequestFormProps {
  request: TripRequest
  loading: boolean
  onDestinationChange: (value: string) => void
  onDaysChange: (value: number) => void
  onBudgetChange: (value: number) => void
  onTravelStyleChange: (style: TravelStyle) => void
  onInterestToggle: (interest: TripInterest) => void
  onSubmit: () => void
  onReset: () => void
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-2.5 text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/50 focus-visible:border-brass/60 focus-visible:ring-2 focus-visible:ring-brass/25'

export default function AiTripRequestForm({
  request,
  loading,
  onDestinationChange,
  onDaysChange,
  onBudgetChange,
  onTravelStyleChange,
  onInterestToggle,
  onSubmit,
  onReset,
}: AiTripRequestFormProps) {
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
            Trip brief
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">
            Tell us your dream trip
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            We&apos;ll craft a professional AI prompt from your preferences.
          </p>
        </div>
        <span
          className="hidden rounded-full bg-brass/15 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brass sm:inline"
          aria-hidden="true"
        >
          AI
        </span>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Destination
          </span>
          <input
            type="text"
            list="destination-suggestions"
            value={request.destination}
            onChange={(event) => onDestinationChange(event.target.value)}
            placeholder="e.g. Kyoto, Japan"
            required
            className={inputClass}
            aria-label="Destination"
          />
          <datalist id="destination-suggestions">
            {destinations.map((destination) => (
              <option
                key={destination.id}
                value={`${destination.name}, ${destination.country}`}
              />
            ))}
          </datalist>
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
              Number of days
            </span>
            <input
              type="number"
              min={MIN_TRIP_DAYS}
              max={MAX_TRIP_DAYS}
              value={request.days}
              onChange={(event) =>
                onDaysChange(Number(event.target.value) || MIN_TRIP_DAYS)
              }
              className={`${inputClass} font-mono`}
              aria-label="Number of days"
            />
          </label>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
              Budget (USD)
            </span>
            <input
              type="number"
              min={MIN_TRIP_BUDGET}
              step={50}
              value={request.budget}
              onChange={(event) =>
                onBudgetChange(Number(event.target.value) || MIN_TRIP_BUDGET)
              }
              className={`${inputClass} font-mono`}
              aria-label="Budget in US dollars"
            />
          </label>
        </div>

        <div className="rounded-xl bg-ink/5 p-4">
          <OptionChipGroup
            label="Travel style"
            hint="Choose the pace and comfort level for this trip."
            options={TRAVEL_STYLE_OPTIONS}
            selected={request.travelStyle}
            onSelect={onTravelStyleChange}
            mode="single"
            variant="parchment"
          />
        </div>

        <div className="rounded-xl bg-ink/5 p-4">
          <OptionChipGroup
            label="Interests"
            hint="Select all that apply — we'll weave them into your plan."
            options={INTEREST_OPTIONS}
            selected={request.interests}
            onSelect={onInterestToggle}
            mode="multiple"
            variant="parchment"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className={`hero-cta-glow flex-1 rounded-xl bg-brass px-6 py-3.5 font-mono text-sm uppercase tracking-widest text-ink motion-safe:transition-transform motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${focusRingOnParchment}`}
        >
          {loading ? 'Generating…' : 'Generate trip'}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className={`rounded-xl border border-ink/15 px-6 py-3.5 font-mono text-sm uppercase tracking-wide text-ink/70 motion-safe:transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-60 ${focusRingOnParchment}`}
        >
          Reset
        </button>
      </div>
    </form>
  )
}
