import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-parchment/25 bg-parchment/5 px-6 py-12 text-center motion-safe:animate-card-in sm:px-8 sm:py-14 ${className}`}
    >
      {icon && (
        <div
          className="mb-4 flex size-12 items-center justify-center rounded-full bg-teal/15 text-teal"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <p className="font-display text-xl text-parchment sm:text-2xl">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-parchment/75">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
