import type { TripRequest } from '../types/aiTrip'
import { combinePromptChain } from './combinePrompts'
import {
  BudgetPlannerPrompt,
  createTripPromptContext,
  DestinationResearchPrompt,
  ItineraryPrompt,
  TravelTipsPrompt,
  TripAnalyzerPrompt,
} from './prompts'
import type { PromptChainResult, StructuredPrompt } from './prompts/types'

/** Ordered prompt chain — swap individual steps or wrap with LangChain later. */
export const PROMPT_CHAIN_BUILDERS: ((
  context: ReturnType<typeof createTripPromptContext>,
) => StructuredPrompt)[] = [
  TripAnalyzerPrompt,
  DestinationResearchPrompt,
  BudgetPlannerPrompt,
  ItineraryPrompt,
  TravelTipsPrompt,
]

export function runPromptChain(request: TripRequest): PromptChainResult {
  const context = createTripPromptContext(request)
  const steps = PROMPT_CHAIN_BUILDERS.map((build) => build(context))
  const finalPrompt = combinePromptChain(steps, context)

  return { steps, finalPrompt }
}

/** @deprecated Use runPromptChain — kept for backward compatibility. */
export function buildTripPlannerPrompt(request: TripRequest): string {
  return runPromptChain(request).finalPrompt
}
