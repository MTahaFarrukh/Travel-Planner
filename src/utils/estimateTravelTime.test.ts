import { describe, expect, it } from 'vitest'
import {
  estimateDurationMinutes,
  estimatesForAllModes,
  formatDuration,
  recommendTravelMode,
} from './estimateTravelTime'

describe('estimateTravelTime', () => {
  it('estimates walking duration without a buffer', () => {
    expect(estimateDurationMinutes(0.8, 'walking')).toBe(10)
    expect(estimateDurationMinutes(0.8, 'driving')).toBe(5)
  })

  it('recommends walking over driving for short hops', () => {
    expect(recommendTravelMode(0.8, true)).toBe('walking')
  })

  it('returns all four travel modes', () => {
    const estimates = estimatesForAllModes(3)
    expect(estimates).toHaveLength(4)
    expect(estimates.map((item) => item.mode)).toEqual([
      'walking',
      'driving',
      'metro',
      'taxi',
    ])
  })

  it('recommends walking for short hops', () => {
    expect(recommendTravelMode(0.5, true)).toBe('walking')
  })

  it('recommends metro for medium distances when available', () => {
    expect(recommendTravelMode(3, true)).toBe('metro')
  })

  it('recommends taxi when metro is unavailable', () => {
    expect(recommendTravelMode(3, false)).toBe('taxi')
  })

  it('formats durations under and over an hour', () => {
    expect(formatDuration(45)).toBe('45 min')
    expect(formatDuration(90)).toBe('1h 30m')
    expect(formatDuration(120)).toBe('2h')
  })
})
