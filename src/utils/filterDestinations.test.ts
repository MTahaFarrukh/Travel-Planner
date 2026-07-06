import { describe, expect, it } from 'vitest'
import { destinations } from '../data/destinations.js'
import { filterDestinations } from './filterDestinations'

describe('filterDestinations', () => {
  it('returns all destinations when the query is empty', () => {
    expect(filterDestinations(destinations, '', null)).toHaveLength(
      destinations.length,
    )
    expect(filterDestinations(destinations, '   ', null)).toHaveLength(
      destinations.length,
    )
  })

  it('filters destinations by name', () => {
    const result = filterDestinations(destinations, 'bali', null)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bali')
  })

  it('filters destinations by country', () => {
    const result = filterDestinations(destinations, 'japan', null)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Kyoto')
  })

  it('filters destinations by category', () => {
    expect(filterDestinations(destinations, '', 'beach').map((d) => d.id)).toEqual(
      ['bali', 'santorini'],
    )
    expect(filterDestinations(destinations, '', 'city').map((d) => d.id)).toEqual([
      'barcelona',
    ])
    expect(
      filterDestinations(destinations, '', 'mountain').map((d) => d.id),
    ).toEqual(['banff'])
    expect(
      filterDestinations(destinations, '', 'cultural').map((d) => d.id),
    ).toEqual(['kyoto'])
    expect(
      filterDestinations(destinations, '', 'adventure').map((d) => d.id),
    ).toEqual(['queenstown'])
  })

  it('combines search query and category filters', () => {
    const result = filterDestinations(destinations, 'ba', 'beach')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('bali')
  })

  it('returns an empty list when nothing matches without throwing', () => {
    expect(() =>
      filterDestinations(destinations, 'atlantis', null),
    ).not.toThrow()
    expect(filterDestinations(destinations, 'atlantis', null)).toEqual([])
    expect(filterDestinations(destinations, 'bali', 'city')).toEqual([])
  })
})
