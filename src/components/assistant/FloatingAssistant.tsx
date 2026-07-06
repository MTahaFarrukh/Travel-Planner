import { useEffect, useRef } from 'react'
import { BRAND_NAME } from '../../constants/brand'
import { useActiveDestination } from '../../hooks/useActiveDestination'
import { useAiAssistant } from '../../hooks/useAiAssistant'
import { focusRingOnInk } from '../../utils/a11y'
import ErrorAlert from '../ErrorAlert'
import AssistantMessageList from './AssistantMessageList'
import AssistantQuickPrompts, { AssistantInput } from './AssistantQuickPrompts'

interface FloatingAssistantProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FloatingAssistant({
  open,
  onOpenChange,
}: FloatingAssistantProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { destination } = useActiveDestination()
  const { messages, loading, error, sendMessage, clearChat } =
    useAiAssistant(destination)

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onOpenChange(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          ref={panelRef}
          id="assistant-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
          className="pointer-events-auto flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-3xl border border-parchment/15 bg-ink/95 shadow-2xl backdrop-blur-xl motion-safe:animate-page-in sm:w-96"
          style={{ maxHeight: 'min(70vh, 34rem)' }}
        >
          <header className="border-b border-parchment/10 bg-gradient-to-r from-ink via-ink to-teal/20 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-teal">
                  {BRAND_NAME} AI
                </p>
                <h2
                  id="assistant-title"
                  className="mt-1 font-display text-lg font-semibold text-parchment"
                >
                  Travel assistant
                </h2>
                <p className="mt-1 text-xs text-parchment/70">
                  Focused on{' '}
                  <span className="font-medium text-brass">
                    {destination.name}, {destination.country}
                  </span>
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  className={`rounded-lg px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-parchment/60 motion-safe:transition-colors hover:text-parchment ${focusRingOnInk}`}
                  aria-label="Clear chat"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className={`rounded-lg p-1.5 text-parchment/70 motion-safe:transition-colors hover:bg-parchment/10 hover:text-parchment ${focusRingOnInk}`}
                  aria-label="Close assistant"
                >
                  <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <AssistantMessageList messages={messages} loading={loading} />

          {error && (
            <div className="px-4 pb-2">
              <ErrorAlert message={error} />
            </div>
          )}

          <AssistantQuickPrompts onSelect={sendMessage} disabled={loading} />
          <AssistantInput onSend={sendMessage} disabled={loading} />
        </div>
      )}

      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        className={`pointer-events-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-brass to-rust text-ink shadow-[0_12px_40px_rgba(21,36,56,0.45)] motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-105 motion-safe:active:scale-95 ${focusRingOnInk} ${open ? 'ring-2 ring-parchment/30' : ''}`}
        aria-label={open ? 'Close travel assistant' : 'Open travel assistant'}
      >
        {open ? (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.96L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  )
}
