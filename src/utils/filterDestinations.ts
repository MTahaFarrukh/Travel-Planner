import type { Destination, DestinationCategory } from '../types/destination'

export function filterDestinations(
  items: Destination[],
  query: string,
  category: DestinationCategory | null,
): Destination[] {
  const normalized = query.trim().toLowerCase()

  return items.filter((destination) => {
    const matchesCategory =
      category === null || destination.category === category

    if (!normalized) return matchesCategory

    const matchesQuery =
      destination.name.toLowerCase().includes(normalized) ||
      destination.country.toLowerCase().includes(normalized)

    return matchesCategory && matchesQuery
  })
}
