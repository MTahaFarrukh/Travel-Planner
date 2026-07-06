import { useCallback, useEffect, useState } from 'react'
import { buildPackingPrompt, validatePackingRequest } from '../ai/prompts/packingPrompt'
import { DEFAULT_PACKING_REQUEST } from '../constants/packing'
import { useTrip } from '../context/TripContext'
import type {
  PackingActivity,
  PackingChecklist,
  PackingRequest,
  PackingTripType,
  PackingWeather,
  TravelMonth,
} from '../types/packing'
import { buildLocalPackingList } from '../utils/buildLocalPackingList'
import { downloadPackingChecklist } from '../utils/downloadPackingChecklist'
import { generatePackingChecklist, hasAiApiKey } from '../utils/openai'
import { parsePackingResponse } from '../utils/parsePackingResponse'
import {
  loadPackingState,
  savePackingState,
} from '../utils/packingStorage'

export function useAiPackingList() {
  const { aiTripDestination } = useTrip()
  const [request, setRequest] = useState<PackingRequest>(() => {
    const persisted = loadPackingState()
    if (persisted.request.destination.trim()) return persisted.request
    if (aiTripDestination) {
      return { ...persisted.request, destination: aiTripDestination }
    }
    return persisted.request
  })
  const [checklist, setChecklist] = useState<PackingChecklist | null>(
    () => loadPackingState().checklist,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(
    () => loadPackingState().savedAt,
  )
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    savePackingState({ request, checklist, savedAt })
  }, [request, checklist, savedAt])

  const updateField = useCallback(
    <K extends keyof PackingRequest>(field: K, value: PackingRequest[K]) => {
      setRequest((prev) => ({ ...prev, [field]: value }))
      setError(null)
      setSaveMessage(null)
    },
    [],
  )

  const setTravelMonth = useCallback((month: TravelMonth) => {
    setRequest((prev) => ({ ...prev, travelMonth: month }))
    setError(null)
    setSaveMessage(null)
  }, [])

  const setWeather = useCallback((weather: PackingWeather) => {
    setRequest((prev) => ({ ...prev, weather }))
    setError(null)
    setSaveMessage(null)
  }, [])

  const setTripType = useCallback((tripType: PackingTripType) => {
    setRequest((prev) => ({ ...prev, tripType }))
    setError(null)
    setSaveMessage(null)
  }, [])

  const toggleActivity = useCallback((activity: PackingActivity) => {
    setRequest((prev) => {
      const exists = prev.activities.includes(activity)
      return {
        ...prev,
        activities: exists
          ? prev.activities.filter((item) => item !== activity)
          : [...prev.activities, activity],
      }
    })
    setError(null)
    setSaveMessage(null)
  }, [])

  const toggleItem = useCallback((itemId: string) => {
    setChecklist((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item,
        ),
      }
    })
    setSaveMessage(null)
  }, [])

  const reset = useCallback(() => {
    setRequest({ ...DEFAULT_PACKING_REQUEST, activities: [] })
    setChecklist(null)
    setError(null)
    setLoading(false)
    setSavedAt(null)
    setSaveMessage(null)
  }, [])

  const generateList = useCallback(async () => {
    const validationError = validatePackingRequest(request)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)
    setSaveMessage(null)

    try {
      const prompt = buildPackingPrompt(request)
      const hasApiKey = hasAiApiKey()

      if (hasApiKey) {
        const raw = await generatePackingChecklist(prompt)
        const parsed = parsePackingResponse(raw)
        if (parsed && parsed.items.length > 0) {
          setChecklist(parsed)
          return
        }
      }

      setChecklist(buildLocalPackingList(request))
      if (!hasApiKey) {
        setError(
          'AI API key not found — generated a smart local checklist instead. Add VITE_GROQ_API_KEY or VITE_OPENAI_API_KEY for AI lists.',
        )
      }
    } catch (err) {
      setChecklist(buildLocalPackingList(request))
      const message =
        err instanceof Error ? err.message : 'Failed to generate packing list.'
      setError(`${message} Showing a local checklist instead.`)
    } finally {
      setLoading(false)
    }
  }, [request])

  const saveLocally = useCallback(() => {
    const timestamp = new Date().toISOString()
    setSavedAt(timestamp)
    savePackingState({ request, checklist, savedAt: timestamp })
    setSaveMessage('Checklist saved in this browser.')
  }, [request, checklist])

  const downloadList = useCallback(() => {
    if (!checklist) return
    downloadPackingChecklist(request, checklist)
  }, [request, checklist])

  const packedCount = checklist?.items.filter((item) => item.checked).length ?? 0
  const totalCount = checklist?.items.length ?? 0

  return {
    request,
    checklist,
    loading,
    error,
    savedAt,
    saveMessage,
    packedCount,
    totalCount,
    updateField,
    setTravelMonth,
    setWeather,
    setTripType,
    toggleActivity,
    toggleItem,
    generateList,
    saveLocally,
    downloadList,
    reset,
  }
}
