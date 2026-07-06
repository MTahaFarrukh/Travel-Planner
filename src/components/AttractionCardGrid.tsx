import type { AttractionWithDistance } from '../types/attraction'
import AttractionCard from './AttractionCard'
import EmptyState from './EmptyState'

interface AttractionCardGridProps {
  attractions: AttractionWithDistance[]
  addedIds: Set<string>
  onAdd: (attraction: AttractionWithDistance) => void
  emptyMessage?: string
}

export default function AttractionCardGrid({
  attractions,
  addedIds,
  onAdd,
  emptyMessage = 'No attractions found within 5 km of this destination.',
}: AttractionCardGridProps) {
  if (attractions.length === 0) {
    return (
      <EmptyState
        title="No nearby attractions"
        description={emptyMessage}
        icon={
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 22s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
          </svg>
        }
      />
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {attractions.map((attraction, index) => (
        <li
          key={attraction.id}
          className="motion-safe:animate-card-in"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <AttractionCard
            attraction={attraction}
            onAdd={onAdd}
            isAdded={addedIds.has(attraction.id)}
          />
        </li>
      ))}
    </ul>
  )
}
