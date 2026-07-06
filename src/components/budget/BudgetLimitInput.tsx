import { BUDGET_CATEGORIES } from '../../types/budget'
import { formatCurrency } from '../../utils/formatCurrency'
import { focusRingOnInk } from '../../utils/a11y'

interface BudgetLimitInputProps {
  budgetLimit: number
  totalSpent: number
  onChange: (value: number) => void
}

export default function BudgetLimitInput({
  budgetLimit,
  totalSpent,
  onChange,
}: BudgetLimitInputProps) {
  const isOver = totalSpent > budgetLimit
  const progress = budgetLimit > 0 ? Math.min((totalSpent / budgetLimit) * 100, 100) : 0
  const overBy = Math.max(0, totalSpent - budgetLimit)

  return (
    <div className="rounded-2xl border border-parchment/10 bg-parchment/5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Budget limit
          </p>
          <label htmlFor="budget-limit" className="mt-2 block">
            <span className="sr-only">Maximum trip budget</span>
            <input
              id="budget-limit"
              type="number"
              min={100}
              step={50}
              value={budgetLimit}
              onChange={(event) =>
                onChange(Math.max(100, Number(event.target.value) || 0))
              }
              className={`w-full max-w-[200px] rounded-xl border border-parchment/20 bg-ink/40 px-4 py-2.5 font-display text-2xl font-semibold text-parchment outline-none focus-visible:border-brass/60 focus-visible:ring-2 focus-visible:ring-brass/30 ${focusRingOnInk}`}
            />
          </label>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-mono text-xs uppercase tracking-widest text-parchment/60">
            Current estimate
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-parchment">
            {formatCurrency(totalSpent)}
          </p>
          {isOver ? (
            <p className="mt-1 font-mono text-xs text-rust">
              {formatCurrency(overBy)} over limit
            </p>
          ) : (
            <p className="mt-1 font-mono text-xs text-teal">
              {formatCurrency(budgetLimit - totalSpent)} remaining
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-parchment/60">
            Limit usage
          </span>
          <span
            className={`font-mono text-xs ${isOver ? 'text-rust' : 'text-brass'}`}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-parchment/10">
          <div
            className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-500 ${
              isOver
                ? 'bg-gradient-to-r from-rust to-brass'
                : 'bg-gradient-to-r from-teal to-brass'
            }`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Budget limit usage"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {BUDGET_CATEGORIES.map((category) => (
          <span
            key={category.id}
            className="rounded-full border border-parchment/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-parchment/70"
          >
            {category.label}
          </span>
        ))}
      </div>
    </div>
  )
}
