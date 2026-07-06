import { describe, expect, it } from 'vitest'
import { destinations } from '../data/destinations.js'
import { buildLocalAssistantReply } from './buildLocalAssistantReply'

describe('buildLocalAssistantReply', () => {
  const kyoto = destinations.find((item) => item.id === 'kyoto')!

  it('returns markdown for food questions', () => {
    const reply = buildLocalAssistantReply(kyoto, 'Where should I eat?')
    expect(reply).toMatch(/## Where to eat/)
    expect(reply).toMatch(/Nishiki Market/)
  })

  it('returns emergency contacts for emergency questions', () => {
    const reply = buildLocalAssistantReply(kyoto, 'What are emergency numbers?')
    expect(reply).toMatch(/## Emergency numbers/)
    expect(reply).toMatch(/110/)
  })

  it('returns transit advice for metro questions', () => {
    const reply = buildLocalAssistantReply(kyoto, 'Best metro pass?')
    expect(reply).toMatch(/Transit/)
    expect(reply).toMatch(/IC card/i)
  })
})
