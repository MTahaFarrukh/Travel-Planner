import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
}

export function useScrollReveal<T extends HTMLElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -6% 0px',
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [isVisible, setIsVisible] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion, threshold, rootMargin])

  return { ref, isVisible }
}
