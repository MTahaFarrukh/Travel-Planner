const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const OPENAI_DEFAULT_MODEL = 'gpt-4o-mini'
const GROQ_DEFAULT_MODEL = 'llama-3.3-70b-versatile'

export type AiProvider = 'openai' | 'groq'

export class OpenAiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'OpenAiError'
  }
}

function readEnvKey(name: string): string | null {
  const value = import.meta.env[name as keyof ImportMetaEnv]
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null
}

function looksLikeGroqKey(key: string): boolean {
  return key.startsWith('gsk_')
}

export function getAiProvider(): AiProvider | null {
  const groqKey = readEnvKey('VITE_GROQ_API_KEY')
  const openAiKey = readEnvKey('VITE_OPENAI_API_KEY')

  if (groqKey) return 'groq'
  if (openAiKey && looksLikeGroqKey(openAiKey)) return 'groq'
  if (openAiKey) return 'openai'
  return null
}

/** @deprecated Use hasAiApiKey() — kept for existing imports */
export function getOpenAiApiKey(): string | null {
  return getAiApiKey()
}

export function getAiApiKey(): string | null {
  const groqKey = readEnvKey('VITE_GROQ_API_KEY')
  const openAiKey = readEnvKey('VITE_OPENAI_API_KEY')

  if (groqKey) return groqKey
  if (openAiKey && looksLikeGroqKey(openAiKey)) return openAiKey
  return openAiKey
}

export function hasAiApiKey(): boolean {
  return getAiApiKey() !== null
}

function getChatConfig(): {
  apiUrl: string
  apiKey: string
  model: string
  provider: AiProvider
} {
  const provider = getAiProvider()
  const apiKey = getAiApiKey()

  if (!provider || !apiKey) {
    throw new OpenAiError(
      'AI API key not configured. Add VITE_GROQ_API_KEY or VITE_OPENAI_API_KEY to your .env file.',
    )
  }

  if (provider === 'groq') {
    return {
      apiUrl: GROQ_API_URL,
      apiKey,
      model: readEnvKey('VITE_GROQ_MODEL') ?? GROQ_DEFAULT_MODEL,
      provider,
    }
  }

  return {
    apiUrl: OPENAI_API_URL,
    apiKey,
    model: readEnvKey('VITE_OPENAI_MODEL') ?? OPENAI_DEFAULT_MODEL,
    provider,
  }
}

interface ChatCompletionOptions {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  temperature: number
  responseFormat?: { type: 'json_object' }
}

async function createChatCompletion(
  options: ChatCompletionOptions,
): Promise<string> {
  const { apiUrl, apiKey, model } = getChatConfig()

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature,
      ...(options.responseFormat ? { response_format: options.responseFormat } : {}),
    }),
  })

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as {
        error?: { message?: string }
      }
      if (body.error?.message) detail = body.error.message
    } catch {
      // use default detail
    }
    throw new OpenAiError(detail, response.status)
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new OpenAiError('No response received from the AI model.')
  }

  return content
}

export async function generateTripPlan(prompt: string): Promise<string> {
  return createChatCompletion({
    messages: [
      {
        role: 'system',
        content:
          'You are a professional travel planner. Produce detailed, well-structured trip plans in markdown.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  })
}

export async function generateBudgetOptimization(prompt: string): Promise<string> {
  return createChatCompletion({
    messages: [
      {
        role: 'system',
        content:
          'You are a travel budget coach. Return only valid JSON with practical savings advice.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    responseFormat: { type: 'json_object' },
  })
}

export async function generatePackingChecklist(prompt: string): Promise<string> {
  return createChatCompletion({
    messages: [
      {
        role: 'system',
        content:
          'You are a professional travel packing assistant. Return only valid JSON packing lists with no markdown.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
    responseFormat: { type: 'json_object' },
  })
}

export async function chatWithAssistant(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  return createChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
    temperature: 0.6,
  })
}
