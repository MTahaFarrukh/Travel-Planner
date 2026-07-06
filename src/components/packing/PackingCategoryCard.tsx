import type { PackingCategoryMeta } from '../../constants/packing'
import type { PackingItem } from '../../types/packing'
import { focusRingOnParchment } from '../../utils/a11y'
import { CategoryIcon, accentClass } from './packingIcons'

interface PackingCategoryCardProps {
  meta: PackingCategoryMeta
  items: PackingItem[]
  onToggleItem: (itemId: string) => void
}

export default function PackingCategoryCard({
  meta,
  items,
  onToggleItem,
}: PackingCategoryCardProps) {
  const styles = accentClass[meta.accent]
  const packed = items.filter((item) => item.checked).length

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-parchment text-ink shadow-md motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg">
      <div
        className={`bg-gradient-to-br px-5 pb-4 pt-5 ${styles.header}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${styles.badge}`}
            >
              <CategoryIcon icon={meta.icon} />
            </span>
            <div>
              <h3 className="font-display text-xl font-semibold">{meta.label}</h3>
              <p className="mt-0.5 text-sm text-ink/65">{meta.description}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${styles.badge}`}
          >
            {packed}/{items.length}
          </span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2 p-4 pt-3">
        {items.map((item) => (
          <li key={item.id}>
            <label
              className={`group flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 motion-safe:transition-colors hover:border-ink/10 hover:bg-ink/[0.03] ${focusRingOnParchment}`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggleItem(item.id)}
                className="peer sr-only"
              />
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 motion-safe:transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${styles.ring} ${
                  item.checked
                    ? styles.check
                    : 'border-ink/20 bg-white/70 text-transparent'
                }`}
                aria-hidden="true"
              >
                {item.checked && (
                  <svg className="size-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.2 5 8.7 9.5 3.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`text-sm leading-snug motion-safe:transition-colors ${
                  item.checked ? 'text-ink/45 line-through' : 'text-ink/85'
                }`}
              >
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </article>
  )
}
