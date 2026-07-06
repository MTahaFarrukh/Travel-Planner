import type { BudgetBreakdown } from '../../types/budget'
import type { BudgetOptimizationResult } from '../../types/budgetOptimizer'
import { calculateBudgetTotal } from '../../utils/budget'
import { formatCurrency } from '../../utils/formatCurrency'
import { focusRingOnInk } from '../../utils/a11y'
import EmptyState from '../EmptyState'
import LoadingOverlay from '../LoadingOverlay'
import Skeleton from '../Skeleton'
import BudgetComparisonChart from './BudgetComparisonChart'
import BudgetOverviewBars from './BudgetOverviewBars'
import BudgetSavingsChart from './BudgetSavingsChart'
import BudgetSuggestionCard, { getCategoryMeta } from './BudgetSuggestionCard'

interface BudgetOptimizerPanelProps {
  budget: BudgetBreakdown
  budgetLimit: number
  result: BudgetOptimizationResult | null
  loading: boolean
  onAnalyze: () => void
}

export default function BudgetOptimizerPanel({
  budget,
  budgetLimit,
  result,
  loading,
  onAnalyze,
}: BudgetOptimizerPanelProps) {
  const total = calculateBudgetTotal(budget)
  const isOver = total > budgetLimit

  return (
    <section
      className="mt-10 rounded-2xl border border-parchment/10 bg-parchment/5 p-5 sm:p-6"
      aria-labelledby="budget-optimizer-heading"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            AI Optimizer
          </p>
          <h2
            id="budget-optimizer-heading"
            className="mt-1 font-display text-2xl font-semibold text-parchment"
          >
            Smart budget analysis
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-parchment/75">
            Analyzes hotels, food, transport, activities, and shopping. If you
            exceed your limit, Waymark suggests practical cuts with estimated
            savings.
          </p>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading}
          className={`shrink-0 rounded-xl bg-brass px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink motion-safe:transition-colors hover:bg-brass/90 disabled:cursor-wait disabled:opacity-70 ${focusRingOnInk}`}
        >
          {loading ? 'Analyzing…' : 'Analyze budget'}
        </button>
      </div>

      {loading && !result && (
        <div className="mt-6 space-y-4" aria-hidden="true">
          <Skeleton className="h-20 w-full" variant="parchment" rounded="2xl" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-40 w-full" variant="parchment" rounded="2xl" />
            <Skeleton className="h-40 w-full" variant="parchment" rounded="2xl" />
          </div>
        </div>
      )}

      {result && (
        <div className="relative mt-6 space-y-6">
          {loading && <LoadingOverlay label="Re-analyzing budget…" />}
          <div
            className={`rounded-2xl border px-5 py-4 ${
              result.isOverBudget
                ? 'border-rust/30 bg-rust/10'
                : 'border-teal/30 bg-teal/10'
            }`}
          >
            <p className="text-sm leading-relaxed text-parchment">{result.summary}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-parchment/60">
                  Potential savings
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-teal">
                  {formatCurrency(result.totalPotentialSavings)}
                </p>
              </div>
              {result.isOverBudget && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-parchment/60">
                    Over limit
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-rust">
                    {formatCurrency(result.overBudget)}
                  </p>
                </div>
              )}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-parchment/60">
                  Optimized total
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-brass">
                  {formatCurrency(calculateBudgetTotal(result.optimizedBreakdown))}
                </p>
              </div>
            </div>

            {isOver && result.totalPotentialSavings >= result.overBudget && (
              <p className="mt-3 font-mono text-xs text-teal">
                Applying these suggestions could bring you within your{' '}
                {formatCurrency(budgetLimit)} limit.
              </p>
            )}
          </div>

          <BudgetSavingsChart result={result} />

          {result.suggestions.length > 0 && (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {result.suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <BudgetSuggestionCard
                    suggestion={suggestion}
                    categoryMeta={getCategoryMeta(suggestion.category)}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <BudgetOverviewBars budget={budget} result={result} />
            <BudgetComparisonChart budget={budget} result={result} />
          </div>
        </div>
      )}

      {!result && !loading && (
        <EmptyState
          className="mt-6 border-parchment/20 py-10"
          title="Run the optimizer"
          description="Set your category amounts and budget limit, then analyze to see savings suggestions and charts."
        />
      )}
    </section>
  )
}
