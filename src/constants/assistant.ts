import type { AssistantQuickPrompt } from '../types/assistant'

export const ASSISTANT_QUICK_PROMPTS: AssistantQuickPrompt[] = [
  {
    id: 'food',
    label: 'Where to eat?',
    question: 'Where should I eat in this destination?',
  },
  {
    id: 'metro',
    label: 'Metro pass',
    question: 'What is the best metro or transit pass for tourists?',
  },
  {
    id: 'uber',
    label: 'Uber available?',
    question: 'Is Uber or rideshare available here?',
  },
  {
    id: 'customs',
    label: 'Local customs',
    question: 'What local customs should I know before visiting?',
  },
  {
    id: 'emergency',
    label: 'Emergency numbers',
    question: 'What are the emergency numbers I should save?',
  },
  {
    id: 'scams',
    label: 'Scam warnings',
    question: 'What tourist scams should I watch out for?',
  },
  {
    id: 'currency',
    label: 'Currency exchange',
    question: 'Where is the best place to exchange currency?',
  },
]
