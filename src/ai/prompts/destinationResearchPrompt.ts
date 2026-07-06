import { assembleStructuredPrompt } from './helpers'
import type { StructuredPrompt, TripPromptContext } from './types'

export function DestinationResearchPrompt(
  context: TripPromptContext,
): StructuredPrompt {
  const interests = context.interestLabels.join(', ')

  return assembleStructuredPrompt({
    id: 'destination-research',
    title: 'Step 2 — Destination Research',
    role: 'Destination intelligence researcher',
    objective: `Research ${context.destination} for a ${context.styleLabel.toLowerCase()} traveler.`,
    instructions: [
      'Identify key neighborhoods, districts, or regions worth visiting.',
      'Map interests to specific areas and experience types.',
      'Note cultural context, local customs, and seasonal considerations.',
      'Surface must-see landmarks balanced against the traveler\'s style.',
      'Suggest areas to use as a home base for this trip length.',
    ],
    outputSections: [
      'Destination overview',
      'Recommended neighborhoods and bases',
      'Must-see highlights aligned with interests',
      'Cultural and seasonal notes',
    ],
    body: [
      `Research **${context.destination}** for a **${context.days}-day** visit.`,
      `Travel style: **${context.styleLabel}**. Interests: **${interests}**.`,
      'Provide neighborhood-level insight, cultural context, and a curated list of highlights that match this traveler — not a generic tourist guide.',
    ],
  })
}
