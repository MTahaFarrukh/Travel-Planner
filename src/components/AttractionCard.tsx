import type { AttractionWithDistance } from '../types/attraction'
import { formatDistanceKm } from '../utils/haversine'
import { focusRingOnParchment } from '../utils/a11y'
import CategoryBadge from './CategoryBadge'
import RatingBadge from './RatingBadge'

interface AttractionCardProps {
  attraction: AttractionWithDistance
  onAdd: (attraction: AttractionWithDistance) => void
  isAdded?: boolean
}

export default function AttractionCard({
  attraction,
  onAdd,
  isAdded = false,
}: AttractionCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-parchment text-ink shadow-md motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl">
      <div className="relative h-36 overflow-hidden sm:h-40">
        <img
          src={attraction.imageUrl}
          alt={attraction.name}
          width={480}
          height={320}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="absolute left-3 top-3">
          <CategoryBadge category={attraction.category} variant="overlay" />
        </div>
        <p className="absolute bottom-3 right-3 rounded-full bg-ink/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-parchment backdrop-blur-sm">
          {formatDistanceKm(attraction.distanceKm)}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">
            {attraction.name}
          </h3>
          <RatingBadge rating={attraction.rating} />
        </div>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">
          {attraction.description}
        </p>

        <button
          type="button"
          onClick={() => onAdd(attraction)}
          disabled={isAdded}
          className={`mt-4 w-full rounded-xl px-4 py-2.5 font-mono text-xs uppercase tracking-wide motion-safe:transition-colors ${focusRingOnParchment} ${
            isAdded
              ? 'cursor-default bg-teal/20 text-teal'
              : 'bg-teal text-parchment hover:bg-teal/90'
          }`}
          aria-label={
            isAdded
              ? `${attraction.name} already added to itinerary`
              : `Add ${attraction.name} to itinerary`
          }
        >
          {isAdded ? '✓ Added' : 'Add to itinerary'}
        </button>
      </div>
    </article>
  )
}
