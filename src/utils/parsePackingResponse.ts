import {
  PACKING_CATEGORY_IDS,
  type PackingChecklist,
  type PackingItem,
  type PackingListByCategory,
} from '../types/packing'

function stripJsonFences(raw: string): string {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  return fenced ? fenced[1].trim() : trimmed
}

function isCategoryRecord(value: unknown): value is PackingListByCategory {
  if (!value || typeof value !== 'object') return false

  return PACKING_CATEGORY_IDS.every((category) => {
    const items = (value as Record<string, unknown>)[category]
    return (
      Array.isArray(items) && items.every((item) => typeof item === 'string')
    )
  })
}

export function itemsFromCategoryLists(
  lists: PackingListByCategory,
  source: PackingChecklist['source'],
): PackingChecklist {
  const items: PackingItem[] = []

  for (const category of PACKING_CATEGORY_IDS) {
    for (const label of lists[category]) {
      const trimmed = label.trim()
      if (!trimmed) continue
      items.push({
        id: crypto.randomUUID(),
        label: trimmed,
        category,
        checked: false,
      })
    }
  }

  return {
    items,
    generatedAt: new Date().toISOString(),
    source,
  }
}

export function parsePackingResponse(raw: string): PackingChecklist | null {
  try {
    const parsed = JSON.parse(stripJsonFences(raw)) as unknown
    if (!isCategoryRecord(parsed)) return null
    return itemsFromCategoryLists(parsed, 'ai')
  } catch {
    return null
  }
}
