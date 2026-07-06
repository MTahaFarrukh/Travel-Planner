import type { CSSProperties } from 'react'

type SkeletonVariant = 'ink' | 'parchment' | 'teal'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
  variant?: SkeletonVariant
  rounded?: 'sm' | 'md' | 'lg' | 'full' | 'xl' | '2xl'
  'aria-label'?: string
}

const variantClass: Record<SkeletonVariant, string> = {
  ink: 'skeleton-ink',
  parchment: 'skeleton-parchment',
  teal: 'skeleton-teal',
}

const roundedClass = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

export default function Skeleton({
  className = '',
  style,
  variant = 'parchment',
  rounded = 'lg',
  'aria-label': ariaLabel = 'Loading',
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer ${variantClass[variant]} ${roundedClass[rounded]} ${className}`}
      style={style}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role="status"
    />
  )
}
