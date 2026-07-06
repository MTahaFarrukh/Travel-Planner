import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PackingCategoryCard from './PackingCategoryCard'
import { PACKING_CATEGORY_META } from '../../constants/packing'
import type { PackingItem } from '../../types/packing'

const meta = PACKING_CATEGORY_META[0]

const items: PackingItem[] = [
  {
    id: 'item-1',
    label: 'Passport',
    category: 'documents',
    checked: false,
  },
  {
    id: 'item-2',
    label: 'Travel insurance',
    category: 'documents',
    checked: true,
  },
]

describe('PackingCategoryCard', () => {
  it('renders items and toggles checked state', async () => {
    const user = userEvent.setup()
    const onToggleItem = vi.fn()

    render(
      <PackingCategoryCard
        meta={meta}
        items={items}
        onToggleItem={onToggleItem}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Documents' })).toBeInTheDocument()
    expect(screen.getByText('Passport')).toBeInTheDocument()
    expect(screen.getByText('1/2')).toBeInTheDocument()

    await user.click(screen.getByText('Passport'))
    expect(onToggleItem).toHaveBeenCalledWith('item-1')
  })
})
