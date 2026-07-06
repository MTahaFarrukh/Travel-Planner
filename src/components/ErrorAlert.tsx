import type { ReactNode } from 'react'
import { focusRingOnInk } from '../utils/a11y'

interface ErrorAlertProps {
  message: string
  onRetry?: () => void
  retryLabel?: string
  children?: ReactNode
  className?: string
}

export default function ErrorAlert({
  message,
  onRetry,
  retryLabel = 'Try again',
  children,
  className = '',
}: ErrorAlertProps) {
  return (
    <div
      className={`rounded-xl border border-rust/40 bg-rust/15 px-4 py-3 text-sm text-parchment motion-safe:animate-card-in ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <p className="font-mono leading-relaxed text-parchment">{message}</p>
      {children}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`mt-3 rounded-lg border border-parchment/25 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-parchment motion-safe:transition-colors hover:border-brass/50 hover:text-brass ${focusRingOnInk}`}
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}
