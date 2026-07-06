import type { BudgetCategory } from '../types/budget'
import { formatCurrency } from '../utils/formatCurrency'

interface BudgetCategoryInputProps {
  label: string
  category: BudgetCategory
  value: number
  max: number
  color: string
  shareOfTotal: number
  onChange: (category: BudgetCategory, value: number) => void
}

export default function BudgetCategoryInput({
  label,
  category,
  value,
  max,
  color,
  shareOfTotal,
  onChange,
}: BudgetCategoryInputProps) {
  return (
    <div className="rounded-2xl bg-parchment p-4 text-ink sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={`budget-${category}`} className="font-display text-lg font-semibold">
          {label}
        </label>
        <span className="font-mono text-sm font-medium" style={{ color }}>
          {formatCurrency(value)}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out"
          style={{
            width: `${shareOfTotal}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <input
          id={`budget-${category}`}
          type="range"
          min={0}
          max={max}
          step={50}
          value={value}
          onChange={(e) => onChange(category, Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/40"
          style={{ accentColor: color }}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`${label} budget slider`}
        />
        <input
          type="number"
          min={0}
          max={max}
          step={50}
          value={value}
          onChange={(e) => {
            const next = Math.min(max, Math.max(0, Number(e.target.value) || 0))
            onChange(category, next)
          }}
          className="w-full rounded-lg border border-ink/15 bg-white/60 px-3 py-1.5 text-right font-mono text-sm outline-none focus-visible:border-brass/60 focus-visible:ring-2 focus-visible:ring-brass/25 sm:w-24"
          aria-label={`${label} budget amount`}
        />
      </div>

      <p className="mt-2 font-mono text-xs text-ink/60">
        {shareOfTotal > 0 ? `${Math.round(shareOfTotal)}% of total` : 'Not allocated'}
      </p>
    </div>
  )
}
