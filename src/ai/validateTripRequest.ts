import type { TripRequest } from '../types/aiTrip'

export function validateTripRequest(request: TripRequest): string | null {
  if (!request.destination.trim()) {
    return 'Enter a destination to generate your trip.'
  }

  if (request.days < 1 || request.days > 30) {
    return 'Trip length must be between 1 and 30 days.'
  }

  if (request.budget < 100) {
    return 'Budget must be at least $100.'
  }

  if (!request.travelStyle) {
    return 'Select a travel style.'
  }

  if (request.interests.length === 0) {
    return 'Select at least one interest.'
  }

  return null
}
