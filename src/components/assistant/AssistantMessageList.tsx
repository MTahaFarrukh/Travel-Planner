import { useEffect, useRef } from 'react'
import type { AssistantMessage } from '../../types/assistant'
import MarkdownContent from '../MarkdownContent'
import EmptyState from '../EmptyState'
import Skeleton from '../Skeleton'

interface AssistantMessageListProps {
  messages: AssistantMessage[]
  loading: boolean
}

export default function AssistantMessageList({
  messages,
  loading,
}: AssistantMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) {
    return (
      <EmptyState
        className="flex-1 border-none bg-transparent py-10"
        title="Ask anything about your trip"
        description="Food, transit, customs, scams, currency, and more."
        icon={
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        }
      />
    )
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'assistant' ? (
            <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-parchment/15 bg-parchment px-4 py-3 shadow-md">
              <MarkdownContent content={message.content} variant="ink" />
            </div>
          ) : (
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-teal px-4 py-3 text-sm leading-relaxed text-parchment shadow-md">
              {message.content}
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex justify-start" aria-live="polite" aria-busy="true">
          <div className="space-y-2 rounded-2xl rounded-bl-md border border-parchment/15 bg-parchment/90 px-4 py-3">
            <Skeleton className="h-3 w-40" variant="teal" rounded="md" aria-label="Assistant is typing" />
            <Skeleton className="h-3 w-28" variant="teal" rounded="md" aria-hidden="true" />
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
