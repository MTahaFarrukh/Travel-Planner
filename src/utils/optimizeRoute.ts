import type { RouteStop } from '../types/route'
import { haversineDistanceKm } from './haversine'

const CLUSTER_THRESHOLD_KM = 0.55

interface LocatedStop {
  activityId: string
  title: string
  lat: number
  lon: number
  visitDurationMin: number
}

function distance(a: LocatedStop, b: LocatedStop): number {
  return haversineDistanceKm(a.lat, a.lon, b.lat, b.lon)
}

function clusterStops(stops: LocatedStop[]): LocatedStop[][] {
  if (stops.length <= 1) return [stops]

  const clusters: LocatedStop[][] = []

  for (const stop of stops) {
    let placed = false
    for (const cluster of clusters) {
      const near = cluster.some(
        (member) => distance(member, stop) <= CLUSTER_THRESHOLD_KM,
      )
      if (near) {
        cluster.push(stop)
        placed = true
        break
      }
    }
    if (!placed) clusters.push([stop])
  }

  return clusters
}

function nearestNeighborOrder(
  stops: LocatedStop[],
  start: { lat: number; lon: number },
): LocatedStop[] {
  if (stops.length === 0) return []
  const remaining = [...stops]
  const ordered: LocatedStop[] = []
  let current = { lat: start.lat, lon: start.lon, activityId: '', title: '', visitDurationMin: 0 }

  while (remaining.length > 0) {
    let bestIndex = 0
    let bestDistance = Infinity

    for (let index = 0; index < remaining.length; index += 1) {
      const d = distance(current, remaining[index])
      if (d < bestDistance) {
        bestDistance = d
        bestIndex = index
      }
    }

    const [next] = remaining.splice(bestIndex, 1)
    ordered.push(next)
    current = next
  }

  return ordered
}

function routeDistance(
  order: LocatedStop[],
  start: { lat: number; lon: number },
): number {
  if (order.length === 0) return 0
  let total = haversineDistanceKm(start.lat, start.lon, order[0].lat, order[0].lon)
  for (let index = 1; index < order.length; index += 1) {
    total += distance(order[index - 1], order[index])
  }
  return total
}

function twoOptImprove(
  order: LocatedStop[],
  start: { lat: number; lon: number },
): LocatedStop[] {
  if (order.length < 4) return order

  let improved = [...order]
  let best = routeDistance(improved, start)
  let changed = true

  while (changed) {
    changed = false
    for (let i = 0; i < improved.length - 1; i += 1) {
      for (let j = i + 1; j < improved.length; j += 1) {
        const candidate = [
          ...improved.slice(0, i),
          ...improved.slice(i, j + 1).reverse(),
          ...improved.slice(j + 1),
        ]
        const candidateDistance = routeDistance(candidate, start)
        if (candidateDistance + 0.001 < best) {
          improved = candidate
          best = candidateDistance
          changed = true
        }
      }
    }
  }

  return improved
}

function clusterCentroid(cluster: LocatedStop[]): { lat: number; lon: number } {
  const lat =
    cluster.reduce((sum, stop) => sum + stop.lat, 0) / cluster.length
  const lon =
    cluster.reduce((sum, stop) => sum + stop.lon, 0) / cluster.length
  return { lat, lon }
}

export function optimizeStopOrder(
  stops: LocatedStop[],
  start: { lat: number; lon: number },
): { ordered: RouteStop[]; clusters: number; originalDistanceKm: number; optimizedDistanceKm: number } {
  if (stops.length === 0) {
    return {
      ordered: [],
      clusters: 0,
      originalDistanceKm: 0,
      optimizedDistanceKm: 0,
    }
  }

  const originalOrder = [...stops]
  const originalDistanceKm = routeDistance(originalOrder, start)

  const grouped = clusterStops(stops)
  const clusterMeta = grouped.map((cluster, index) => ({
    id: index,
    centroid: clusterCentroid(cluster),
    stops: cluster,
  }))

  const orderedClusterIds: number[] = []
  const remaining = [...clusterMeta]
  let currentPoint = start

  while (remaining.length > 0) {
    let bestIndex = 0
    let bestDistance = Infinity
    for (let index = 0; index < remaining.length; index += 1) {
      const d = haversineDistanceKm(
        currentPoint.lat,
        currentPoint.lon,
        remaining[index].centroid.lat,
        remaining[index].centroid.lon,
      )
      if (d < bestDistance) {
        bestDistance = d
        bestIndex = index
      }
    }
    const [next] = remaining.splice(bestIndex, 1)
    orderedClusterIds.push(next.id)
    currentPoint = next.centroid
  }

  const flattened: LocatedStop[] = []
  for (const clusterId of orderedClusterIds) {
    const cluster = grouped[clusterId]
    const innerStart =
      flattened.length > 0 ? flattened[flattened.length - 1] : start
    const innerOrdered = twoOptImprove(
      nearestNeighborOrder(cluster, innerStart),
      innerStart,
    )
    flattened.push(...innerOrdered)
  }

  const optimized = twoOptImprove(flattened, start)
  const optimizedDistanceKm = routeDistance(optimized, start)

  const clusterIds = new Map<string, number>()
  grouped.forEach((cluster, clusterIndex) => {
    for (const stop of cluster) {
      clusterIds.set(stop.activityId, clusterIndex)
    }
  })

  const ordered: RouteStop[] = optimized.map((stop, index) => ({
    activityId: stop.activityId,
    title: stop.title,
    lat: stop.lat,
    lon: stop.lon,
    order: index + 1,
    clusterId: clusterIds.get(stop.activityId) ?? 0,
    visitDurationMin: stop.visitDurationMin,
  }))

  return {
    ordered,
    clusters: grouped.length,
    originalDistanceKm,
    optimizedDistanceKm,
  }
}
