import type { Destination } from '../types/destination'
import { useWeather } from '../hooks/useWeather.js'
import { focusRingOnParchment } from '../utils/a11y'
import Skeleton from './Skeleton'

interface DestinationCardProps {
  destination: Destination
  isSelected?: boolean
  onSelect?: (destination: Destination) => void
}

function WeatherBadge({
  loading,
  error,
  temperature,
  unit,
  condition,
  icon,
  overlay = false,
}: {
  loading: boolean
  error: string | null
  temperature?: number
  unit?: string
  condition?: string
  icon?: string
  overlay?: boolean
}) {
  const baseClass = overlay
    ? 'bg-ink/55 text-parchment backdrop-blur-sm'
    : 'bg-teal/15 text-teal'

  if (loading) {
    return (
      <Skeleton
        className="h-7 w-20"
        variant="ink"
        rounded="full"
        aria-label="Loading weather"
      />
    )
  }

  if (error) {
    return (
      <div
        className={`rounded-full px-3 py-1 font-mono text-xs ${
          overlay ? 'bg-rust/80 text-parchment' : 'bg-rust/15 text-rust'
        }`}
        role="status"
        aria-label={`Weather unavailable: ${error}`}
      >
        Unavailable
      </div>
    )
  }

  if (temperature != null) {
    return (
      <div
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs ${baseClass}`}
        aria-label={`${temperature} degrees ${unit ?? 'Celsius'}, ${condition ?? 'current conditions'}`}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        <span aria-hidden="true">
          {temperature}°{unit ?? 'C'}
        </span>
      </div>
    )
  }

  return null
}

const categoryAccent: Record<Destination['category'], string> = {
  beach: 'text-brass',
  city: 'text-rust',
  mountain: 'text-teal',
  cultural: 'text-brass',
  adventure: 'text-rust',
}

export default function DestinationCard({
  destination,
  isSelected = false,
  onSelect,
}: DestinationCardProps) {
  const { data, loading, error } = useWeather(destination.lat, destination.lon)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(destination)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(destination)
        }
      }}
      aria-pressed={isSelected}
      aria-label={`${destination.name}, ${destination.country}. View weather forecast.`}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-parchment text-ink shadow-md outline-none motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl ${focusRingOnParchment} ${
        isSelected ? 'ring-2 ring-brass' : ''
      }`}
    >
      <div className="relative h-40 overflow-hidden sm:h-44">
        <img
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          width={640}
          height={400}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute right-3 top-3">
          <WeatherBadge
            loading={loading}
            error={error}
            temperature={data?.current.temperature}
            unit={data?.current.unit}
            condition={data?.current.condition}
            icon={data?.current.icon}
            overlay
          />
        </div>
        <p
          className={`absolute bottom-3 left-4 font-mono text-xs uppercase tracking-widest text-parchment ${categoryAccent[destination.category]}`}
          style={{ textShadow: '0 1px 8px rgba(21,36,56,0.8)' }}
        >
          {destination.category}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl">
          {destination.name}
        </h3>
        <p className="mt-0.5 text-sm text-ink/70">{destination.country}</p>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/80">
          {destination.tagline}
        </p>
      </div>
    </article>
  )
}
