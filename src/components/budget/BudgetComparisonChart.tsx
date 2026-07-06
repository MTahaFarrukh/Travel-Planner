import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { BUDGET_CATEGORIES } from '../../types/budget'
import type { BudgetBreakdown } from '../../types/budget'
import type { BudgetOptimizationResult } from '../../types/budgetOptimizer'
import { formatCurrency } from '../../utils/formatCurrency'
import Skeleton from '../Skeleton'

interface BudgetComparisonChartProps {
  budget: BudgetBreakdown
  result: BudgetOptimizationResult | null
}

interface ChartRow {
  name: string
  current: number
  optimized: number
  color: string
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { dataKey: string; value: number; payload: ChartRow }[]
}) {
  if (!active || !payload?.length) return null

  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-ink/15 bg-parchment px-3 py-2 shadow-lg">
      <p className="font-mono text-xs uppercase tracking-wide text-ink/70">
        {row.name}
      </p>
      <p className="text-sm text-ink">
        Current: <strong>{formatCurrency(row.current)}</strong>
      </p>
      <p className="text-sm text-ink">
        Optimized: <strong>{formatCurrency(row.optimized)}</strong>
      </p>
    </div>
  )
}

export default function BudgetComparisonChart({
  budget,
  result,
}: BudgetComparisonChartProps) {
  const reducedMotion = usePrefersReducedMotion()
  const compact = useMediaQuery('(max-width: 640px)')
  const [chartReady, setChartReady] = useState(false)

  useEffect(() => {
    setChartReady(true)
  }, [])

  if (!result) return null

  const data: ChartRow[] = BUDGET_CATEGORIES.map((category) => ({
    name: category.label,
    current: budget[category.id],
    optimized: result.optimizedBreakdown[category.id],
    color: category.color,
  }))

  return (
    <div className="rounded-2xl bg-parchment p-4 text-ink sm:p-6">
      <h2 className="font-display text-xl font-semibold">Current vs optimized</h2>
      <p className="mt-1 text-sm text-ink/70">
        See how suggested cuts reshape each category.
      </p>

      <div className="mt-6 h-64 w-full sm:h-72">
        {!chartReady ? (
          <Skeleton className="h-full w-full" variant="teal" rounded="2xl" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#15243814" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#152438', fontSize: compact ? 9 : 10, fontFamily: 'IBM Plex Mono' }}
                interval={0}
                angle={compact ? -35 : -18}
                textAnchor="end"
                height={compact ? 56 : 52}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: '#152438', fontSize: 11, fontFamily: 'IBM Plex Mono', opacity: 0.7 }}
                width={48}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#15243808' }} />
              <Legend
                wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}
              />
              <Bar
                dataKey="current"
                name="Current"
                radius={[6, 6, 0, 0]}
                fill="#152438"
                isAnimationActive={!reducedMotion}
              />
              <Bar
                dataKey="optimized"
                name="Optimized"
                radius={[6, 6, 0, 0]}
                isAnimationActive={!reducedMotion}
              >
                {data.map((entry) => (
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
