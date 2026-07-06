import { focusRingOnParchment } from '../utils/a11y'

interface DateRangePickerProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
  minCheckOut?: string
  error?: string | null
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  minCheckOut,
  error = null,
}: DateRangePickerProps) {
  return (
    <div className="mt-4 rounded-xl border border-ink/15 bg-white/55 p-3">
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
        Select stay dates
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink/55">
            Check-in
          </span>
          <input
            type="date"
            value={checkIn}
            onChange={(event) => onCheckInChange(event.target.value)}
            className={`mt-1.5 w-full rounded-lg border border-ink/20 bg-parchment px-3 py-2 font-mono text-sm text-ink ${focusRingOnParchment}`}
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink/55">
            Check-out
          </span>
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            onChange={(event) => onCheckOutChange(event.target.value)}
            className={`mt-1.5 w-full rounded-lg border border-ink/20 bg-parchment px-3 py-2 font-mono text-sm text-ink ${focusRingOnParchment}`}
          />
        </label>
      </div>
      {error && (
        <p className="mt-2 font-mono text-xs text-rust" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
