import { useState } from 'react'
import { ASSISTANT_QUICK_PROMPTS } from '../../constants/assistant'
import { focusRingOnInk } from '../../utils/a11y'

interface AssistantQuickPromptsProps {
  onSelect: (question: string) => void
  disabled?: boolean
}

export default function AssistantQuickPrompts({
  onSelect,
  disabled = false,
}: AssistantQuickPromptsProps) {
  return (
    <div className="border-t border-parchment/10 px-3 py-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-parchment/55">
        Quick questions
      </p>
      <div className="tab-nav-scroll flex gap-2 overflow-x-auto pb-1">
        {ASSISTANT_QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt.question)}
            className={`shrink-0 rounded-full border border-parchment/15 bg-ink/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-parchment/80 motion-safe:transition-colors hover:border-brass/40 hover:text-brass disabled:opacity-50 ${focusRingOnInk}`}
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface AssistantInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function AssistantInput({ onSend, disabled = false }: AssistantInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!value.trim()) return
    onSend(value)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-parchment/10 p-3"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-parchment/15 bg-ink/60 p-2 pl-4">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about food, transit, customs…"
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-sm text-parchment outline-none placeholder:text-parchment/45"
          aria-label="Message the travel assistant"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={`rounded-xl bg-brass px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink motion-safe:transition-colors hover:bg-brass/90 disabled:cursor-not-allowed disabled:opacity-50 ${focusRingOnInk}`}
        >
          Send
        </button>
      </div>
    </form>
  )
}
