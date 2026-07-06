/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_OPENAI_MODEL?: string
  readonly VITE_GROQ_API_KEY?: string
  readonly VITE_GROQ_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
