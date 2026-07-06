import {
  PACKING_CATEGORY_META,
} from '../../constants/packing'
import type { PackingChecklist } from '../../types/packing'
import { focusRingOnInk } from '../../utils/a11y'
import EmptyState from '../EmptyState'
import LoadingOverlay from '../LoadingOverlay'
import Skeleton from '../Skeleton'
import PackingCategoryCard from './PackingCategoryCard'

interface PackingChecklistPanelProps {
  checklist: PackingChecklist | null
  loading: boolean
  packedCount: number
  totalCount: number
  savedAt: string | null
  saveMessage: string | null
  onToggleItem: (itemId: string) => void
  onDownload: () => void
  onSave: () => void
}

export default function PackingChecklistPanel({
  checklist,
  loading,
  packedCount,
  totalCount,
  savedAt,
  saveMessage,
  onToggleItem,
  onDownload,
  onSave,
}: PackingChecklistPanelProps) {
  const progress =
    totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0

  if (!checklist && !loading) {
    return (
      <EmptyState
        className="min-h-[320px]"
        title="Ready when you are"
        description="Fill in your trip details and generate a smart packing list organised into documents, clothing, electronics, and more."
        icon={
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
    )
  }

  if (loading && !checklist) {
    return (
      <div className="rounded-2xl border border-parchment/10 bg-parchment/5 p-5 sm:p-6">
        <Skeleton className="h-6 w-48" variant="parchment" />
        <Skeleton className="mt-4 h-3 w-full" variant="parchment" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" variant="parchment" rounded="2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!checklist) return null

  return (
    <section
      className="relative rounded-2xl border border-parchment/10 bg-parchment/5 p-5 sm:p-6"
      aria-labelledby="packing-checklist-heading"
    >
      {loading && <LoadingOverlay label="Refreshing checklist…" />}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Your checklist
          </p>
          <h2
            id="packing-checklist-heading"
            className="mt-1 font-display text-2xl font-semibold text-parchment"
          >
            Smart packing list
          </h2>
          <p className="mt-2 text-sm text-parchment/75">
            {packedCount} of {totalCount} packed ·{' '}
            {checklist.source === 'ai' ? 'AI generated' : 'Local template'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSave}
            className={`rounded-xl border border-parchment/20 px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-parchment motion-safe:transition-colors hover:border-brass/50 hover:text-brass ${focusRingOnInk}`}
          >
            Save locally
          </button>
          <button
            type="button"
            onClick={onDownload}
            className={`rounded-xl bg-brass px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-ink motion-safe:transition-colors hover:bg-brass/90 ${focusRingOnInk}`}
          >
            Download
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-parchment/60">
            Progress
          </span>
          <span className="font-mono text-xs text-brass">{progress}%</span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-parchment/10"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Packing progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal to-brass motion-safe:transition-all motion-safe:duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {(saveMessage || savedAt) && (
        <p className="mt-3 font-mono text-xs text-teal" role="status">
          {saveMessage ??
            `Last saved ${new Date(savedAt!).toLocaleString()}`}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PACKING_CATEGORY_META.map((meta) => {
          const items = checklist.items.filter(
            (item) => item.category === meta.id,
          )
          if (items.length === 0) return null

          return (
            <PackingCategoryCard
              key={meta.id}
              meta={meta}
              items={items}
              onToggleItem={onToggleItem}
            />
          )
        })}
      </div>
    </section>
  )
}
