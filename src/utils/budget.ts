import type { BudgetBreakdown } from '../types/budget'

export function calculateBudgetTotal(budget: BudgetBreakdown): number {
  return (
    budget.hotels +
    budget.food +
    budget.transport +
    budget.activities +
    budget.shopping
  )
}
