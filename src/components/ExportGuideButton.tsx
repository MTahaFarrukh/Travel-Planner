import { useCallback, useState } from 'react'
import { destinations } from '../data/destinations.js'
import { useTrip } from '../context/TripContext'
import ErrorAlert from './ErrorAlert'
import Skeleton from './Skeleton'
import { focusRingOnInk } from '../utils/a11y'
import { loadPackingState } from '../utils/packingStorage'
import { resolveDestination } from '../utils/resolveDestination'

export default function ExportGuideButton() {
  const {
    activities,
    reservations,
    budget,
    aiMapPlaces,
    aiTripDestination,
  } = useTrip()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const exportGuide = useCallback(async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const destination =
        (aiTripDestination && resolveDestination(aiTripDestination)) ||
        destinations.find((item) => item.id === reservations[0]?.destinationId) ||
        destinations[0]

      const packingState = loadPackingState()

      const [{ collectTravelGuideData }, { downloadTravelGuidePdf }, { fetchWeatherForGuide }] =
        await Promise.all([
          import('../pdf/collectTravelGuideData'),
          import('../pdf/buildTravelGuidePdf'),
          import('../pdf/fetchWeatherForGuide'),
        ])

      const weather = await fetchWeatherForGuide(destination.lat, destination.lon)

      const guideData = collectTravelGuideData({
        activities,
        reservations,
        budget,
        aiMapPlaces,
        aiTripDestination,
        packingChecklist: packingState.checklist,
        weather,
      })

      downloadTravelGuidePdf(guideData)
      setMessage('Travel guide PDF downloaded.')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate travel guide.',
      )
    } finally {
      setLoading(false)
    }
  }, [activities, reservations, budget, aiMapPlaces, aiTripDestination])

  return (
    <div className="mt-6 rounded-2xl border border-brass/25 bg-brass/10 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brass">
            Export
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-parchment">
            Download travel guide
          </h3>
          <p className="mt-2 max-w-md text-sm text-parchment/75">
            Premium PDF with cover page, itinerary, budget, weather, packing
            list, hotels, emergency contacts, and travel tips.
          </p>
        </div>

        <button
          type="button"
          onClick={exportGuide}
          disabled={loading}
          aria-busy={loading}
          className={`shrink-0 rounded-xl bg-brass px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink motion-safe:transition-colors hover:bg-brass/90 disabled:cursor-wait disabled:opacity-70 ${focusRingOnInk}`}
        >
          {loading ? 'Generating…' : 'Export PDF'}
        </button>
      </div>

      {loading && (
        <div className="mt-4 space-y-2" aria-hidden="true">
          <Skeleton className="h-3 w-full" variant="parchment" rounded="md" />
          <Skeleton className="h-3 w-4/5" variant="parchment" rounded="md" />
        </div>
      )}

      {message && !loading && (
        <p className="mt-3 font-mono text-xs text-teal" role="status">
          {message}
        </p>
      )}
      {error && !loading && (
        <ErrorAlert className="mt-3" message={error} onRetry={exportGuide} />
      )}
    </div>
  )
}
