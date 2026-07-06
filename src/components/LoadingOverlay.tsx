import Skeleton from './Skeleton'

interface LoadingOverlayProps {
  label?: string
}

export default function LoadingOverlay({
  label = 'Updating…',
}: LoadingOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-ink/60 backdrop-blur-[2px] motion-safe:animate-fade-in"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="size-8" variant="teal" rounded="full" aria-label={label} />
      <p className="font-mono text-xs uppercase tracking-widest text-parchment/80">
        {label}
      </p>
    </div>
  )
}
