import { useMemo, useState } from 'react'
import { destinations, destinationCategories } from '../data/destinations.js'
import type { Destination, DestinationCategory } from '../types/destination'
import { filterDestinations } from '../utils/filterDestinations'
import CategoryFilter from './CategoryFilter'
import DestinationCard from './DestinationCard'
import ScrollReveal from './ScrollReveal'
import SearchInput from './SearchInput'
import WeatherForecastPanel from './WeatherForecastPanel'

export default function ExploreGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState<DestinationCategory | null>(null)
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null)

  const filtered = useMemo(
    () => filterDestinations(destinations, searchQuery, selectedCategory),
    [searchQuery, selectedCategory],
  )

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
          <p className="flex-1 text-center font-mono text-sm text-parchment/70">
            No destinations match your search.
          </p>
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
                    onSelect={setSelectedDestination}
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
