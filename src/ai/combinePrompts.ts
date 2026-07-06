import type { StructuredPrompt, TripPromptContext } from './prompts/types'

const SYNTHESIS_SECTIONS = [
  'Executive summary',
  'Day-by-day itinerary with morning / afternoon / evening blocks',
  'Estimated cost breakdown',
  'Transportation guide',
  'Food recommendations',
  'Hidden gems',
  'Practical tips',
]

export function combinePromptChain(
  steps: StructuredPrompt[],
  context: TripPromptContext,
): string {
  const interests = context.interestLabels.join(', ')
  const stepBlocks = steps
    .map((step) => [`---`, step.text, ''].join('\n'))
    .join('\n')

  return [
    '# Waymark AI Trip Planner — Prompt Chain',
    '',
    'You are an expert travel planner. A multi-step prompt chain has been prepared from the traveler\'s inputs.',
    'Study every chain step below, then synthesize them into **one unified, polished trip plan** in markdown.',
    'Do not skip steps. Resolve any conflicts between steps in favor of the traveler\'s budget, style, and interests.',
    '',
    '## Traveler inputs',
    `- **Destination:** ${context.destination}`,
    `- **Duration:** ${context.days} day${context.days === 1 ? '' : 's'}`,
    `- **Budget:** ${context.formattedBudget}`,
    `- **Travel style:** ${context.styleLabel}`,
    `- **Interests:** ${interests}`,
    '',
    '## Prompt chain',
    '',
    stepBlocks,
    '---',
    '',
    '## Final synthesis instructions',
    'Using all five chain steps above, produce a single cohesive response with these sections:',
    ...SYNTHESIS_SECTIONS.map((section, index) => `${index + 1}. **${section}**`),
    '',
    '## Formatting rules',
    '- Use clear markdown headings and bullet points.',
    '- Be specific with neighborhoods, venue types, and activity durations.',
    '- Keep recommendations realistic for the budget and travel style.',
    '- Use reasonable price ranges when exact prices are uncertain.',
    '- Make the itinerary actionable — a traveler should be able to follow it directly.',
  ].join('\n')
}
