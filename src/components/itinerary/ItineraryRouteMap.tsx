import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import type { Destination } from '../../types/destination'
import type { OptimizedDayRoute } from '../../types/route'
import { useLeafletReady } from '../../hooks/useLeafletReady'
import MapSkeleton from '../MapSkeleton'
import FitMapBounds, { MapResizeHandler } from '../map/MapControls'
import {
  MAP_ATTRIBUTION,
  MAP_TILE_URL,
  routeStopMarkerIcon,
} from '../map/mapConfig'

interface ItineraryRouteMapProps {
  route: OptimizedDayRoute
  destination: Destination
}

export default function ItineraryRouteMap({
  route,
  destination,
}: ItineraryRouteMapProps) {
  const mapReady = useLeafletReady()

  const positions = route.stops.map(
    (stop) => [stop.lat, stop.lon] as [number, number],
  )

  const fitPlaces = route.stops.map((stop) => ({
    id: stop.activityId,
    name: stop.title,
    description: '',
    estimatedTime: stop.suggestedTime ?? '',
    lat: stop.lat,
    lon: stop.lon,
  }))

  if (!mapReady) {
    return (
      <MapSkeleton className="h-[min(48vh,440px)] min-h-[260px] sm:min-h-[320px]" />
    )
  }

  return (
    <div className="trip-map-shell h-[min(48vh,440px)] min-h-[260px] w-full overflow-hidden rounded-2xl border border-parchment/15 shadow-lg sm:min-h-[320px]">
      <MapContainer
        center={[destination.lat, destination.lon]}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
        aria-label="Optimized day route map"
      >
        <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
        <MapResizeHandler />
        <FitMapBounds places={fitPlaces} />

        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: '#2a9d8f',
              weight: 4,
              opacity: 0.85,
              dashArray: '8 6',
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        {route.stops.map((stop) => (
          <Marker
            key={stop.activityId}
            position={[stop.lat, stop.lon]}
            icon={routeStopMarkerIcon(stop.order)}
            zIndexOffset={500 + stop.order}
          >
            <Popup className="waymark-popup" closeButton>
              <div className="waymark-popup-content">
                <p className="font-mono text-[10px] uppercase tracking-widest text-teal">
                  Stop {stop.order}
                  {route.clusters > 1 ? ` · Group ${stop.clusterId + 1}` : ''}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-ink">
                  {stop.title}
                </h3>
                {stop.suggestedTime && (
                  <p className="mt-2 font-mono text-xs text-brass">
                    Suggested arrival {stop.suggestedTime}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
