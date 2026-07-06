import { assembleStructuredPrompt } from './helpers'
import type { StructuredPrompt, TripPromptContext } from './types'

export function TripAnalyzerPrompt(
  context: TripPromptContext,
): StructuredPrompt {
  const interests = context.interestLabels.join(', ')

  return assembleStructuredPrompt({
    id: 'trip-analyzer',
    title: 'Step 1 — Trip Analyzer',
    role: 'Senior travel strategist',
    objective: `Analyze the traveler profile and trip constraints for ${context.destination}.`,
    instructions: [
      `Interpret a ${context.days}-day ${context.styleLabel.toLowerCase()} trip with interests in ${interests}.`,
      `Total budget is ${context.formattedBudget} — factor this into pacing and expectations.`,
      'Identify the ideal trip rhythm (relaxed, balanced, or packed) for this style.',
      'Flag any tension between budget, duration, and interests.',
      'Recommend a high-level daily pace template before detailed planning begins.',
    ],
    outputSections: [
      'Traveler profile summary',
      'Trip pacing recommendation',
      'Priority themes for this journey',
      'Constraints and trade-offs to respect',
    ],
    body: [
      `Analyze a ${context.styleLabel.toLowerCase()} traveler visiting **${context.destination}** for **${context.days} day${context.days === 1 ? '' : 's'}** with a total budget of **${context.formattedBudget}**.`,
      `Their stated interests: **${interests}**.`,
      'Determine the best overall trip rhythm, highlight what matters most for this traveler type, and note any budget or time trade-offs before detailed planning.',
    ],
  })
}
