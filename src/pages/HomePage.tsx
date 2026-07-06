import { useState } from 'react'
import { TripProvider } from '../context/TripContext'
import AssistantLauncher from '../components/AssistantLauncher'
import ErrorBoundary from '../components/ErrorBoundary'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import SkipLink from '../components/SkipLink'
import TabNav, { type Tab } from '../components/TabNav'
import ExploreSection from '../sections/ExploreSection'
import { tabId, tabPanelProps } from '../utils/a11y'
import { applyTheme, loadTheme } from '../utils/themeStorage'
import AiPlannerPage from './AiPlannerPage'
import BudgetPage from './BudgetPage'
import HotelsPage from './HotelsPage'
import ItineraryPage from './ItineraryPage'
import MapPage from './MapPage'
import PackingPage from './PackingPage'

applyTheme(loadTheme())

function TabContent({ activeTab }: { activeTab: Tab }) {
  switch (activeTab) {
    case 'explore':
      return <ExploreSection />
    case 'itinerary':
      return <ItineraryPage />
    case 'budget':
      return <BudgetPage />
    case 'hotels':
      return <HotelsPage />
    case 'ai':
      return <AiPlannerPage />
    case 'map':
      return <MapPage />
    case 'packing':
      return <PackingPage />
    default:
      return <ExploreSection />
  }
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('explore')

  return (
    <TripProvider>
      <SkipLink />
      <div className="flex min-h-svh flex-col">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <main id="main-content" className="flex-1" aria-label="Main content">
          <ErrorBoundary fallbackTitle="This tab could not load">
            <div {...tabPanelProps(activeTab, tabId(activeTab), false)}>
              <PageTransition pageKey={activeTab}>
                <TabContent activeTab={activeTab} />
              </PageTransition>
            </div>
          </ErrorBoundary>
        </main>
        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        <AssistantLauncher />
      </div>
    </TripProvider>
  )
}
