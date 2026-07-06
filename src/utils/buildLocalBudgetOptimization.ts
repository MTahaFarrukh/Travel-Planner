import { BUDGET_CATEGORIES } from '../types/budget'
import type { BudgetBreakdown, BudgetCategory } from '../types/budget'
import type { BudgetOptimizationResult } from '../types/budgetOptimizer'
import { calculateBudgetTotal } from './budget'
import { formatCurrency } from './formatCurrency'
import { resultFromOptimization } from './parseBudgetOptimization'

const SAVINGS_TIPS: Record<BudgetCategory, string[]> = {
  hotels: [
    'Switch to a well-rated guesthouse or apartment rental instead of a central hotel.',
    'Book refundable stays in a neighbourhood one metro stop from the centre.',
    'Travel in shoulder season or stay Sunday–Thursday nights for lower rates.',
  ],
  food: [
    'Balance one splurge dinner with affordable local lunches and market snacks.',
    'Buy breakfast staples from a grocery store for two or three mornings.',
    'Skip hotel minibar and airport dining — eat where locals eat.',
  ],
  transport: [
    'Book flights mid-week and compare budget airlines with rail passes.',
    'Use public transit day passes instead of taxis between sights.',
    'Walk central districts and reserve rideshare for late-night trips only.',
  ],
  activities: [
    'Prioritise free walking tours and city parks over paid bundles.',
    'Buy a multi-attraction pass only if you will visit 3+ included sites.',
    'Reserve one signature experience and self-guide the rest.',
  ],
  shopping: [
    'Set a fixed souvenir cap and shop at local markets, not airport stores.',
    'Skip impulse gifts — photograph moments and buy one meaningful item.',
    'Compare duty-free prices online before buying abroad.',
  ],
}

export function buildLocalBudgetOptimization(
  budget: BudgetBreakdown,
  limit: number,
): BudgetOptimizationResult {
  const totalSpent = calculateBudgetTotal(budget)
  const overBudget = Math.max(0, totalSpent - limit)
  const optimized = { ...budget }

  if (overBudget === 0) {
    const suggestions = BUDGET_CATEGORIES.slice(0, 2).map((category, index) => ({
      category: category.id,
      title: `Optional ${category.label.toLowerCase()} trim`,
      description: SAVINGS_TIPS[category.id][index],
      potentialSavings: Math.min(75, Math.round(budget[category.id] * 0.1)),
    }))

    for (const suggestion of suggestions) {
      optimized[suggestion.category] = Math.max(
        0,
        optimized[suggestion.category] - suggestion.potentialSavings,
      )
    }

    const payload = {
      summary: `You're ${formatCurrency(limit - totalSpent)} under your ${formatCurrency(limit)} limit. These optional cuts could free up more for experiences.`,
      suggestions,
      optimizedBreakdown: optimized,
    }

    return resultFromOptimization(budget, limit, payload, 'local')
  }

  const ranked = BUDGET_CATEGORIES.map((category) => ({
    ...category,
    amount: budget[category.id],
  })).sort((a, b) => b.amount - a.amount)

  const suggestions: {
    category: BudgetCategory
    title: string
    description: string
    potentialSavings: number
  }[] = []

  let remaining = overBudget

  for (const category of ranked) {
    if (remaining <= 0) break
    if (category.amount < 100) continue

    const maxCut = Math.min(
      Math.round(category.amount * 0.25),
      category.amount - 50,
      remaining + 50,
    )
    const cut = Math.max(50, Math.min(maxCut, remaining))

    suggestions.push({
      category: category.id,
      title: `Reduce ${category.label.toLowerCase()} spend`,
      description: SAVINGS_TIPS[category.id][suggestions.length % 3],
      potentialSavings: cut,
    })

    optimized[category.id] = category.amount - cut
    remaining -= cut
  }

  const payload = {
    summary: `You're ${formatCurrency(overBudget)} over your ${formatCurrency(limit)} limit. These changes could bring you back on track.`,
    suggestions,
    optimizedBreakdown: optimized,
  }

  return resultFromOptimization(budget, limit, payload, 'local')
}
