type MarkdownVariant = 'dark' | 'ink'

interface MarkdownContentProps {
  content: string
  variant?: MarkdownVariant
}

const variantClass = {
  dark: {
    h1: 'font-display text-xl font-semibold text-brass',
    h2: 'pt-2 font-display text-lg font-semibold text-parchment',
    body: 'text-parchment/85',
    bullet: 'text-parchment/85',
    label: 'font-mono text-xs uppercase tracking-widest text-teal',
  },
  ink: {
    h1: 'font-display text-lg font-semibold text-ink',
    h2: 'pt-1 font-display text-base font-semibold text-ink',
    body: 'text-ink/80',
    bullet: 'text-ink/80',
    label: 'font-mono text-xs uppercase tracking-widest text-teal',
  },
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export default function MarkdownContent({
  content,
  variant = 'dark',
}: MarkdownContentProps) {
  const styles = variantClass[variant]
  const blocks = content.split('\n')

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, index) => {
        const trimmed = block.trim()
        if (!trimmed) return <div key={index} className="h-1.5" />

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={index} className={`${styles.h2} text-sm`}>
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          )
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={index} className={styles.h2}>
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          )
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={index} className={styles.h1}>
              {trimmed.replace(/^#\s+/, '')}
            </h2>
          )
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <p key={index} className={`pl-4 ${styles.bullet}`}>
              <span className="text-brass" aria-hidden="true">
                •{' '}
              </span>
              {renderInlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))}
            </p>
          )
        }

        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <p key={index} className={`pl-4 ${styles.bullet}`}>
              {renderInlineMarkdown(trimmed)}
            </p>
          )
        }

        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return (
            <p key={index} className={styles.label}>
              {trimmed.replace(/\*\*/g, '')}
            </p>
          )
        }

        return (
          <p key={index} className={styles.body}>
            {renderInlineMarkdown(trimmed)}
          </p>
        )
      })}
    </div>
  )
}
