import { useEffect, useRef } from 'react'
import BrandLogo from './BrandLogo'
import { BRAND_TAGLINE } from '../constants/brand'
import { focusRingOnInk } from '../utils/a11y'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1280&h=720&fit=crop&q=70&auto=format'

interface HeroProps {
  onExplore?: () => void
}

export default function Hero({ onExplore }: HeroProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let frame = 0
    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const offset = window.scrollY * 0.18
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  function scrollToDestinations() {
    if (onExplore) {
      onExplore()
      return
    }

    document.getElementById('explore-destinations')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <section
      className="relative flex min-h-[88svh] items-center overflow-hidden"
      aria-label="Welcome"
    >
      <div
        ref={parallaxRef}
        className="hero-parallax-layer pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <img
          src={HERO_IMAGE}
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/75 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(201,154,61,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_60%,rgba(62,98,89,0.15),transparent_50%)]" />
        <span
          className="motion-safe:animate-float-slow absolute left-[12%] top-[22%] size-2 rounded-full bg-brass/40"
          aria-hidden="true"
        />
        <span
          className="motion-safe:animate-float-medium absolute right-[18%] top-[35%] size-1.5 rounded-full bg-teal/50"
          aria-hidden="true"
        />
        <span
          className="motion-safe:animate-float-fast absolute bottom-[28%] left-[42%] size-1 rounded-full bg-parchment/30"
          aria-hidden="true"
        />
      </div>

      <svg
        className="hero-flight-path pointer-events-none absolute inset-0 h-full w-full motion-safe:animate-flight-draw"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M-40 420 C 180 280, 320 380, 520 300 S 880 180, 1240 120"
          fill="none"
          stroke="url(#flightGradient)"
          strokeWidth="2"
          strokeDasharray="8 10"
          strokeLinecap="round"
          className="motion-safe:animate-flight-dash"
        />
        <circle
          cx="520"
          cy="300"
          r="5"
          fill="#C99A3D"
          className="motion-safe:animate-flight-node"
        />
        <defs>
          <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3E6259" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#C99A3D" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#B1502F" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="hero-reveal hero-reveal-delay-1">
          <BrandLogo size="lg" animate className="text-parchment" />
        </div>
        <p className="hero-reveal hero-reveal-delay-2 mt-5 font-mono text-xs uppercase tracking-[0.25em] text-teal">
          {BRAND_TAGLINE}
        </p>
        <h1 className="hero-reveal hero-reveal-delay-3 mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-parchment sm:text-5xl lg:text-6xl">
          Chart your course to somewhere unforgettable
        </h1>
        <p className="hero-reveal hero-reveal-delay-4 mt-5 max-w-xl text-base leading-relaxed text-parchment/85 sm:text-lg">
          Search destinations, read the skies, and sketch the first lines of a
          journey worth taking.
        </p>
        <div className="hero-reveal hero-reveal-delay-4 mt-8">
          <button
            type="button"
            onClick={scrollToDestinations}
            className={`hero-cta-glow rounded-full bg-brass px-8 py-3.5 font-mono text-sm uppercase tracking-widest text-ink motion-safe:transition-transform motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98] hover:bg-brass/90 ${focusRingOnInk}`}
          >
            Start exploring
          </button>
        </div>
      </div>
    </section>
  )
}
