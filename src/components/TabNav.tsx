import BrandLogo from './BrandLogo'
import { BRAND_NAME } from '../constants/brand'
import { focusRingOnInk } from '../utils/a11y'

type Tab = 'explore' | 'itinerary' | 'budget' | 'hotels'

interface TabNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'budget', label: 'Budget' },
  { id: 'hotels', label: 'Hotels' },
]

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-parchment/10 bg-ink/90 backdrop-blur-md motion-safe:animate-nav-enter">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <button
          type="button"
          onClick={() => onTabChange('explore')}
          className={`group flex shrink-0 items-center py-3 motion-safe:transition-opacity motion-safe:hover:opacity-90 sm:py-4 ${focusRingOnInk}`}
          aria-label={`${BRAND_NAME} home — go to Explore`}
        >
          <BrandLogo size="sm" showWordmark className="text-parchment" />
        </button>

        <nav
          className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto"
          aria-label="Main navigation"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative shrink-0 px-3 py-3 font-mono text-xs uppercase tracking-widest motion-safe:transition-colors motion-safe:duration-200 sm:px-4 sm:py-4 ${focusRingOnInk} ${
                activeTab === tab.id
                  ? 'text-brass'
                  : 'text-parchment/70 hover:text-parchment'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-brass motion-safe:animate-tab-indicator sm:inset-x-4"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export type { Tab }
