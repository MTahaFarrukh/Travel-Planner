import AiTripOutputPanel from '../components/AiTripOutputPanel'
import AiTripRequestForm from '../components/AiTripRequestForm'
import { useAiTripPlanner } from '../hooks/useAiTripPlanner'
import { pageHeading, pageSection } from '../utils/a11y'

export default function AiPlannerPage() {
  const {
    request,
    prompt,
    promptChain,
    result,
    loading,
    error,
    updateField,
    setTravelStyle,
    toggleInterest,
    generateTrip,
    reset,
  } = useAiTripPlanner()

  return (
    <section className={pageSection}>
      <header className="animate-section-header mb-8 sm:mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-teal">
          AI Planner
        </p>
        <h1 className={pageHeading}>Generate your perfect trip</h1>
        <p className="mt-3 max-w-2xl text-parchment/80">
          Describe your ideal journey and Waymark will run a five-step prompt
          chain — trip analysis, destination research, budget, itinerary, and
          travel tips — then send the combined prompt to OpenAI for your plan.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 xl:items-start">
        <AiTripRequestForm
          request={request}
          loading={loading}
          onDestinationChange={(value) => updateField('destination', value)}
          onDaysChange={(value) => updateField('days', value)}
          onBudgetChange={(value) => updateField('budget', value)}
          onTravelStyleChange={setTravelStyle}
          onInterestToggle={toggleInterest}
          onSubmit={generateTrip}
          onReset={reset}
        />

        <AiTripOutputPanel
          prompt={prompt}
          promptChain={promptChain}
          result={result}
          loading={loading}
          error={error}
          onRetry={generateTrip}
        />
      </div>
    </section>
  )
}
