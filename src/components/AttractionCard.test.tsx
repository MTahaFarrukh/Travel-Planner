import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AttractionCard from './AttractionCard'
import type { AttractionWithDistance } from '../types/attraction'

const sampleAttraction: AttractionWithDistance = {
  id: 'test-attraction',
  destinationId: 'kyoto',
  name: 'Test Shrine',
  description: 'A peaceful shrine with moss gardens.',
  category: 'cultural',
  rating: 4.6,
  imageUrl: 'https://example.com/image.jpg',
  lat: 35.01,
  lon: 135.77,
  distanceKm: 1.2,
}

describe('AttractionCard', () => {
  it('renders attraction details and calls onAdd when clicked', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()

    render(
      <AttractionCard attraction={sampleAttraction} onAdd={onAdd} />,
    )

    expect(screen.getByRole('heading', { name: 'Test Shrine' })).toBeInTheDocument()
    expect(screen.getByText('A peaceful shrine with moss gardens.')).toBeInTheDocument()
    expect(screen.getByText('cultural')).toBeInTheDocument()
    expect(screen.getByLabelText('Rating 4.6 out of 5')).toBeInTheDocument()
    expect(screen.getByText('1.2 km')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Test Shrine to itinerary' }))
    expect(onAdd).toHaveBeenCalledWith(sampleAttraction)
  })

  it('shows added state when isAdded is true', () => {
    render(
      <AttractionCard
        attraction={sampleAttraction}
        onAdd={vi.fn()}
        isAdded
      />,
    )

    expect(
      screen.getByRole('button', {
        name: 'Test Shrine already added to itinerary',
      }),
    ).toBeDisabled()
    expect(screen.getByText('✓ Added')).toBeInTheDocument()
  })
})
