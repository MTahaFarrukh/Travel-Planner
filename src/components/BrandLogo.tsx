import { BRAND_NAME } from '../constants/brand'

type LogoSize = 'sm' | 'md' | 'lg'

interface BrandLogoProps {
  size?: LogoSize
  showWordmark?: boolean
  className?: string
  animate?: boolean
}

const sizeMap: Record<LogoSize, { icon: string; text: string }> = {
  sm: { icon: 'size-8', text: 'text-lg' },
  md: { icon: 'size-10', text: 'text-xl' },
  lg: { icon: 'size-14', text: 'text-3xl sm:text-4xl' },
}

export default function BrandLogo({
  size = 'md',
  showWordmark = true,
  className = '',
  animate = false,
}: BrandLogoProps) {
  const { icon, text } = sizeMap[size]

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-hidden={!showWordmark}
    >
      <svg
        className={`${icon} shrink-0 ${animate ? 'motion-safe:animate-logo-enter' : ''}`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          strokeWidth="1.25"
          className="text-teal/70"
        />
        <circle
          cx="20"
          cy="20"
          r="2.5"
          className="fill-brass"
        />
        <g className="motion-safe:origin-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:rotate-[18deg]">
          <path
            d="M20 6 L22.5 19 L20 21 L17.5 19 Z"
            className="fill-brass"
          />
          <path
            d="M20 34 L17.5 21 L20 19 L22.5 21 Z"
            className="fill-teal/45"
          />
          <path
            d="M6 20 L19 17.5 L21 20 L19 22.5 Z"
            className="fill-teal/55"
          />
          <path
            d="M34 20 L21 22.5 L19 20 L21 17.5 Z"
            className="fill-teal/55"
          />
        </g>
        <path
          d="M9 29 Q20 11 31 29"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="2.5 3.5"
          strokeLinecap="round"
          className="text-rust/70 motion-safe:animate-path-draw"
        />
      </svg>
      {showWordmark && (
        <span className={`font-display font-semibold tracking-tight text-parchment ${text}`}>
          {BRAND_NAME}
        </span>
      )}
    </span>
  )
}
