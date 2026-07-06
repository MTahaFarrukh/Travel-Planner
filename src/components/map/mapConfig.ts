import L from 'leaflet'

export const MAP_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

export const waymarkMarkerIcon = L.divIcon({
  className: 'waymark-marker',
  html: '<span class="waymark-marker-pin" aria-hidden="true"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 28],
  popupAnchor: [0, -26],
})

export const destinationMarkerIcon = L.divIcon({
  className: 'waymark-destination-marker',
  html: '<span class="waymark-destination-pin" aria-hidden="true"></span>',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
  popupAnchor: [0, -30],
})

export const attractionMarkerIcon = L.divIcon({
  className: 'waymark-attraction-marker',
  html: '<span class="waymark-attraction-pin" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
})

export function routeStopMarkerIcon(order: number): L.DivIcon {
  return L.divIcon({
    className: 'waymark-route-stop-marker',
    html: `<span class="waymark-route-stop-pin" aria-hidden="true">${order}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}
