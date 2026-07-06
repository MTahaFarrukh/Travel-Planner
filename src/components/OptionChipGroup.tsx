import { focusRingOnInk, focusRingOnParchment } from '../utils/a11y'

type ChipVariant = 'ink' | 'parchment'

interface OptionChipGroupProps<T extends string> {
  label: string
  hint?: string
  options: { id: T; label: string; description: string }[]
  selected: T | T[] | null
  onSelect: (id: T) => void
  mode?: 'single' | 'multiple'
  variant?: ChipVariant
}

const variantStyles: Record<
  ChipVariant,
  { selected: string; idle: string; ring: string }
> = {
  ink: {
    selected: 'bg-brass text-ink',
    idle: 'border border-parchment/20 text-parchment/80 hover:border-brass/40 hover:text-parchment',
    ring: focusRingOnInk,
  },
  parchment: {
    selected: 'bg-teal text-parchment',
    idle: 'border border-ink/15 text-ink/75 hover:border-teal/40 hover:text-ink',
    ring: focusRingOnParchment,
  },
}

function isSelected<T extends string>(
  id: T,
  selected: T | T[] | null,
  mode: 'single' | 'multiple',
) {
  if (mode === 'single') return selected === id
  return Array.isArray(selected) && selected.includes(id)
}

export default function OptionChipGroup<T extends string>({
  label,
  hint,
  options,
  selected,
  onSelect,
  mode = 'single',
  variant = 'ink',
}: OptionChipGroupProps<T>) {
  const styles = variantStyles[variant]
  const labelClass =
    variant === 'parchment' ? 'text-ink/70' : 'text-parchment/80'
  const hintClass =
    variant === 'parchment' ? 'text-ink/60' : 'text-parchment/65'

  return (
    <fieldset>
      <legend className={`font-mono text-xs uppercase tracking-wide ${labelClass}`}>
        {label}
      </legend>
      {hint && <p className={`mt-1 text-sm ${hintClass}`}>{hint}</p>}
      <div
        className="mt-3 flex flex-wrap gap-2"
        role={mode === 'single' ? 'radiogroup' : 'group'}
        aria-label={label}
      >
        {options.map((option) => {
          const active = isSelected(option.id, selected, mode)

          return (
            <button
              key={option.id}
              type="button"
              role={mode === 'single' ? 'radio' : 'checkbox'}
              aria-checked={active}
              onClick={() => onSelect(option.id)}
              title={option.description}
              className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:scale-[1.03] motion-safe:active:scale-95 ${styles.ring} ${
                active ? `animate-chip-pop ${styles.selected}` : styles.idle
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
