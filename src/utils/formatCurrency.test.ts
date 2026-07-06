import { describe, expect, it } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('formats whole amounts with a dollar sign and thousands separators', () => {
    expect(formatCurrency(1200)).toBe('$1,200')
    expect(formatCurrency(1000000)).toBe('$1,000,000')
  })

  it('rounds to the nearest dollar with no decimal places', () => {
    expect(formatCurrency(99.4)).toBe('$99')
    expect(formatCurrency(99.6)).toBe('$100')
  })

  it('formats zero as $0', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('formats negative values with a leading minus after the dollar sign', () => {
    expect(formatCurrency(-50)).toBe('$-50')
    expect(formatCurrency(-1234.6)).toBe('$-1,235')
  })
})
