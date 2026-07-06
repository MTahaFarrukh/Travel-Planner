let leafletStylesLoaded = false

export async function loadLeafletStyles(): Promise<void> {
  if (leafletStylesLoaded) return
  await import('leaflet/dist/leaflet.css')
  leafletStylesLoaded = true
}
