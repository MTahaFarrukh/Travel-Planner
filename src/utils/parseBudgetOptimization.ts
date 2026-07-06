import { BUDGET_CATEGORIES } from '../types/budget'
import type { BudgetBreakdown, BudgetCategory } from '../types/budget'
import type {
  BudgetOptimizationResult,
  BudgetOptimizationSuggestion,
  BudgetOptimizerAiPayload,
} from '../types/budgetOptimizer'
import { calculateBudgetTotal } from './budget'
import { formatCurrency } from './formatCurrency'

function stripJsonFences(raw: string): string {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  return fenced ? fenced[1].trim() : trimmed
}

function isCategory(value: unknown): value is BudgetCategory {
  return BUDGET_CATEGORIES.some((category) => category.id === value)
}

function isAiPayload(value: unknown): value is BudgetOptimizerAiPayload {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  if (typeof record.summary !== 'string') return false
  if (!Array.isArray(record.suggestions)) return false
  if (!record.optimizedBreakdown || typeof record.optimizedBreakdown !== 'object') {
    return false
  }

  const breakdown = record.optimizedBreakdown as Record<string, unknown>
  const validBreakdown = BUDGET_CATEGORIES.every(
    (category) => typeof breakdown[category.id] === 'number',
  )
  if (!validBreakdown) return false

  return record.suggestions.every((item) => {
    if (!item || typeof item !== 'object') return false
    const suggestion = item as Record<string, unknown>
    return (
      isCategory(suggestion.category) &&
      typeof suggestion.title === 'string' &&
      typeof suggestion.description === 'string' &&
      typeof suggestion.potentialSavings === 'number'
    )
  })
}

function suggestionsFromPayload(
  payload: BudgetOptimizerAiPayload,
): BudgetOptimizationSuggestion[] {
  return payload.suggestions.map((suggestion) => ({
    id: crypto.randomUUID(),
    category: suggestion.category,
    title: suggestion.title.trim(),
    description: suggestion.description.trim(),
    potentialSavings: Math.max(0, Math.round(suggestion.potentialSavings)),
  }))
}

export function resultFromOptimization(
  budget: BudgetBreakdown,
  limit: number,
  payload: BudgetOptimizerAiPayload,
  source: BudgetOptimizationResult['source'],
): BudgetOptimizationResult {
  const totalSpent = calculateBudgetTotal(budget)
  const overBudget = Math.max(0, totalSpent - limit)
  const suggestions = suggestionsFromPayload(payload)
  const totalPotentialSavings = suggestions.reduce(
    (sum, item) => sum + item.potentialSavings,
    0,
  )

  const optimizedBreakdown = BUDGET_CATEGORIES.reduce(
    (acc, category) => {
      acc[category.id] = Math.max(
        0,
        Math.round(payload.optimizedBreakdown[category.id]),
      )
      return acc
    },
    {} as Record<BudgetCategory, number>,
  )

  return {
    totalSpent,
    budgetLimit: limit,
    overBudget,
    isOverBudget: overBudget > 0,
    suggestions,
    optimizedBreakdown,
    totalPotentialSavings,
    summary: payload.summary.trim(),
    source,
    generatedAt: new Date().toISOString(),
  }
}

export function parseBudgetOptimization(
  raw: string,
  budget: BudgetBreakdown,
  limit: number,
): BudgetOptimizationResult | null {
  try {
    const parsed = JSON.parse(stripJsonFences(raw)) as unknown
    if (!isAiPayload(parsed)) return null
    return resultFromOptimization(budget, limit, parsed, 'ai')
  } catch {
    return null
  }
}

export function withinBudgetMessage(
  total: number,
  limit: number,
): string {
  const remaining = limit - total
  return `You're ${formatCurrency(remaining)} under your ${formatCurrency(limit)} limit. Here are optional ways to save even more.`
}
