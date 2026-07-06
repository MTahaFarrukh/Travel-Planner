import { BUDGET_CATEGORIES } from '../../types/budget'
import type { BudgetBreakdown } from '../../types/budget'
import type { BudgetOptimizationResult } from '../../types/budgetOptimizer'
import { formatCurrency } from '../../utils/formatCurrency'

interface BudgetOverviewBarsProps {
  budget: BudgetBreakdown
  result: BudgetOptimizationResult | null
}

export default function BudgetOverviewBars({
  budget,
  result,
}: BudgetOverviewBarsProps) {
  const total = result?.totalSpent ?? Object.values(budget).reduce((a, b) => a + b, 0)

  return (
    <div className="rounded-2xl border border-parchment/10 bg-parchment/5 p-5 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Category split
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-parchment">
            Spending by category
          </h2>
        </div>
        {result && (
          <p className="font-mono text-xs text-parchment/60">
            {result.source === 'ai' ? 'AI optimized' : 'Local analysis'}
          </p>
        )}
      </div>

      <ul className="mt-5 space-y-4">
        {BUDGET_CATEGORIES.map((category) => {
          const current = budget[category.id]
          const optimized = result?.optimizedBreakdown[category.id] ?? current
          const share = total > 0 ? (current / total) * 100 : 0
          const savings = Math.max(0, current - optimized)
          const optimizedShare = total > 0 ? (optimized / total) * 100 : 0

          return (
            <li key={category.id}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-wide text-parchment/80">
                  {category.label}
                </span>
                <div className="text-right">
                  <span className="font-mono text-sm text-parchment">
                    {formatCurrency(current)}
                  </span>
                  {result && savings > 0 && (
                    <span className="ml-2 font-mono text-xs text-teal">
                      −{formatCurrency(savings)}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-parchment/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full motion-safe:transition-all motion-safe:duration-500"
                  style={{
                    width: `${share}%`,
                    backgroundColor: category.color,
                    opacity: 0.35,
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full motion-safe:transition-all motion-safe:duration-500"
                  style={{
                    width: `${share}%`,
                    backgroundColor: category.color,
                  }}
                  role="progressbar"
                  aria-valuenow={Math.round(share)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${category.label} share of budget`}
                />
                {result && savings > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full border-2 border-dashed border-teal/80 motion-safe:transition-all motion-safe:duration-500"
                    style={{ width: `${optimizedShare}%` }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
