import {
  INTEREST_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
} from '../../constants/aiTrip'
import type { TripRequest } from '../../types/aiTrip'
import { formatCurrency } from '../../utils/formatCurrency'
import type { StructuredPrompt, TripPromptContext } from './types'

export function labelForTravelStyle(
  style: NonNullable<TripRequest['travelStyle']>,
): string {
  return (
    TRAVEL_STYLE_OPTIONS.find((option) => option.id === style)?.label ?? style
  )
}

export function labelsForInterests(
  interests: TripRequest['interests'],
): string[] {
  return interests.map(
    (interest) =>
      INTEREST_OPTIONS.find((option) => option.id === interest)?.label ??
      interest,
  )
}

export function createTripPromptContext(
  request: TripRequest,
): TripPromptContext {
  if (!request.travelStyle) {
    throw new Error('Travel style is required to build prompt context.')
  }

  const destination = request.destination.trim()

  return {
    request: {
      ...request,
      destination,
      travelStyle: request.travelStyle,
    },
    destination,
    days: request.days,
    budget: request.budget,
    formattedBudget: formatCurrency(request.budget),
    styleLabel: labelForTravelStyle(request.travelStyle),
    interestLabels: labelsForInterests(request.interests),
  }
}

export function assembleStructuredPrompt(
  partial: Omit<StructuredPrompt, 'text'> & { body: string[] },
): StructuredPrompt {
  const text = [
    `### ${partial.title}`,
    `**Role:** ${partial.role}`,
    `**Objective:** ${partial.objective}`,
    '',
    '**Instructions:**',
    ...partial.instructions.map((line) => `- ${line}`),
    '',
    '**Expected output sections:**',
    ...partial.outputSections.map((line) => `- ${line}`),
    '',
    '**Task:**',
    ...partial.body,
  ].join('\n')

  return { ...partial, text }
}
