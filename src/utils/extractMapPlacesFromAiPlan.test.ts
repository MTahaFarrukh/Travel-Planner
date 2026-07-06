import { describe, expect, it } from 'vitest'
import { extractMapPlacesFromAiPlan } from './extractMapPlacesFromAiPlan'

const samplePlan = `
# Kyoto Trip

## Day 1
### Morning
- Fushimi Inari Shrine — arrive early at 8:00 AM for fewer crowds
### Afternoon
- Nishiki Market food walk
### Evening
- Gion district stroll at 7:00 PM

## Day 2
- Arashiyama bamboo grove and river walk
`

describe('extractMapPlacesFromAiPlan', () => {
  it('extracts places with names, descriptions, and time blocks', () => {
    const places = extractMapPlacesFromAiPlan(samplePlan, 'Kyoto, Japan')

    expect(places.length).toBeGreaterThanOrEqual(4)
    expect(places[0].name).toContain('Fushimi Inari')
    expect(places[0].description).toContain('Fushimi Inari')
    expect(places[0].estimatedTime).toMatch(/8:00|Morning/)
    expect(places[0].lat).toBeCloseTo(35.0116, 1)
    expect(places[0].lon).toBeCloseTo(135.7681, 1)
  })

  it('returns empty array for unknown destinations', () => {
    expect(extractMapPlacesFromAiPlan(samplePlan, 'Unknown City')).toEqual([])
  })
})
