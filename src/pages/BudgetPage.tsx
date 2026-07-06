import { useEffect, useMemo, useRef, useState } from 'react'
import ErrorAlert from '../components/ErrorAlert'
import BudgetCategoryInput from '../components/BudgetCategoryInput'
import BudgetChart from '../components/BudgetChart'
import BudgetLimitInput from '../components/budget/BudgetLimitInput'
import BudgetOptimizerPanel from '../components/budget/BudgetOptimizerPanel'
import { useTrip } from '../context/TripContext'
import { useAiBudgetOptimizer } from '../hooks/useAiBudgetOptimizer'
import {
  BUDGET_CATEGORIES,
  type BudgetCategory,
} from '../types/budget'
import { calculateBudgetTotal } from '../utils/budget'
import { formatCurrency } from '../utils/formatCurrency'
import { pageHeading, pageSection } from '../utils/a11y'

export default function BudgetPage() {
  const { budget, setBudgetCategory } = useTrip()
  const {
    budgetLimit,
    setBudgetLimit,
    result,
    loading,
    error,
    analyzeBudget,
  } = useAiBudgetOptimizer(budget)
  const [bumpTotal, setBumpTotal] = useState(false)
  const isFirstRender = useRef(true)

  const total = useMemo(() => calculateBudgetTotal(budget), [budget])
  const isOverLimit = total > budgetLimit

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setBumpTotal(true)
    const timer = window.setTimeout(() => setBumpTotal(false), 350)
    return () => window.clearTimeout(timer)
  }, [total])

  function handleCategoryChange(category: BudgetCategory, value: number) {
    setBudgetCategory(category, value)
  }

  return (
    <section className={pageSection}>
      <header className="animate-section-header mb-8 sm:mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-teal">
          Budget
        </p>
        <h1 className={pageHeading}>
          Estimate your trip
        </h1>
        <p className="mt-3 max-w-xl text-parchment/80">
          Set spending per category, track your limit with progress bars, and
          let the AI optimizer suggest cuts when you go over budget.
        </p>
      </header>

      <div className="mb-6 space-y-6">
        <BudgetLimitInput
          budgetLimit={budgetLimit}
          totalSpent={total}
          onChange={setBudgetLimit}
        />

        <div
          className={`rounded-2xl border px-4 py-6 text-center sm:px-6 sm:py-8 ${
            isOverLimit
              ? 'border-rust/30 bg-rust/10'
              : 'border-brass/30 bg-brass/10'
          }`}
        >
          <p
            className={`font-mono text-xs uppercase tracking-widest ${
              isOverLimit ? 'text-rust' : 'text-brass'
            }`}
          >
            Estimated total
          </p>
          <p
            className={`mt-2 font-display text-4xl font-semibold text-parchment motion-safe:transition-all motion-safe:duration-500 sm:text-5xl ${bumpTotal ? 'animate-total-bump' : ''}`}
            aria-live="polite"
          >
            {formatCurrency(total)}
          </p>
          {isOverLimit && (
            <p className="mt-2 font-mono text-sm text-rust">
              {formatCurrency(total - budgetLimit)} above your limit
            </p>
          )}
        </div>
      </div>

      {error && (
        <ErrorAlert
          className="mb-6"
          message={error}
          onRetry={analyzeBudget}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-4">
          {BUDGET_CATEGORIES.map((cat) => (
            <BudgetCategoryInput
              key={cat.id}
              label={cat.label}
              category={cat.id}
              value={budget[cat.id]}
              max={cat.max}
              color={cat.color}
              shareOfTotal={total > 0 ? (budget[cat.id] / total) * 100 : 0}
              onChange={handleCategoryChange}
            />
          ))}
        </div>

        <BudgetChart budget={budget} />
      </div>

      <BudgetOptimizerPanel
        budget={budget}
        budgetLimit={budgetLimit}
        result={result}
        loading={loading}
        onAnalyze={analyzeBudget}
      />
    </section>
  )
}
