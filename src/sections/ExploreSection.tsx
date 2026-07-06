import Hero from '../components/Hero'
import ExploreGrid from '../components/ExploreGrid'
import ScrollReveal from '../components/ScrollReveal'
import { pageSection } from '../utils/a11y'

export default function ExploreSection() {
  return (
    <>
      <Hero />

      <section
        id="explore-destinations"
        className={`${pageSection} scroll-mt-20`}
        aria-labelledby="destinations-heading"
      >
        <ScrollReveal>
          <header className="mb-8 sm:mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-teal">
              Destinations
            </p>
            <h2
              id="destinations-heading"
              className="mt-2 font-display text-3xl font-semibold text-parchment sm:text-4xl"
            >
              Where will you go next?
            </h2>
            <p className="mt-3 max-w-xl text-parchment/80">
              Search cities and countries, then narrow results by travel style.
            </p>
          </header>
        </ScrollReveal>

        <ExploreGrid />
      </section>
    </>
  )
}
