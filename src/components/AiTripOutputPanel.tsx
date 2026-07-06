import { useEffect, useState } from 'react'
import type { StructuredPrompt } from '../ai/prompts/types'
import { focusRingOnInk } from '../utils/a11y'
import ErrorAlert from './ErrorAlert'
import EmptyState from './EmptyState'
import MarkdownContent from './MarkdownContent'
import Skeleton from './Skeleton'

interface AiTripOutputPanelProps {
  prompt: string | null
  promptChain?: StructuredPrompt[]
  result: string | null
  loading: boolean
  error: string | null
  onRetry?: () => void
}

type OutputTab = 'plan' | 'prompt'

export default function AiTripOutputPanel({
  prompt,
  promptChain = [],
  result,
  loading,
  error,
  onRetry,
}: AiTripOutputPanelProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>('plan')

  useEffect(() => {
    if (error?.includes('API key') && prompt) {
      setActiveTab('prompt')
    }
  }, [error, prompt])

  const showPlan = activeTab === 'plan'
  const hasOutput = Boolean(prompt || result || loading || error)

  return (
    <section
      className="flex min-h-[28rem] flex-col rounded-2xl border border-parchment/10 bg-parchment/5 p-5 backdrop-blur-sm sm:p-6"
      aria-label="AI trip output"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Output
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-parchment">
            Your AI trip plan
          </h2>
        </div>

        {prompt && (
          <div
            className="flex rounded-full border border-parchment/15 p-1"
            role="tablist"
            aria-label="Output view"
          >
            {(['plan', 'prompt'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide motion-safe:transition-colors ${focusRingOnInk} ${
                  activeTab === tab
                    ? 'bg-brass text-ink'
                    : 'text-parchment/70 hover:text-parchment'
                }`}
              >
                {tab === 'plan' ? 'Trip plan' : 'LLM prompt'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex-1">
        {!hasOutput && (
          <EmptyState
            className="min-h-64 border-parchment/20"
            title="Ready when you are"
            description="Fill in your trip details and click Generate trip. Your custom LLM prompt and AI itinerary will appear here."
          />
        )}

        {error && (
          <ErrorAlert
            className="mb-4"
            message={error}
            onRetry={onRetry}
          >
            {prompt && error.includes('API key') && (
              <p className="mt-2 text-parchment/80">
                The generated prompt is still available in the{' '}
                <strong>LLM prompt</strong> tab — copy it to any AI chat tool.
              </p>
            )}
          </ErrorAlert>
        )}

        {loading && (
          <div className="space-y-4" aria-live="polite">
            <Skeleton className="h-6 w-2/3" variant="parchment" rounded="lg" aria-label="Loading trip plan" />
            <Skeleton className="h-4 w-full" variant="parchment" rounded="md" aria-label="Loading content" />
            <Skeleton className="h-4 w-11/12" variant="parchment" rounded="md" aria-label="Loading content" />
            <Skeleton className="h-4 w-10/12" variant="parchment" rounded="md" aria-label="Loading content" />
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <Skeleton className="h-24" variant="parchment" rounded="xl" aria-label="Loading section" />
              <Skeleton className="h-24" variant="parchment" rounded="xl" aria-label="Loading section" />
              <Skeleton className="h-24" variant="parchment" rounded="xl" aria-label="Loading section" />
            </div>
            <p className="font-mono text-xs text-parchment/60">
              Crafting your itinerary…
            </p>
          </div>
        )}

        {!loading && showPlan && result && (
          <div className="scroll-fade-y animate-page-in max-h-[42rem] overflow-y-auto rounded-xl bg-ink/40 p-5">
            <MarkdownContent content={result} variant="dark" />
          </div>
        )}

        {!loading && !showPlan && prompt && (
          <div className="animate-page-in space-y-4">
            {promptChain.length > 0 && (
              <div className="rounded-xl border border-parchment/15 bg-ink/30 p-4">
                <p className="font-mono text-xs uppercase tracking-widest text-teal">
                  Prompt chain ({promptChain.length} steps)
                </p>
                <ul className="mt-3 space-y-2">
                  {promptChain.map((step) => (
                    <li
                      key={step.id}
                      className="rounded-lg border border-parchment/10 bg-ink/25 px-3 py-2"
                    >
                      <p className="font-display text-sm font-semibold text-parchment">
                        {step.title}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-parchment/60">
                        {step.role}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="mb-3 font-mono text-xs text-parchment/65">
                Combined final prompt sent to the AI model:
              </p>
              <pre className="max-h-[42rem] overflow-auto rounded-xl bg-ink/50 p-4 font-mono text-xs leading-relaxed text-parchment/85 whitespace-pre-wrap">
                {prompt}
              </pre>
            </div>
          </div>
        )}

        {!loading && showPlan && !result && prompt && !error && (
          <div className="rounded-xl border border-parchment/15 bg-ink/30 p-5 text-sm text-parchment/75">
            Prompt generated. Waiting for AI response…
          </div>
        )}
      </div>
    </section>
  )
}
