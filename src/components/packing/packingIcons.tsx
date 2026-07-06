import type { PackingCategoryMeta } from '../../constants/packing'

const accentClass = {
  brass: {
    header: 'from-brass/25 via-brass/10 to-transparent',
    badge: 'bg-brass/20 text-brass',
    ring: 'focus-visible:ring-brass/40',
    check: 'border-brass/50 bg-brass text-ink',
  },
  rust: {
    header: 'from-rust/25 via-rust/10 to-transparent',
    badge: 'bg-rust/20 text-rust',
    ring: 'focus-visible:ring-rust/40',
    check: 'border-rust/50 bg-rust text-parchment',
  },
  teal: {
    header: 'from-teal/25 via-teal/10 to-transparent',
    badge: 'bg-teal/20 text-teal',
    ring: 'focus-visible:ring-teal/40',
    check: 'border-teal/50 bg-teal text-parchment',
  },
}

function CategoryIcon({ icon }: { icon: PackingCategoryMeta['icon'] }) {
  const paths: Record<PackingCategoryMeta['icon'], string> = {
    documents:
      'M6 2h8l4 4v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1.5V6h3.5M8 10h8M8 14h8M8 18h5',
    clothing:
      'M12 3l4 2v3l-4 2-4-2V5l4-2zm-6 7l6 3 6-3v8l-6 3-6-3v-8z',
    electronics:
      'M7 5h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zm5 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
    medicine:
      'M12 3a5 5 0 00-5 5v2H5v8h14v-8h-2v-2a5 5 0 00-5-5zm0 4v4m-2-2h4',
    accessories:
      'M8 8a4 4 0 118 0v2h2v10H6V10h2V8zm4-2a2 2 0 100 4 2 2 0 000-4z',
    essentials:
      'M12 2l2.4 4.8L20 7.6l-3.6 3.5.9 5.2L12 14.8 6.7 16.3l.9-5.2L4 7.6l5.6-.8L12 2z',
  }

  return (
    <svg
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[icon]} />
    </svg>
  )
}

export { CategoryIcon, accentClass }
