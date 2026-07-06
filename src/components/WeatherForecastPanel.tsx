import type { Destination } from '../types/destination'
import { useWeather } from '../hooks/useWeather.js'
import { focusRingOnInk } from '../utils/a11y'
import ErrorAlert from './ErrorAlert'
import Skeleton from './Skeleton'

interface WeatherForecastPanelProps {
  destination: Destination
  onClose: () => void
}

function formatDayLabel(dateStr: string, index: number) {
  if (index === 0) return 'Today'
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export default function WeatherForecastPanel({
  destination,
  onClose,
}: WeatherForecastPanelProps) {
  const { data, loading, error } = useWeather(destination.lat, destination.lon)

  return (
    <aside
      className="animate-card-in w-full shrink-0 rounded-2xl border border-parchment/15 bg-parchment/5 p-4 backdrop-blur-sm sm:p-6 lg:sticky lg:top-6 lg:w-80"
      aria-label={`Weather forecast for ${destination.name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Forecast
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-parchment sm:text-2xl">
            {destination.name}
          </h2>
          <p className="text-sm text-parchment/75">{destination.country}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg p-2 text-parchment/70 transition-colors hover:bg-parchment/10 hover:text-parchment ${focusRingOnInk}`}
          aria-label="Close forecast panel"
        >
          <svg
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {loading && (
        <div className="mt-6 space-y-4" aria-live="polite">
          <Skeleton className="h-20 w-full" variant="parchment" rounded="xl" aria-label="Loading current weather" />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-full"
                variant="parchment"
                rounded="lg"
                aria-label="Loading forecast day"
              />
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <ErrorAlert
          className="mt-6"
          message={error}
          onRetry={() => window.location.reload()}
          retryLabel="Reload page"
        />
      )}

      {data && !loading && !error && (
        <div className="mt-6">
          <div className="flex items-center gap-4 rounded-xl bg-parchment p-4 text-ink">
            <span className="text-4xl" aria-hidden="true">
              {data.current.icon}
            </span>
            <div>
              <p className="font-display text-3xl font-semibold">
                {data.current.temperature}°{data.current.unit}
              </p>
              <p className="font-mono text-xs text-ink/70">
                {data.current.condition}
              </p>
            </div>
          </div>

          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-parchment/70">
            5-day outlook
          </p>
          <ul className="mt-3 space-y-2">
            {data.daily.map((day, index) => (
              <li
                key={day.date}
                className="flex items-center justify-between rounded-xl bg-parchment/10 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="text-lg" aria-hidden="true">
                    {day.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-medium text-parchment">
                      {formatDayLabel(day.date, index)}
                    </p>
                    <p className="truncate text-xs text-parchment/70">
                      {day.condition}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-mono text-xs text-parchment">
                  <span>{day.tempMax}°</span>
                  <span className="text-parchment/60"> / </span>
                  <span className="text-parchment/80">{day.tempMin}°</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
