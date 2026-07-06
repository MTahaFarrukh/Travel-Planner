interface CategoryBadgeProps {
  category: string
  variant?: 'ink' | 'overlay'
  className?: string
}

const variantClass = {
  ink: 'bg-ink/8 text-ink/75',
  overlay: 'bg-ink/55 text-parchment backdrop-blur-sm',
}

export default function CategoryBadge({
  category,
  variant = 'ink',
  className = '',
}: CategoryBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${variantClass[variant]} ${className}`}
    >
      {category}
    </span>
  )
}
