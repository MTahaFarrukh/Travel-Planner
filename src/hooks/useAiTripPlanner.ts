import { useCallback, useState } from 'react'
import { runPromptChain, validateTripRequest } from '../ai'
import type { StructuredPrompt } from '../ai/prompts/types'
import { useTrip } from '../context/TripContext'
import { DEFAULT_TRIP_REQUEST } from '../constants/aiTrip'
import type { TravelStyle, TripInterest, TripRequest } from '../types/aiTrip'
import { extractMapPlacesFromAiPlan } from '../utils/extractMapPlacesFromAiPlan'
import { generateTripPlan } from '../utils/openai'

export function useAiTripPlanner() {
  const { setAiItinerary, clearAiItinerary } = useTrip()
  const [request, setRequest] = useState<TripRequest>({
    ...DEFAULT_TRIP_REQUEST,
    interests: [],
  })
  const [prompt, setPrompt] = useState<string | null>(null)
  const [promptChain, setPromptChain] = useState<StructuredPrompt[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = useCallback(
    <K extends keyof TripRequest>(field: K, value: TripRequest[K]) => {
      setRequest((prev) => ({ ...prev, [field]: value }))
      setError(null)
    },
    [],
  )

  const setTravelStyle = useCallback((style: TravelStyle) => {
    setRequest((prev) => ({ ...prev, travelStyle: style }))
    setError(null)
  }, [])

  const toggleInterest = useCallback((interest: TripInterest) => {
    setRequest((prev) => {
      const exists = prev.interests.includes(interest)
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      }
    })
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setRequest({ ...DEFAULT_TRIP_REQUEST, interests: [] })
    setPrompt(null)
    setPromptChain([])
    setResult(null)
    setError(null)
    setLoading(false)
    clearAiItinerary()
  }, [clearAiItinerary])

  const generateTrip = useCallback(async () => {
    const validationError = validateTripRequest(request)
    if (validationError) {
      setError(validationError)
      return
    }

    const chain = runPromptChain(request)
    setPrompt(chain.finalPrompt)
    setPromptChain(chain.steps)
    setResult(null)
    setLoading(true)
    setError(null)

    try {
      const plan = await generateTripPlan(chain.finalPrompt)
      setResult(plan)
      const mapPlaces = extractMapPlacesFromAiPlan(plan, request.destination)
      setAiItinerary(mapPlaces, request.destination)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to generate trip plan.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [request, setAiItinerary])

  return {
    request,
    prompt,
    promptChain,
    result,
    loading,
    error,
    updateField,
    setTravelStyle,
    toggleInterest,
    generateTrip,
    reset,
  }
}
