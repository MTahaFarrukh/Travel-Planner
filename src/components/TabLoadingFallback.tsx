import Skeleton from './Skeleton'
import { pageSection } from '../utils/a11y'

export default function TabLoadingFallback() {
  return (
    <div className={pageSection} aria-busy="true" aria-label="Loading section">
      <Skeleton className="h-4 w-24" variant="teal" rounded="md" />
      <Skeleton className="mt-4 h-10 w-2/3 max-w-md" variant="parchment" rounded="lg" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" variant="parchment" rounded="md" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-48 w-full" variant="parchment" rounded="2xl" />
        <Skeleton className="h-48 w-full" variant="parchment" rounded="2xl" />
      </div>
    </div>
  )
}
