import BrandLogo from './BrandLogo'
import ExportGuideButton from './ExportGuideButton'
import { BRAND_TAGLINE } from '../constants/brand'
import type { Tab } from './TabNav'
import { focusRingOnInk } from '../utils/a11y'

interface FooterProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const footerLinks: { id: Tab; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'budget', label: 'Budget' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'ai', label: 'AI Planner' },
  { id: 'map', label: 'Map' },
  { id: 'packing', label: 'Packing' },
]

export default function Footer({ activeTab, onTabChange }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-parchment/10 bg-ink/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <BrandLogo size="sm" showWordmark className="text-parchment" />
            <p className="mt-3 text-sm leading-relaxed text-parchment/75">
              {BRAND_TAGLINE}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="font-mono text-xs uppercase tracking-widest text-teal">
              Plan
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onTabChange(link.id)}
                    className={`font-mono text-xs uppercase tracking-wide motion-safe:transition-colors ${focusRingOnInk} ${
                      activeTab === link.id
                        ? 'text-brass'
                        : 'text-parchment/70 hover:text-parchment'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-xs">
            <p className="font-mono text-xs uppercase tracking-widest text-teal">
              Data
            </p>
            <p className="mt-3 text-sm leading-relaxed text-parchment/70">
              Weather forecasts powered by{' '}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass underline decoration-brass/40 underline-offset-2 motion-safe:transition-colors hover:text-brass/80 hover:decoration-brass"
              >
                Open-Meteo
              </a>
              . Destination and hotel photos from Unsplash.
            </p>
          </div>
        </div>

        <ExportGuideButton />

        <div className="mt-8 flex flex-col gap-2 border-t border-parchment/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-parchment/50">
            © {year} Waymark. Demo travel planner — no real bookings.
          </p>
          <p className="font-mono text-xs text-parchment/50">
            Your trip data is saved locally in this browser.
          </p>
        </div>
      </div>
    </footer>
  )
}
