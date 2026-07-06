import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DestinationCard from './DestinationCard'
import { destinations } from '../data/destinations.js'

vi.mock('../hooks/useWeather.js', () => ({
  useWeather: () => ({
    data: {
      current: {
        temperature: 28,
        unit: 'C',
        condition: 'Clear',
        icon: '☀️',
        weatherCode: 0,
      },
      daily: [],
    },
    loading: false,
    error: null,
  }),
}))

describe('DestinationCard', () => {
  const destination = destinations[0]

  it('renders destination name, country, tagline, and image', () => {
    render(<DestinationCard destination={destination} />)

    expect(
      screen.getByRole('button', {
        name: /Bali, Indonesia\. View weather forecast\./i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Bali')).toBeInTheDocument()
    expect(screen.getByText('Indonesia')).toBeInTheDocument()
    expect(
      screen.getByText('Terraced rice fields meet turquoise shores.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Bali, Indonesia' })).toBeInTheDocument()
  })

  it('renders the weather badge with mocked forecast data', () => {
    render(<DestinationCard destination={destination} />)

    expect(
      screen.getByLabelText('28 degrees C, Clear'),
    ).toBeInTheDocument()
  })
})
