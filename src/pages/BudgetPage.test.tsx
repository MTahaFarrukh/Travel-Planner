import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { TripProvider } from '../context/TripContext'
import BudgetPage from './BudgetPage'
import { BUDGET_CATEGORIES, DEFAULT_BUDGET } from '../types/budget'
import { formatCurrency } from '../utils/formatCurrency'
import { clearPersistedState } from '../utils/storage'

function renderBudgetPage() {
  return render(
    <TripProvider>
      <BudgetPage />
    </TripProvider>,
  )
}

describe('BudgetPage', () => {
  beforeEach(() => {
    clearPersistedState()
  })

  it('renders one budget control per category with default values on load', () => {
    renderBudgetPage()

    expect(
      screen.getByRole('heading', { name: 'Estimate your trip' }),
    ).toBeInTheDocument()

    for (const category of BUDGET_CATEGORIES) {
      expect(
        screen.getByLabelText(`${category.label} budget slider`),
      ).toHaveValue(String(DEFAULT_BUDGET[category.id]))
      expect(
        screen.getByLabelText(`${category.label} budget amount`),
      ).toHaveValue(DEFAULT_BUDGET[category.id])
    }
  })

  it('renders the chart section and correct estimated total', () => {
    renderBudgetPage()

    expect(screen.getByText('Estimate breakdown')).toBeInTheDocument()
    expect(
      screen.getByText(formatCurrency(2100)),
    ).toBeInTheDocument()
  })
})
