import { describe, expect, it } from 'vitest'
import type { Activity } from '../types/itinerary'
import { sortActivitiesByTime } from './sortActivitiesByTime'

function activity(
  id: string,
  title: string,
  time?: string,
): Activity {
  return { id, dayNumber: 1, title, time }
}

describe('sortActivitiesByTime', () => {
  it('sorts timed activities chronologically', () => {
    const input = [
      activity('c', 'Lunch', '13:00'),
      activity('a', 'Breakfast', '08:30'),
      activity('b', 'Museum', '10:15'),
    ]

    const sorted = sortActivitiesByTime(input)

    expect(sorted.map((a) => a.id)).toEqual(['a', 'b', 'c'])
    expect(sorted.map((a) => a.time)).toEqual(['08:30', '10:15', '13:00'])
  })

  it('places activities without a time after timed ones', () => {
    const input = [
      activity('untimed', 'Free afternoon'),
      activity('early', 'Coffee', '07:00'),
      activity('late', 'Dinner', '19:00'),
    ]

    const sorted = sortActivitiesByTime(input)

    expect(sorted.map((a) => a.id)).toEqual(['early', 'late', 'untimed'])
  })

  it('does not throw when all activities lack a time', () => {
    const input = [
      activity('a', 'Wander'),
      activity('b', 'Rest'),
    ]

    expect(() => sortActivitiesByTime(input)).not.toThrow()
    expect(sortActivitiesByTime(input)).toHaveLength(2)
  })

  it('does not mutate the original array', () => {
    const input = [
      activity('b', 'Second', '12:00'),
      activity('a', 'First', '09:00'),
    ]
    const copy = [...input]

    sortActivitiesByTime(input)

    expect(input).toEqual(copy)
  })
})
