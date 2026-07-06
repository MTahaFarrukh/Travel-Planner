import Skeleton from './Skeleton'

interface MapSkeletonProps {
  className?: string
  label?: string
}

export default function MapSkeleton({
  className = 'h-[min(56vh,520px)] min-h-[300px] sm:min-h-[380px]',
  label = 'Loading map',
}: MapSkeletonProps) {
  return (
    <div
      className={`trip-map-shell relative w-full overflow-hidden rounded-2xl border border-parchment/15 ${className}`}
      aria-busy="true"
      aria-label={label}
    >
      <Skeleton
        className="absolute inset-0 h-full w-full rounded-none"
        variant="ink"
        rounded="2xl"
        aria-label={label}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="rounded-full bg-ink/70 px-4 py-2 font-mono text-xs uppercase tracking-widest text-parchment/80 backdrop-blur-sm">
          Loading map…
        </p>
      </div>
    </div>
  )
}
