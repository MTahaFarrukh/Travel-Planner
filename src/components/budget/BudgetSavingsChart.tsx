import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { BUDGET_CATEGORIES } from '../../types/budget'
import type { BudgetOptimizationResult } from '../../types/budgetOptimizer'
import { formatCurrency } from '../../utils/formatCurrency'
import Skeleton from '../Skeleton'

interface BudgetSavingsChartProps {
  result: BudgetOptimizationResult
}

interface SavingsRow {
  name: string
  savings: number
  color: string
}

function SavingsTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: SavingsRow }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-ink/15 bg-parchment px-3 py-2 shadow-lg">
      <p className="font-mono text-xs uppercase tracking-wide text-ink/70">
        {row.name}
      </p>
      <p className="font-display text-lg font-semibold text-teal">
        {formatCurrency(row.savings)}
      </p>
    </div>
  )
}

export default function BudgetSavingsChart({ result }: BudgetSavingsChartProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [chartReady, setChartReady] = useState(false)

  useEffect(() => {
    setChartReady(true)
  }, [])

  const byCategory = BUDGET_CATEGORIES.map((category) => ({
    name: category.label,
    savings: result.suggestions
      .filter((item) => item.category === category.id)
      .reduce((sum, item) => sum + item.potentialSavings, 0),
    color: category.color,
  })).filter((row) => row.savings > 0)

  if (byCategory.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-parchment/20 px-4 py-6 text-center text-sm text-parchment/70">
        No category-specific cuts suggested — your budget may already be on track.
      </p>
    )
  }

  return (
    <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4 sm:p-6">
      <h3 className="font-display text-lg font-semibold text-parchment">
        Potential savings
      </h3>
      <p className="mt-1 text-sm text-parchment/70">
        Total up to {formatCurrency(result.totalPotentialSavings)} across categories.
      </p>

      <div className="mt-5 h-48 w-full sm:h-56">
        {!chartReady ? (
          <Skeleton className="h-full w-full" variant="teal" rounded="2xl" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={byCategory}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: '#f4eedd', fontSize: 11, fontFamily: 'IBM Plex Mono', opacity: 0.75 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={72}
                tick={{ fill: '#f4eedd', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              />
              <Tooltip content={<SavingsTooltip />} cursor={{ fill: '#f4eedd10' }} />
              <Bar
                dataKey="savings"
                radius={[0, 8, 8, 0]}
                isAnimationActive={!reducedMotion}
              >
                {byCategory.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
