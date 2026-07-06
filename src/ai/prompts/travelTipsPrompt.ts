import { assembleStructuredPrompt } from './helpers'
import type { StructuredPrompt, TripPromptContext } from './types'

export function TravelTipsPrompt(context: TripPromptContext): StructuredPrompt {
  const interests = context.interestLabels.join(', ')

  return assembleStructuredPrompt({
    id: 'travel-tips',
    title: 'Step 5 — Travel Tips & Logistics',
    role: 'Local travel advisor',
    objective: `Provide logistics, food, transport, and insider tips for ${context.destination}.`,
    instructions: [
      'Cover airport arrival/departure and getting around locally.',
      'Recommend food experiences aligned with interests and travel style.',
      'Suggest at least 3 hidden gems most tourists overlook.',
      'Include booking-ahead advice, safety notes, and packing tips.',
      'Add photography or timing tips if relevant to stated interests.',
    ],
    outputSections: [
      'Transportation guide (arrival, local transit, day trips)',
      'Food recommendations (restaurants, dishes, markets)',
      'Hidden gems (3+ lesser-known spots)',
      'Practical tips (etiquette, safety, bookings, packing)',
    ],
    body: [
      `Provide logistics and insider recommendations for **${context.destination}**.`,
      `Travel style: **${context.styleLabel}**. Interests: **${interests}**. Trip length: **${context.days} days**.`,
      'Focus on transportation, food, hidden gems, and actionable practical advice.',
    ],
  })
}
