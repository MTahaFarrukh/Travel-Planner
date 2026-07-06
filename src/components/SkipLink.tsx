import { skipLinkClass } from '../utils/a11y'

interface SkipLinkProps {
  targetId?: string
}

export default function SkipLink({ targetId = 'main-content' }: SkipLinkProps) {
  return (
    <a href={`#${targetId}`} className={skipLinkClass}>
      Skip to main content
    </a>
  )
}
