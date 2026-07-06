import { describe, expect, it } from 'vitest'
import { parsePackingResponse } from './parsePackingResponse'

describe('parsePackingResponse', () => {
  it('parses valid JSON into checklist items', () => {
    const raw = JSON.stringify({
      documents: ['Passport'],
      clothing: ['Rain jacket', 'Walking shoes'],
      electronics: ['Phone charger'],
      medicine: ['Pain relievers'],
      accessories: ['Daypack'],
      essentials: ['Toiletry kit'],
    })

    const checklist = parsePackingResponse(raw)

    expect(checklist).not.toBeNull()
    expect(checklist!.items).toHaveLength(7)
    expect(checklist!.items[0]).toMatchObject({
      label: 'Passport',
      category: 'documents',
      checked: false,
    })
    expect(checklist!.source).toBe('ai')
  })

  it('parses fenced JSON responses', () => {
    const raw = '```json\n{"documents":[],"clothing":["Sweater"],"electronics":[],"medicine":[],"accessories":[],"essentials":[]}\n```'
    const checklist = parsePackingResponse(raw)

    expect(checklist?.items).toHaveLength(1)
    expect(checklist?.items[0].label).toBe('Sweater')
  })

  it('returns null for invalid payloads', () => {
    expect(parsePackingResponse('not json')).toBeNull()
    expect(parsePackingResponse('{"documents":[]}')).toBeNull()
  })
})
