import type { TripRequest } from '../../types/aiTrip'

/** Normalized context passed to every prompt builder in the chain. */
export interface TripPromptContext {
  request: TripRequest & {
    travelStyle: NonNullable<TripRequest['travelStyle']>
  }
  destination: string
  days: number
  budget: number
  formattedBudget: string
  styleLabel: string
  interestLabels: string[]
}

export type PromptChainStepId =
  | 'trip-analyzer'
  | 'destination-research'
  | 'budget-planner'
  | 'itinerary'
  | 'travel-tips'

/** Structured output from a single prompt builder — LangChain-ready shape. */
export interface StructuredPrompt {
  id: PromptChainStepId
  title: string
  role: string
  objective: string
  instructions: string[]
  outputSections: string[]
  text: string
}

export interface PromptChainResult {
  steps: StructuredPrompt[]
  finalPrompt: string
}
