import { DEFAULT_PACKING_REQUEST } from '../constants/packing'
import type { PackingChecklist, PackingRequest } from '../types/packing'

export const PACKING_STORAGE_KEY = 'waymark-packing-state'
const PACKING_STORAGE_VERSION = 1

export interface PersistedPackingState {
  version: number
  request: PackingRequest
  checklist: PackingChecklist | null
  savedAt: string | null
}

export const DEFAULT_PACKING_STATE: PersistedPackingState = {
  version: PACKING_STORAGE_VERSION,
  request: { ...DEFAULT_PACKING_REQUEST, activities: [] },
  checklist: null,
  savedAt: null,
}

function isPackingRequest(value: unknown): value is PackingRequest {
  if (!value || typeof value !== 'object') return false
  const request = value as Record<string, unknown>
  return (
    typeof request.destination === 'string' &&
    Array.isArray(request.activities)
  )
}

function isPackingChecklist(value: unknown): value is PackingChecklist {
  if (!value || typeof value !== 'object') return false
  const checklist = value as Record<string, unknown>
  if (!Array.isArray(checklist.items)) return false

  return checklist.items.every((item) => {
    if (!item || typeof item !== 'object') return false
    const record = item as Record<string, unknown>
    return (
      typeof record.id === 'string' &&
      typeof record.label === 'string' &&
      typeof record.category === 'string' &&
      typeof record.checked === 'boolean'
    )
  })
}

export function parsePackingState(raw: string | null): PersistedPackingState {
  if (!raw) return DEFAULT_PACKING_STATE

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedPackingState>
    if (parsed.version !== PACKING_STORAGE_VERSION) return DEFAULT_PACKING_STATE

    return {
      version: PACKING_STORAGE_VERSION,
      request: isPackingRequest(parsed.request)
        ? parsed.request
        : DEFAULT_PACKING_STATE.request,
      checklist: isPackingChecklist(parsed.checklist) ? parsed.checklist : null,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
    }
  } catch {
    return DEFAULT_PACKING_STATE
  }
}

export function loadPackingState(): PersistedPackingState {
  if (typeof window === 'undefined') return DEFAULT_PACKING_STATE
  return parsePackingState(window.localStorage.getItem(PACKING_STORAGE_KEY))
}

export function savePackingState(
  state: Omit<PersistedPackingState, 'version'>,
): void {
  if (typeof window === 'undefined') return

  const payload: PersistedPackingState = {
    version: PACKING_STORAGE_VERSION,
    ...state,
  }
  window.localStorage.setItem(PACKING_STORAGE_KEY, JSON.stringify(payload))
}
