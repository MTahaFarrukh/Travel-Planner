import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MarkdownContent from './MarkdownContent'

describe('MarkdownContent', () => {
  it('renders headings, bullets, and bold text', () => {
    render(
      <MarkdownContent
        content={'## Tips\n\n- Try **local ramen**\n\nPlain paragraph'}
        variant="ink"
      />,
    )

    expect(screen.getByRole('heading', { name: 'Tips' })).toBeInTheDocument()
    expect(screen.getByText(/local ramen/)).toBeInTheDocument()
    expect(screen.getByText('Plain paragraph')).toBeInTheDocument()
  })
})
