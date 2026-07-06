import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { AttractionWithDistance } from '../../types/attraction'
import type { Destination } from '../../types/destination'
import type { MapPlace } from '../../types/map'
import { useLeafletReady } from '../../hooks/useLeafletReady'
import { formatDistanceKm } from '../../utils/haversine'
import MapSkeleton from '../MapSkeleton'
import FitMapBounds, { MapResizeHandler } from './MapControls'
import {
  MAP_ATTRIBUTION,
  MAP_TILE_URL,
  attractionMarkerIcon,
  destinationMarkerIcon,
  waymarkMarkerIcon,
} from './mapConfig'

interface TripMapProps {
  places: MapPlace[]
  selectedDestination: Destination
  nearbyAttractions: AttractionWithDistance[]
}

export default function TripMap({
  places,
  selectedDestination,
  nearbyAttractions,
}: TripMapProps) {
  const mapReady = useLeafletReady()

  const fitTargets = [
    ...places,
    ...nearbyAttractions,
    {
      id: selectedDestination.id,
      lat: selectedDestination.lat,
      lon: selectedDestination.lon,
    },
  ]

  if (!mapReady) {
    return <MapSkeleton />
  }

  return (
    <div className="trip-map-shell h-[min(56vh,520px)] min-h-[300px] w-full overflow-hidden rounded-2xl border border-parchment/15 shadow-lg sm:min-h-[380px]">
      <MapContainer
        center={[selectedDestination.lat, selectedDestination.lon]}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
        aria-label="Interactive trip map"
      >
        <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
        <MapResizeHandler />
        <FitMapBounds
          places={fitTargets.map((target) => ({
            id: 'id' in target ? String(target.id) : selectedDestination.id,
            name: 'name' in target ? target.name : selectedDestination.name,
            description: '',
            estimatedTime: '',
            lat: target.lat,
            lon: target.lon,
          }))}
        />

        <Circle
          center={[selectedDestination.lat, selectedDestination.lon]}
          radius={5000}
          pathOptions={{
            color: '#c99a3d',
            fillColor: '#c99a3d',
            fillOpacity: 0.06,
            weight: 1.5,
            dashArray: '6 8',
          }}
        />

        <Marker
          position={[selectedDestination.lat, selectedDestination.lon]}
          icon={destinationMarkerIcon}
          zIndexOffset={1000}
        >
          <Popup className="waymark-popup" closeButton>
            <div className="waymark-popup-content">
              <p className="font-mono text-[10px] uppercase tracking-widest text-teal">
                Selected destination
              </p>
              <h3 className="mt-1 font-display text-base font-semibold text-ink">
                {selectedDestination.name}
              </h3>
              <p className="mt-2 text-sm text-ink/75">{selectedDestination.country}</p>
            </div>
          </Popup>
        </Marker>

        {nearbyAttractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={[attraction.lat, attraction.lon]}
            icon={attractionMarkerIcon}
          >
            <Popup className="waymark-popup" closeButton>
              <div className="waymark-popup-content">
                <p className="font-mono text-[10px] uppercase tracking-widest text-teal">
                  {attraction.category}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-ink">
                  {attraction.name}
                </h3>
                <p className="mt-2 text-sm text-ink/75">{attraction.description}</p>
                <p className="mt-2 font-mono text-xs text-brass">
                  {formatDistanceKm(attraction.distanceKm)} · ★{' '}
                  {attraction.rating.toFixed(1)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lon]}
            icon={waymarkMarkerIcon}
          >
            <Popup className="waymark-popup" closeButton>
              <div className="waymark-popup-content">
                <p className="font-mono text-[10px] uppercase tracking-widest text-teal">
                  {place.dayNumber ? `Day ${place.dayNumber}` : 'Stop'}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-ink">
                  {place.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">
                  {place.description}
                </p>
                <p className="mt-3 font-mono text-xs text-brass">
                  {place.estimatedTime}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
