import { useState, type ReactNode } from 'react'
import { TripProvider } from '../context/TripContext'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import TabNav, { type Tab } from '../components/TabNav'
import ExploreSection from '../sections/ExploreSection'
import BudgetPage from './BudgetPage'
import HotelsPage from './HotelsPage'
import ItineraryPage from './ItineraryPage'

function TabContent({ activeTab }: { activeTab: Tab }) {
  const content: Record<Tab, ReactNode> = {
    explore: <ExploreSection />,
    itinerary: <ItineraryPage />,
    budget: <BudgetPage />,
    hotels: <HotelsPage />,
  }
  return content[activeTab]
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('explore')

  return (
    <TripProvider>
      <div className="flex min-h-svh flex-col">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1">
          <PageTransition pageKey={activeTab}>
            <TabContent activeTab={activeTab} />
          </PageTransition>
        </main>
        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </TripProvider>
  )
}
