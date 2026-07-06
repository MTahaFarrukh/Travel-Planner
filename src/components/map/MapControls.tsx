import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { MapPlace } from '../../types/map'

interface FitMapBoundsProps {
  places: MapPlace[]
}

export default function FitMapBounds({ places }: FitMapBoundsProps) {
  const map = useMap()

  useEffect(() => {
    if (places.length === 0) return

    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lon], 12, { animate: true })
      return
    }

    const bounds = L.latLngBounds(
      places.map((place) => [place.lat, place.lon] as [number, number]),
    )
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13, animate: true })
  }, [map, places])

  return null
}

export function MapResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])

  return null
}
