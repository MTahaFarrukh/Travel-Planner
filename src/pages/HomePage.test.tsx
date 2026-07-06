import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import HomePage from './HomePage'

vi.mock('../hooks/useWeather.js', () => ({
  useWeather: () => ({
    data: null,
    loading: false,
    error: null,
  }),
}))

describe('HomePage tab navigation', () => {
  it('shows Explore by default with the tab marked active', () => {
    render(<HomePage />)

    expect(screen.getByLabelText('Waymark home — go to Explore')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Chart your course to somewhere unforgettable',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Explore' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('shows the Itinerary section when the Itinerary tab is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByRole('tab', { name: 'Itinerary' }))

    expect(
      screen.getByRole('heading', { name: 'Plan day by day' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Itinerary' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: 'Explore' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('shows the Budget section when the Budget tab is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByRole('tab', { name: 'Budget' }))

    expect(
      screen.getByRole('heading', { name: 'Estimate your trip' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Budget' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('shows the Hotels section when the Hotels tab is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByRole('tab', { name: 'Hotels' }))

    expect(
      screen.getByRole('heading', { name: 'Find a place to stay' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Hotels' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })
})
