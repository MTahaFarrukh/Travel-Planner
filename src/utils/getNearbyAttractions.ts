import type { Attraction, AttractionWithDistance } from '../types/attraction'
import { haversineDistanceKm } from './haversine'

export function getNearbyAttractions(
  centerLat: number,
  centerLon: number,
  attractions: Attraction[],
  radiusKm = 5,
): AttractionWithDistance[] {
  return attractions
    .map((attraction) => ({
      ...attraction,
      distanceKm: haversineDistanceKm(
        centerLat,
        centerLon,
        attraction.lat,
        attraction.lon,
      ),
    }))
    .filter((attraction) => attraction.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
