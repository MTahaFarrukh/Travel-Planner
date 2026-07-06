import { useCallback, useState } from 'react'
import {
  buildAssistantSystemPrompt,
  buildAssistantUserMessage,
} from '../ai/prompts/assistantPrompt'
import type { Destination } from '../types/destination'
import type { AssistantMessage } from '../types/assistant'
import { buildLocalAssistantReply } from '../utils/buildLocalAssistantReply'
import { chatWithAssistant, hasAiApiKey } from '../utils/openai'

export function useAiAssistant(destination: Destination) {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim()
      if (!trimmed || loading) return

      const userMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setLoading(true)
      setError(null)

      try {
        const systemPrompt = buildAssistantSystemPrompt(destination)
        const history = [...messages, userMessage].map((message) => ({
          role: message.role,
          content:
            message.role === 'user'
              ? buildAssistantUserMessage(destination, message.content)
              : message.content,
        }))

        let reply: string
        const hasApiKey = hasAiApiKey()

        if (hasApiKey) {
          reply = await chatWithAssistant(systemPrompt, history)
        } else {
          reply = buildLocalAssistantReply(destination, trimmed)
        }

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: reply,
            createdAt: new Date().toISOString(),
          },
        ])
      } catch (err) {
        const fallback = buildLocalAssistantReply(destination, trimmed)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: fallback,
            createdAt: new Date().toISOString(),
          },
        ])
        const message =
          err instanceof Error ? err.message : 'Assistant request failed.'
        setError(`${message} Showing a local answer instead.`)
      } finally {
        setLoading(false)
      }
    },
    [destination, loading, messages],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
  }
}
