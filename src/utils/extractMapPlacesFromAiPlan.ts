import type { MapPlace } from '../types/map'
import { resolveDestination, spiralOffset } from './resolveDestination'

const TIME_BLOCK_PATTERNS = [
  { pattern: /\bmorning\b/i, label: 'Morning' },
  { pattern: /\bafternoon\b/i, label: 'Afternoon' },
  { pattern: /\bevening\b/i, label: 'Evening' },
  { pattern: /\bnight\b/i, label: 'Evening' },
]

function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, '').replace(/\*/g, '').trim()
}

function extractPlaceName(text: string): string {
  const cleaned = stripMarkdown(text)
  const beforeDash = cleaned.split(/[–—-]/)[0]?.trim()
  const beforeColon = (beforeDash ?? cleaned).split(':')[0]?.trim()
  const name = beforeColon ?? cleaned
  return name.length > 60 ? `${name.slice(0, 57)}…` : name
}

function detectTimeBlock(line: string): string | null {
  for (const { pattern, label } of TIME_BLOCK_PATTERNS) {
    if (pattern.test(line) && line.length < 48) return label
  }
  return null
}

function extractTimeFromText(text: string, fallback: string): string {
  const range = text.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*[-–]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i)
  if (range) return `${range[1]} – ${range[2]}`

  const single = text.match(/\b(\d{1,2}:\d{2})\b/)
  if (single) return single[1]

  return fallback
}

export function extractMapPlacesFromAiPlan(
  plan: string,
  destinationQuery: string,
): MapPlace[] {
  const destination = resolveDestination(destinationQuery)
  if (!destination) return []

  const places: MapPlace[] = []
  let currentTimeBlock = 'Flexible'
  let currentDay = 1

  for (const rawLine of plan.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    if (/^#{1,3}\s*Day\s+(\d+)/i.test(line) || /^Day\s+(\d+)/i.test(line)) {
      const match = line.match(/Day\s+(\d+)/i)
      currentDay = match ? Number(match[1]) : currentDay + 1
      continue
    }

    const timeBlock = detectTimeBlock(line)
    if (timeBlock) {
      currentTimeBlock = timeBlock
      continue
    }

    const bullet = line.match(/^[-*•]\s+(.+)/) ?? line.match(/^\d+\.\s+(.+)/)
    if (!bullet) continue

    const description = stripMarkdown(bullet[1])
    if (description.length < 4) continue
    if (/^estimated cost|^transportation|^budget/i.test(description)) continue

    const offset = spiralOffset(places.length)
    places.push({
      id: `ai-place-${places.length}`,
      name: extractPlaceName(description),
      description,
      estimatedTime: extractTimeFromText(description, currentTimeBlock),
      lat: destination.lat + offset.lat,
      lon: destination.lon + offset.lon,
      dayNumber: currentDay,
    })
  }

  return places
}
