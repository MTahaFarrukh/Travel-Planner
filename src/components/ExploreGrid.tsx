import { useMemo, useState } from 'react'
import { destinations, destinationCategories } from '../data/destinations.js'
import { useTrip } from '../context/TripContext'
import type { Destination, DestinationCategory } from '../types/destination'
import { focusRingOnInk } from '../utils/a11y'
import { filterDestinations } from '../utils/filterDestinations'
import CategoryFilter from './CategoryFilter'
import DestinationCard from './DestinationCard'
import EmptyState from './EmptyState'
import ScrollReveal from './ScrollReveal'
import SearchInput from './SearchInput'
import WeatherForecastPanel from './WeatherForecastPanel'

export default function ExploreGrid() {
  const { setActiveDestinationId } = useTrip()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState<DestinationCategory | null>(null)
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null)

  const filtered = useMemo(
    () => filterDestinations(destinations, searchQuery, selectedCategory),
    [searchQuery, selectedCategory],
  )

  const hasFilters = searchQuery.length > 0 || selectedCategory !== null

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <CategoryFilter
          categories={destinationCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {filtered.length === 0 ? (
          <EmptyState
            className="flex-1"
            title="No destinations found"
            description="Try a different search term or clear your filters to see all destinations."
            icon={
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
            }
            action={
              hasFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                  }}
                  className={`rounded-xl border border-parchment/25 px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-parchment motion-safe:transition-colors hover:border-brass/50 hover:text-brass ${focusRingOnInk}`}
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <ul
            key={`${searchQuery}-${selectedCategory}`}
            className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {filtered.map((destination, index) => (
              <li key={destination.id}>
                <ScrollReveal delay={index * 90}>
                  <DestinationCard
                    destination={destination}
                    isSelected={selectedDestination?.id === destination.id}
                    onSelect={(item) => {
                      setSelectedDestination(item)
                      setActiveDestinationId(item.id)
                    }}
                  />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        )}

        {selectedDestination && (
          <WeatherForecastPanel
            destination={selectedDestination}
            onClose={() => setSelectedDestination(null)}
          />
        )}
      </div>
    </div>
  )
}
