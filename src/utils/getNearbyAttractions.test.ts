import { describe, expect, it } from 'vitest'
import { attractions } from '../data/attractions.js'
import { getNearbyAttractions } from './getNearbyAttractions'

describe('getNearbyAttractions', () => {
  it('returns attractions within the radius sorted by distance', () => {
    const nearby = getNearbyAttractions(35.0116, 135.7681, attractions, 5)

    expect(nearby.length).toBeGreaterThan(0)
    expect(nearby.every((item) => item.distanceKm <= 5)).toBe(true)
    expect(nearby[0].distanceKm).toBeLessThanOrEqual(nearby.at(-1)!.distanceKm)
  })

  it('returns empty when nothing is within range', () => {
    const nearby = getNearbyAttractions(0, 0, attractions, 0.1)
    expect(nearby).toEqual([])
  })
})
