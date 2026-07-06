import type { ReactNode } from 'react'

interface PageTransitionProps {
  pageKey: string
  children: ReactNode
}

export default function PageTransition({ pageKey, children }: PageTransitionProps) {
  return (
    <div key={pageKey} className="animate-page-in">
      {children}
    </div>
  )
}
