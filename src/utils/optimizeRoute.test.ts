import { describe, expect, it } from 'vitest'
import { optimizeStopOrder } from './optimizeRoute'

const start = { lat: 35.0116, lon: 135.7681 }

describe('optimizeStopOrder', () => {
  it('orders nearby stops together and reduces total distance', () => {
    const stops = [
      {
        activityId: 'a',
        title: 'North',
        lat: 35.02,
        lon: 135.77,
        visitDurationMin: 60,
      },
      {
        activityId: 'b',
        title: 'South',
        lat: 35.0,
        lon: 135.76,
        visitDurationMin: 60,
      },
      {
        activityId: 'c',
        title: 'Near North',
        lat: 35.021,
        lon: 135.771,
        visitDurationMin: 60,
      },
    ]

    const result = optimizeStopOrder(stops, start)

    expect(result.ordered).toHaveLength(3)
    expect(result.clusters).toBeGreaterThanOrEqual(2)
    expect(result.optimizedDistanceKm).toBeLessThanOrEqual(
      result.originalDistanceKm,
    )

    const northIndex = result.ordered.findIndex(
      (stop) => stop.activityId === 'a',
    )
    const nearNorthIndex = result.ordered.findIndex(
      (stop) => stop.activityId === 'c',
    )
    expect(Math.abs(northIndex - nearNorthIndex)).toBe(1)
  })

  it('assigns route order metadata', () => {
    const stops = [
      {
        activityId: 'x',
        title: 'One',
        lat: 35.01,
        lon: 135.76,
        visitDurationMin: 60,
      },
      {
        activityId: 'y',
        title: 'Two',
        lat: 35.015,
        lon: 135.765,
        visitDurationMin: 60,
      },
    ]

    const result = optimizeStopOrder(stops, start)
    expect(result.ordered[0].order).toBe(1)
    expect(result.ordered[1].order).toBe(2)
  })
})
