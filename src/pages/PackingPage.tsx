import ErrorAlert from '../components/ErrorAlert'
import PackingChecklistPanel from '../components/packing/PackingChecklistPanel'
import PackingRequestForm from '../components/packing/PackingRequestForm'
import { useAiPackingList } from '../hooks/useAiPackingList'
import { pageHeading, pageSection } from '../utils/a11y'

export default function PackingPage() {
  const {
    request,
    checklist,
    loading,
    error,
    savedAt,
    saveMessage,
    packedCount,
    totalCount,
    updateField,
    setTravelMonth,
    setWeather,
    setTripType,
    toggleActivity,
    toggleItem,
    generateList,
    saveLocally,
    downloadList,
    reset,
  } = useAiPackingList()

  return (
    <section className={pageSection}>
      <header className="animate-section-header mb-8 sm:mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-teal">
          AI Packing
        </p>
        <h1 className={pageHeading}>Pack smarter, travel lighter</h1>
        <p className="mt-3 max-w-2xl text-parchment/80">
          Tell Waymark where you&apos;re headed and what you&apos;ll do — we&apos;ll
          build a tailored checklist across documents, clothing, electronics,
          medicine, accessories, and essentials.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8 xl:items-start">
        <PackingRequestForm
          request={request}
          loading={loading}
          onDestinationChange={(value) => updateField('destination', value)}
          onTravelMonthChange={setTravelMonth}
          onWeatherChange={setWeather}
          onTripTypeChange={setTripType}
          onActivityToggle={toggleActivity}
          onSubmit={generateList}
          onReset={reset}
        />

        <div className="space-y-4">
          {error && (
            <ErrorAlert message={error} onRetry={generateList} />
          )}

          <PackingChecklistPanel
            checklist={checklist}
            loading={loading}
            packedCount={packedCount}
            totalCount={totalCount}
            savedAt={savedAt}
            saveMessage={saveMessage}
            onToggleItem={toggleItem}
            onDownload={downloadList}
            onSave={saveLocally}
          />
        </div>
      </div>
    </section>
  )
}
