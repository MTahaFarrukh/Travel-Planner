import type { ReactNode } from 'react'

interface PageTransitionProps {
  pageKey: string
  children: ReactNode
}

export default function PageTransition({ pageKey, children }: PageTransitionProps) {
  return (
    <div
      key={pageKey}
      className="motion-safe:animate-page-in"
      style={{ contentVisibility: 'auto' }}
    >
      {children}
    </div>
  )
}
