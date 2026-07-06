export type BudgetCategory = 'flights' | 'hotels' | 'food' | 'activities'

export interface BudgetBreakdown {
  flights: number
  hotels: number
  food: number
  activities: number
}

export interface BudgetCategoryConfig {
  id: BudgetCategory
  label: string
  color: string
  max: number
}

export const BUDGET_CATEGORIES: BudgetCategoryConfig[] = [
  { id: 'flights', label: 'Flights', color: '#c99a3d', max: 5000 },
  { id: 'hotels', label: 'Hotels', color: '#b1502f', max: 5000 },
  { id: 'food', label: 'Food', color: '#3e6259', max: 3000 },
  { id: 'activities', label: 'Activities', color: '#152438', max: 2000 },
]

export const DEFAULT_BUDGET: BudgetBreakdown = {
  flights: 600,
  hotels: 900,
  food: 350,
  activities: 250,
}
