import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ActivityForm from './ActivityForm'

describe('ActivityForm', () => {
  it('renders the add-activity form fields and submit button', () => {
    render(<ActivityForm onAdd={vi.fn()} />)

    expect(
      screen.getByRole('heading', { name: 'Add an activity' }),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. Morning market stroll')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add to itinerary' }),
    ).toBeInTheDocument()
  })
})
