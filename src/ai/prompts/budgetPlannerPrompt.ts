import { assembleStructuredPrompt } from './helpers'
import type { StructuredPrompt, TripPromptContext } from './types'

export function BudgetPlannerPrompt(
  context: TripPromptContext,
): StructuredPrompt {
  const dailyAverage = Math.round(context.budget / context.days)

  return assembleStructuredPrompt({
    id: 'budget-planner',
    title: 'Step 3 — Budget Planner',
    role: 'Travel budget analyst',
    objective: `Allocate ${context.formattedBudget} across a ${context.days}-day ${context.destination} trip.`,
    instructions: [
      `Work within a total budget of ${context.formattedBudget} (≈ $${dailyAverage}/day).`,
      `Align spending with a ${context.styleLabel.toLowerCase()} travel style.`,
      'Break costs into accommodation, food, activities, local transport, and miscellaneous.',
      'Provide realistic ranges — avoid inventing exact prices for specific venues unless confident.',
      'Identify where to splurge vs. save for this traveler profile.',
    ],
    outputSections: [
      'Category budget allocation table',
      'Daily spending target',
      'Splurge vs. save recommendations',
      'Sample cost ranges for major expense types',
    ],
    body: [
      `Plan the budget for **${context.destination}**: **${context.formattedBudget}** total over **${context.days} days** (~$${dailyAverage}/day).`,
      `Travel style: **${context.styleLabel}**.`,
      'Produce a category breakdown that stays within budget while supporting the planned activities and comfort level.',
    ],
  })
}
