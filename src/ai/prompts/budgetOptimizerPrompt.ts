import { BUDGET_CATEGORIES } from '../../types/budget'
import type { BudgetBreakdown } from '../../types/budget'
import { calculateBudgetTotal } from '../../utils/budget'
import { formatCurrency } from '../../utils/formatCurrency'

export function buildBudgetOptimizerPrompt(
  budget: BudgetBreakdown,
  limit: number,
): string {
  const total = calculateBudgetTotal(budget)
  const lines = BUDGET_CATEGORIES.map(
    (category) =>
      `- ${category.label}: ${formatCurrency(budget[category.id])}`,
  )

  return [
    'Analyze this trip budget and help the traveler stay within their limit.',
    '',
    `Budget limit: ${formatCurrency(limit)}`,
    `Current total: ${formatCurrency(total)}`,
    `Over by: ${formatCurrency(Math.max(0, total - limit))}`,
    '',
    'Category breakdown:',
    ...lines,
    '',
    'Return ONLY valid JSON (no markdown) with this shape:',
    '{',
    '  "summary": "2-3 sentence overview",',
    '  "suggestions": [',
    '    { "category": "hotels|food|transport|activities|shopping", "title": "...", "description": "...", "potentialSavings": 120 }',
    '  ],',
    '  "optimizedBreakdown": { "hotels": 0, "food": 0, "transport": 0, "activities": 0, "shopping": 0 }',
    '}',
    '',
    total > limit
      ? 'The budget exceeds the limit. Provide 3-6 practical, specific suggestions with realistic savings that sum to at least the overage.'
      : 'The budget is within the limit. Provide 2-3 optional tips to save further anyway, with modest savings.',
    'optimizedBreakdown must reflect category totals after applying suggestions.',
    'Do not suggest cutting below essential travel needs.',
  ].join('\n')
}

export function validateBudgetLimit(limit: number): string | null {
  if (!Number.isFinite(limit) || limit < 100) {
    return 'Please set a budget limit of at least $100.'
  }
  return null
}
