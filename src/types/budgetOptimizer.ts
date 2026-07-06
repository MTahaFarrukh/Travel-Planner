import type { BudgetCategory } from './budget'

export interface BudgetOptimizationSuggestion {
  id: string
  category: BudgetCategory
  title: string
  description: string
  potentialSavings: number
}

export interface BudgetOptimizationResult {
  totalSpent: number
  budgetLimit: number
  overBudget: number
  isOverBudget: boolean
  suggestions: BudgetOptimizationSuggestion[]
  optimizedBreakdown: Record<BudgetCategory, number>
  totalPotentialSavings: number
  summary: string
  source: 'ai' | 'local'
  generatedAt: string
}

export interface BudgetOptimizerAiPayload {
  summary: string
  suggestions: {
    category: BudgetCategory
    title: string
    description: string
    potentialSavings: number
  }[]
  optimizedBreakdown: Record<BudgetCategory, number>
}
