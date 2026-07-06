import { useState, type FormEvent } from 'react'
import type { NewActivity } from '../types/itinerary'
import { focusRingOnParchment } from '../utils/a11y'

interface ActivityFormProps {
  onAdd: (activity: NewActivity) => void
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-2.5 text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/50 focus-visible:border-brass/60 focus-visible:ring-2 focus-visible:ring-brass/25'

export default function ActivityForm({ onAdd }: ActivityFormProps) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    onAdd({
      title: trimmedTitle,
      time: time || undefined,
      notes: notes.trim() || undefined,
    })

    setTitle('')
    setTime('')
    setNotes('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-parchment p-4 text-ink sm:p-6"
    >
      <h2 className="font-display text-xl font-semibold">Add an activity</h2>
      <p className="mt-1 text-sm text-ink/70">
        Plan a stop, meal, or moment for this day.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Activity
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning market stroll"
            required
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Time <span className="normal-case text-ink/55">(optional)</span>
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`${inputClass} font-mono text-sm`}
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Notes <span className="normal-case text-ink/55">(optional)</span>
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tickets, reservations, reminders…"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </label>
      </div>

      <button
        type="submit"
        className={`mt-5 w-full rounded-xl bg-teal px-4 py-3 font-mono text-sm uppercase tracking-wide text-parchment transition-colors hover:bg-teal/90 ${focusRingOnParchment}`}
      >
        Add to itinerary
      </button>
    </form>
  )
}
