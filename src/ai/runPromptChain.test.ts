import { describe, expect, it } from 'vitest'
import type { TripRequest } from '../types/aiTrip'
import {
  BudgetPlannerPrompt,
  DestinationResearchPrompt,
  ItineraryPrompt,
  TravelTipsPrompt,
  TripAnalyzerPrompt,
} from './prompts'
import { runPromptChain } from './runPromptChain'
import { validateTripRequest } from './validateTripRequest'

const baseRequest: TripRequest = {
  destination: 'Kyoto, Japan',
  days: 5,
  budget: 2500,
  travelStyle: 'family',
  interests: ['food', 'museums', 'nature'],
}

describe('validateTripRequest', () => {
  it('returns null for a valid request', () => {
    expect(validateTripRequest(baseRequest)).toBeNull()
  })

  it('requires destination, style, and interests', () => {
    expect(
      validateTripRequest({ ...baseRequest, destination: '  ' }),
    ).toMatch(/destination/i)
    expect(
      validateTripRequest({ ...baseRequest, travelStyle: null }),
    ).toMatch(/travel style/i)
    expect(
      validateTripRequest({ ...baseRequest, interests: [] }),
    ).toMatch(/interest/i)
  })

  it('validates days and budget ranges', () => {
    expect(validateTripRequest({ ...baseRequest, days: 0 })).toMatch(/days/i)
    expect(validateTripRequest({ ...baseRequest, budget: 50 })).toMatch(/budget/i)
  })
})

describe('prompt chain builders', () => {
  it('each builder returns structured prompt text with a unique id', () => {
    const { steps } = runPromptChain(baseRequest)

    expect(steps).toHaveLength(5)
    expect(steps.map((s) => s.id)).toEqual([
      'trip-analyzer',
      'destination-research',
      'budget-planner',
      'itinerary',
      'travel-tips',
    ])

    for (const step of steps) {
      expect(step.title).toBeTruthy()
      expect(step.role).toBeTruthy()
      expect(step.objective).toContain('Kyoto')
      expect(step.instructions.length).toBeGreaterThan(0)
      expect(step.outputSections.length).toBeGreaterThan(0)
      expect(step.text).toContain('###')
      expect(step.text).toContain('**Role:**')
      expect(step.text).toContain('**Objective:**')
    }
  })

  it('builders reflect user inputs without hardcoded destination content', () => {
    const barcelonaSolo: TripRequest = {
      destination: 'Barcelona, Spain',
      days: 3,
      budget: 1200,
      travelStyle: 'solo',
      interests: ['nightlife', 'photography'],
    }

    const { steps } = runPromptChain(barcelonaSolo)
    const combined = steps.map((s) => s.text).join('\n')

    expect(combined).toContain('Barcelona, Spain')
    expect(combined).toContain('Solo')
    expect(combined).toContain('Nightlife')
    expect(combined).not.toContain('Kyoto')
  })
})

describe('runPromptChain', () => {
  it('combines all step outputs into one final prompt', () => {
    const { steps, finalPrompt } = runPromptChain(baseRequest)

    expect(finalPrompt).toContain('Prompt Chain')
    expect(finalPrompt).toContain('Kyoto, Japan')
    expect(finalPrompt).toContain('$2,500')
    expect(finalPrompt).toContain('Family')

    for (const step of steps) {
      expect(finalPrompt).toContain(step.title)
    }
  })

  it('includes synthesis instructions for the unified response', () => {
    const { finalPrompt } = runPromptChain(baseRequest)

    expect(finalPrompt).toContain('Final synthesis instructions')
    expect(finalPrompt).toContain('Day-by-day itinerary')
    expect(finalPrompt).toContain('Hidden gems')
    expect(finalPrompt).toContain('Transportation guide')
    expect(finalPrompt).toContain('Food recommendations')
    expect(finalPrompt).toContain('Practical tips')
  })

  it('exports individual builder functions by name', () => {
    const { steps } = runPromptChain(baseRequest)
    const context = runPromptChain(baseRequest)

    expect(TripAnalyzerPrompt).toBeTypeOf('function')
    expect(DestinationResearchPrompt).toBeTypeOf('function')
    expect(BudgetPlannerPrompt).toBeTypeOf('function')
    expect(ItineraryPrompt).toBeTypeOf('function')
    expect(TravelTipsPrompt).toBeTypeOf('function')
    expect(context.steps[0].id).toBe(steps[0].id)
  })
})
