import { describe, expect, it } from 'vitest'
import { DEFAULT_BUDGET } from '../types/budget'
import { calculateBudgetTotal } from './budget'

describe('calculateBudgetTotal', () => {
  it('sums all category amounts', () => {
    expect(calculateBudgetTotal(DEFAULT_BUDGET)).toBe(2100)
  })

  it('updates when any single category changes', () => {
    expect(
      calculateBudgetTotal({
        flights: 0,
        hotels: 500,
        food: 200,
        activities: 100,
      }),
    ).toBe(800)
  })

  it('returns zero for an empty budget', () => {
    expect(
      calculateBudgetTotal({
        flights: 0,
        hotels: 0,
        food: 0,
        activities: 0,
      }),
    ).toBe(0)
  })
})
