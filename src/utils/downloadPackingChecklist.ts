import { PACKING_CATEGORY_META } from '../constants/packing'
import type { PackingChecklist, PackingRequest } from '../types/packing'

function formatRequestSummary(request: PackingRequest): string[] {
  return [
    `Destination: ${request.destination}`,
    `Month: ${request.travelMonth ?? '—'}`,
    `Weather: ${request.weather ?? '—'}`,
    `Trip type: ${request.tripType ?? '—'}`,
    `Activities: ${
      request.activities.length > 0 ? request.activities.join(', ') : '—'
    }`,
  ]
}

export function formatPackingChecklistText(
  request: PackingRequest,
  checklist: PackingChecklist,
): string {
  const lines: string[] = [
    'WAYMARK — PACKING CHECKLIST',
    '===========================',
    '',
    ...formatRequestSummary(request),
    '',
    `Generated: ${new Date(checklist.generatedAt).toLocaleString()}`,
    `Source: ${checklist.source === 'ai' ? 'AI' : 'Local template'}`,
    '',
  ]

  for (const category of PACKING_CATEGORY_META) {
    const items = checklist.items.filter((item) => item.category === category.id)
    if (items.length === 0) continue

    lines.push(category.label.toUpperCase())
    lines.push('-'.repeat(category.label.length))

    for (const item of items) {
      lines.push(`[${item.checked ? 'x' : ' '}] ${item.label}`)
    }

    lines.push('')
  }

  const packed = checklist.items.filter((item) => item.checked).length
  lines.push(`Progress: ${packed}/${checklist.items.length} items packed`)
  lines.push('')
  lines.push('Packed with Waymark — waymark.travel')

  return lines.join('\n')
}

export function downloadPackingChecklist(
  request: PackingRequest,
  checklist: PackingChecklist,
): void {
  const text = formatPackingChecklistText(request, checklist)
  const slug = request.destination.trim().toLowerCase().replace(/\s+/g, '-')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `waymark-packing-${slug || 'trip'}.txt`
  anchor.click()
  URL.revokeObjectURL(url)
}
