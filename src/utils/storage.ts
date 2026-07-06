import { DEFAULT_BUDGET, type BudgetBreakdown } from '../types/budget'
import type { Reservation } from '../types/hotel'
import type { Activity } from '../types/itinerary'

export const STORAGE_KEY = 'waymark-app-state'
export const STORAGE_VERSION = 1

export interface PersistedAppState {
  version: number
  activities: Activity[]
  reservations: Reservation[]
  budget: BudgetBreakdown
}

export const DEFAULT_APP_STATE: PersistedAppState = {
  version: STORAGE_VERSION,
  activities: [],
  reservations: [],
  budget: DEFAULT_BUDGET,
}

function isBudgetBreakdown(value: unknown): value is BudgetBreakdown {
  if (!value || typeof value !== 'object') return false
  const budget = value as Record<string, unknown>
  return (
    typeof budget.flights === 'number' &&
    typeof budget.hotels === 'number' &&
    typeof budget.food === 'number' &&
    typeof budget.activities === 'number'
  )
}

function isActivity(value: unknown): value is Activity {
  if (!value || typeof value !== 'object') return false
  const activity = value as Record<string, unknown>
  return (
    typeof activity.id === 'string' &&
    typeof activity.dayNumber === 'number' &&
    typeof activity.title === 'string'
  )
}

function isReservation(value: unknown): value is Reservation {
  if (!value || typeof value !== 'object') return false
  const reservation = value as Record<string, unknown>
  return (
    typeof reservation.id === 'string' &&
    typeof reservation.hotelId === 'string' &&
    typeof reservation.checkIn === 'string' &&
    typeof reservation.checkOut === 'string'
  )
}

export function parsePersistedState(raw: string | null): PersistedAppState {
  if (!raw) return DEFAULT_APP_STATE

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedAppState>
    if (parsed.version !== STORAGE_VERSION) return DEFAULT_APP_STATE

    const activities = Array.isArray(parsed.activities)
      ? parsed.activities.filter(isActivity)
      : []
    const reservations = Array.isArray(parsed.reservations)
      ? parsed.reservations.filter(isReservation)
      : []
    const budget = isBudgetBreakdown(parsed.budget)
      ? parsed.budget
      : DEFAULT_BUDGET

    return { version: STORAGE_VERSION, activities, reservations, budget }
  } catch {
    return DEFAULT_APP_STATE
  }
}

export function loadPersistedState(): PersistedAppState {
  if (typeof window === 'undefined') return DEFAULT_APP_STATE
  return parsePersistedState(window.localStorage.getItem(STORAGE_KEY))
}

export function savePersistedState(state: Omit<PersistedAppState, 'version'>): void {
  if (typeof window === 'undefined') return

  const payload: PersistedAppState = { version: STORAGE_VERSION, ...state }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearPersistedState(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
