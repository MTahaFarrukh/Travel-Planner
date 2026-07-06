import { BUDGET_CATEGORIES } from '../../types/budget'
import type { BudgetCategoryConfig } from '../../types/budget'
import type { BudgetOptimizationSuggestion } from '../../types/budgetOptimizer'
import { formatCurrency } from '../../utils/formatCurrency'

interface BudgetSuggestionCardProps {
  suggestion: BudgetOptimizationSuggestion
  categoryMeta: BudgetCategoryConfig
}

export default function BudgetSuggestionCard({
  suggestion,
  categoryMeta,
}: BudgetSuggestionCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-parchment text-ink shadow-md motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg">
      <div
        className="px-5 pb-3 pt-5"
        style={{
          background: `linear-gradient(135deg, ${categoryMeta.color}22, transparent)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide"
            style={{
              backgroundColor: `${categoryMeta.color}22`,
              color: categoryMeta.color,
            }}
          >
            {categoryMeta.label}
          </span>
          <span className="rounded-full bg-teal/15 px-2.5 py-1 font-mono text-xs font-medium text-teal">
            Save {formatCurrency(suggestion.potentialSavings)}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
          {suggestion.title}
        </h3>
      </div>

      <p className="flex-1 px-5 pb-5 text-sm leading-relaxed text-ink/75">
        {suggestion.description}
      </p>
    </article>
  )
}

export function getCategoryMeta(categoryId: BudgetOptimizationSuggestion['category']) {
  return BUDGET_CATEGORIES.find((item) => item.id === categoryId)!
}
