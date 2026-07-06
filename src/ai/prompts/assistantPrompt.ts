import type { Destination } from '../../types/destination'
import { getEmergencyContacts } from '../../pdf/emergencyContacts'

export function buildAssistantSystemPrompt(destination: Destination): string {
  const emergency = getEmergencyContacts(destination.country)
    .map((contact) => `${contact.label}: ${contact.value}`)
    .join('; ')

  return [
    'You are Waymark, a concise and friendly travel assistant embedded in a trip planner app.',
    `The traveler is planning a trip to **${destination.name}, ${destination.country}**.`,
    `Destination style: ${destination.category}. Tagline: ${destination.tagline}.`,
    `Known emergency contacts: ${emergency}.`,
    '',
    'Answer practical questions about food, transport passes, rideshare, customs, scams, and currency.',
    'Use markdown: short headings, bullet lists, and **bold** for key tips.',
    'Keep answers focused (under 200 words unless safety-critical).',
    'If unsure, say what to verify locally rather than inventing specifics.',
    'Prefer actionable, neighborhood-level advice when possible.',
  ].join('\n')
}

export function buildAssistantUserMessage(
  destination: Destination,
  question: string,
): string {
  return `Destination: ${destination.name}, ${destination.country}\n\nQuestion: ${question}`
}
