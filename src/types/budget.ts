export type BudgetCategory =
  | 'hotels'
  | 'food'
  | 'transport'
  | 'activities'
  | 'shopping'

export interface BudgetBreakdown {
  hotels: number
  food: number
  transport: number
  activities: number
  shopping: number
}

export interface BudgetCategoryConfig {
  id: BudgetCategory
  label: string
  color: string
  max: number
}

export const BUDGET_CATEGORIES: BudgetCategoryConfig[] = [
  { id: 'hotels', label: 'Hotels', color: '#b1502f', max: 5000 },
  { id: 'food', label: 'Food', color: '#3e6259', max: 3000 },
  { id: 'transport', label: 'Transport', color: '#c99a3d', max: 5000 },
  { id: 'activities', label: 'Activities', color: '#152438', max: 2000 },
  { id: 'shopping', label: 'Shopping', color: '#6b4c7a', max: 2000 },
]

export const DEFAULT_BUDGET: BudgetBreakdown = {
  hotels: 900,
  food: 350,
  transport: 600,
  activities: 250,
  shopping: 200,
}

/** @deprecated Legacy persisted shape — migrated to transport on load. */
export interface LegacyBudgetBreakdown {
  flights: number
  hotels: number
  food: number
  activities: number
}

export function migrateBudgetBreakdown(value: unknown): BudgetBreakdown {
  if (!value || typeof value !== 'object') return DEFAULT_BUDGET

  const record = value as Record<string, unknown>

  if (
    typeof record.hotels === 'number' &&
    typeof record.food === 'number' &&
    typeof record.transport === 'number' &&
    typeof record.activities === 'number' &&
    typeof record.shopping === 'number'
  ) {
    return {
      hotels: record.hotels,
      food: record.food,
      transport: record.transport,
      activities: record.activities,
      shopping: record.shopping,
    }
  }

  if (
    typeof record.flights === 'number' &&
    typeof record.hotels === 'number' &&
    typeof record.food === 'number' &&
    typeof record.activities === 'number'
  ) {
    return {
      hotels: record.hotels,
      food: record.food,
      transport: record.flights,
      activities: record.activities,
      shopping: 0,
    }
  }

  return DEFAULT_BUDGET
}
