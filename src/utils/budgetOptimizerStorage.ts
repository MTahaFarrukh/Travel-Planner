export const BUDGET_OPTIMIZER_STORAGE_KEY = 'waymark-budget-optimizer'
const STORAGE_VERSION = 1

export interface PersistedBudgetOptimizerState {
  version: number
  budgetLimit: number
}

export const DEFAULT_BUDGET_LIMIT = 2000

export const DEFAULT_BUDGET_OPTIMIZER_STATE: PersistedBudgetOptimizerState = {
  version: STORAGE_VERSION,
  budgetLimit: DEFAULT_BUDGET_LIMIT,
}

export function loadBudgetOptimizerState(): PersistedBudgetOptimizerState {
  if (typeof window === 'undefined') return DEFAULT_BUDGET_OPTIMIZER_STATE

  try {
    const raw = window.localStorage.getItem(BUDGET_OPTIMIZER_STORAGE_KEY)
    if (!raw) return DEFAULT_BUDGET_OPTIMIZER_STATE

    const parsed = JSON.parse(raw) as Partial<PersistedBudgetOptimizerState>
    if (parsed.version !== STORAGE_VERSION) return DEFAULT_BUDGET_OPTIMIZER_STATE

    return {
      version: STORAGE_VERSION,
      budgetLimit:
        typeof parsed.budgetLimit === 'number' && parsed.budgetLimit >= 100
          ? parsed.budgetLimit
          : DEFAULT_BUDGET_LIMIT,
    }
  } catch {
    return DEFAULT_BUDGET_OPTIMIZER_STATE
  }
}

export function saveBudgetOptimizerState(budgetLimit: number): void {
  if (typeof window === 'undefined') return

  const payload: PersistedBudgetOptimizerState = {
    version: STORAGE_VERSION,
    budgetLimit,
  }
  window.localStorage.setItem(
    BUDGET_OPTIMIZER_STORAGE_KEY,
    JSON.stringify(payload),
  )
}
