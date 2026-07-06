import { describe, expect, it } from 'vitest'
import { buildLocalPackingList } from './buildLocalPackingList'

describe('buildLocalPackingList', () => {
  it('creates items across all categories', () => {
    const checklist = buildLocalPackingList({
      destination: 'Kyoto, Japan',
      travelMonth: 'april',
      weather: 'rainy',
      tripType: 'adventure',
      activities: ['hiking', 'photography'],
    })

    const categories = new Set(checklist.items.map((item) => item.category))

    expect(checklist.items.length).toBeGreaterThan(10)
    expect(categories.has('documents')).toBe(true)
    expect(categories.has('clothing')).toBe(true)
    expect(categories.has('electronics')).toBe(true)
    expect(categories.has('medicine')).toBe(true)
    expect(categories.has('accessories')).toBe(true)
    expect(categories.has('essentials')).toBe(true)
    expect(checklist.source).toBe('local')
  })

  it('includes weather and activity specific items', () => {
    const checklist = buildLocalPackingList({
      destination: 'Bali, Indonesia',
      travelMonth: 'july',
      weather: 'hot',
      tripType: 'leisure',
      activities: ['beach'],
    })

    const labels = checklist.items.map((item) => item.label)

    expect(labels.some((label) => /swimwear/i.test(label))).toBe(true)
    expect(labels.some((label) => /sunscreen/i.test(label))).toBe(true)
  })
})
