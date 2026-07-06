import { useCallback, useEffect, useState } from 'react'
import {
  buildBudgetOptimizerPrompt,
  validateBudgetLimit,
} from '../ai/prompts/budgetOptimizerPrompt'
import type { BudgetBreakdown } from '../types/budget'
import type { BudgetOptimizationResult } from '../types/budgetOptimizer'
import { buildLocalBudgetOptimization } from '../utils/buildLocalBudgetOptimization'
import {
  loadBudgetOptimizerState,
  saveBudgetOptimizerState,
} from '../utils/budgetOptimizerStorage'
import { generateBudgetOptimization, hasAiApiKey } from '../utils/openai'
import { parseBudgetOptimization } from '../utils/parseBudgetOptimization'

export function useAiBudgetOptimizer(budget: BudgetBreakdown) {
  const [budgetLimit, setBudgetLimit] = useState(
    () => loadBudgetOptimizerState().budgetLimit,
  )
  const [result, setResult] = useState<BudgetOptimizationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveBudgetOptimizerState(budgetLimit)
  }, [budgetLimit])

  const analyzeBudget = useCallback(async () => {
    const validationError = validateBudgetLimit(budgetLimit)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const prompt = buildBudgetOptimizerPrompt(budget, budgetLimit)
      const hasApiKey = hasAiApiKey()

      if (hasApiKey) {
        const raw = await generateBudgetOptimization(prompt)
        const parsed = parseBudgetOptimization(raw, budget, budgetLimit)
        if (parsed) {
          setResult(parsed)
          return
        }
      }

      setResult(buildLocalBudgetOptimization(budget, budgetLimit))
      if (!hasApiKey) {
        setError(
          'AI API key not found — used smart local analysis instead. Add VITE_GROQ_API_KEY or VITE_OPENAI_API_KEY for AI suggestions.',
        )
      }
    } catch (err) {
      setResult(buildLocalBudgetOptimization(budget, budgetLimit))
      const message =
        err instanceof Error ? err.message : 'Failed to analyze budget.'
      setError(`${message} Showing local suggestions instead.`)
    } finally {
      setLoading(false)
    }
  }, [budget, budgetLimit])

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    budgetLimit,
    setBudgetLimit,
    result,
    loading,
    error,
    analyzeBudget,
    clearResult,
  }
}
