import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Activity } from '../types/itinerary'
import ActivityList from './ActivityList'

const sampleActivities: Activity[] = [
  {
    id: 'a1',
    dayNumber: 1,
    title: 'Temple visit',
    time: '09:00',
  },
  {
    id: 'a2',
    dayNumber: 1,
    title: 'Beach afternoon',
    notes: 'Bring sunscreen',
  },
]

describe('ActivityList', () => {
  it('renders the empty-state invitation when there are no activities', () => {
    render(<ActivityList activities={[]} onRemove={vi.fn()} />)

    expect(screen.getByText('Nothing planned yet')).toBeInTheDocument()
    expect(
      screen.getByText(/add your first stop/i),
    ).toBeInTheDocument()
  })

  it('renders one list item per activity when activities are present', () => {
    render(
      <ActivityList activities={sampleActivities} onRemove={vi.fn()} />,
    )

    expect(screen.getByRole('list', { name: 'Day activities' })).toBeInTheDocument()
    expect(screen.getByText('Temple visit')).toBeInTheDocument()
    expect(screen.getByText('Beach afternoon')).toBeInTheDocument()
    expect(screen.getByText('Bring sunscreen')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
