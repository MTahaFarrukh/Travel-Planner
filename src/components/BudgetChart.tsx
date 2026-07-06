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
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { BudgetBreakdown } from '../types/budget'
import { BUDGET_CATEGORIES } from '../types/budget'
import { formatCurrency } from '../utils/formatCurrency'
import Skeleton from './Skeleton'

interface BudgetChartProps {
  budget: BudgetBreakdown
}

interface ChartDatum {
  name: string
  amount: number
  color: string
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: ChartDatum }[]
}) {
  if (!active || !payload?.length) return null

  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-ink/15 bg-parchment px-3 py-2 shadow-lg">
      <p className="font-mono text-xs uppercase tracking-wide text-ink/70">
        {item.name}
      </p>
      <p className="font-display text-lg font-semibold text-ink">
        {formatCurrency(item.amount)}
      </p>
    </div>
  )
}

export default function BudgetChart({ budget }: BudgetChartProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [chartReady, setChartReady] = useState(false)

  useEffect(() => {
    setChartReady(true)
  }, [])

  const data: ChartDatum[] = BUDGET_CATEGORIES.map((cat) => ({
    name: cat.label,
    amount: budget[cat.id],
    color: cat.color,
  }))

  return (
    <div className="rounded-2xl bg-parchment p-4 text-ink sm:p-6">
      <h2 className="font-display text-xl font-semibold">Estimate breakdown</h2>
      <p className="mt-1 text-sm text-ink/70">
        Category split updates as you adjust sliders.
      </p>

      <div className="mt-6 h-56 w-full sm:h-64">
        {!chartReady ? (
          <div className="flex h-full flex-col justify-end gap-3">
            <div className="flex h-full items-end justify-between gap-2 px-2">
              {BUDGET_CATEGORIES.map((cat) => (
                <Skeleton
                  key={cat.id}
                  className="w-full"
                  style={{ height: `${35 + (budget[cat.id] / cat.max) * 55}%` }}
                  variant="teal"
                  rounded="lg"
                  aria-label={`Loading ${cat.label} bar`}
                />
              ))}
            </div>
            <Skeleton className="mx-auto h-3 w-3/4" variant="teal" rounded="full" aria-label="Loading chart axis" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#152438', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={48}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              tick={{ fill: '#152438', fontSize: 11, fontFamily: 'IBM Plex Mono', opacity: 0.7 }}
              width={48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#15243808' }}
            />
            <Bar
              dataKey="amount"
              radius={[8, 8, 0, 0]}
              isAnimationActive={!reducedMotion}
              animationDuration={reducedMotion ? 0 : 450}
              animationEasing="ease-out"
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
