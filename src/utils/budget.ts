import type { BudgetBreakdown } from '../types/budget'

export function calculateBudgetTotal(budget: BudgetBreakdown): number {
  return budget.flights + budget.hotels + budget.food + budget.activities
}
