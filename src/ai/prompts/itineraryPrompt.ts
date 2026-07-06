import { assembleStructuredPrompt } from './helpers'
import type { StructuredPrompt, TripPromptContext } from './types'

export function ItineraryPrompt(context: TripPromptContext): StructuredPrompt {
  const interests = context.interestLabels.join(', ')

  return assembleStructuredPrompt({
    id: 'itinerary',
    title: 'Step 4 — Itinerary Builder',
    role: 'Itinerary architect',
    objective: `Design a ${context.days}-day day-by-day plan for ${context.destination}.`,
    instructions: [
      `Cover every day from Day 1 through Day ${context.days}.`,
      'Structure each day into morning, afternoon, and evening blocks with approximate times.',
      `Weave in interests: ${interests}.`,
      `Match activity level and comfort to a ${context.styleLabel.toLowerCase()} style.`,
      'Include transit time between locations and avoid over-packing days.',
      'Assign a theme or focus to each day.',
    ],
    outputSections: [
      'Day-by-day itinerary (all days)',
      'Morning / afternoon / evening blocks per day',
      'Estimated duration per activity',
      'Daily theme and logistics notes',
    ],
    body: [
      `Build a complete **${context.days}-day itinerary** for **${context.destination}**.`,
      `Traveler type: **${context.styleLabel}**. Interests: **${interests}**. Budget: **${context.formattedBudget}**.`,
      'Each day must include morning, afternoon, and evening plans with realistic timing and geographic flow.',
    ],
  })
}
