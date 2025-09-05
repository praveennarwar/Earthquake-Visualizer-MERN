import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { formatAgo } from '../utils/format.js'

function depthColor(depthKm) {
  if (depthKm == null) return '#666';
  if (depthKm < 70) return '#2e7d32';
  if (depthKm < 300) return '#f9a825';
  return '#c62828';
}

function magRadius(mag) {
  if (mag == null || isNaN(mag)) return 3;
  return Math.max(3, Math.min(24, mag * mag));
}

function FitBounds({ bounds, signal }) {
  const map = useMap()
  useEffect(() => {
    if (!bounds) return
    try {
      map.fitBounds(bounds, { padding: [20, 20] })
    } catch {}
  }, [signal])
  return null
}

export default function QuakeMap({ items, selectedId, onSelect, fitSignal }) {
  const bounds = useMemo(() => {
    if (!items?.length) return null
    const latlngs = items.map(f => {
      const [lon, lat] = f.geometry.coordinates
      return [lat, lon]
    })
    return latlngs
  }, [items])

  const selectedFeature = useMemo(
    () => items.find(f => f.id === selectedId),
    [items, selectedId]
  )

  const center = selectedFeature
    ? [selectedFeature.geometry.coordinates[1], selectedFeature.geometry.coordinates[0]]
    : [20, 0]

  return (
    <MapContainer
      center={center}
      zoom={selectedFeature ? 5 : 2}
      className="map"
      scrollWheelZoom
      worldCopyJump
      preferCanvas
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {bounds && <FitBounds bounds={bounds} signal={fitSignal} />}

      {items.map(f => {
        const { id, properties, geometry } = f
        const [lon, lat, depthKm] = geometry.coordinates
        const mag = properties?.mag
        const isSelected = id === selectedId

        return (
          <CircleMarker
            key={id}
            center={[lat, lon]}
            radius={magRadius(mag) * (isSelected ? 1.2 : 1)}
            pathOptions={{
              color: depthColor(depthKm),
              weight: isSelected ? 3 : 1,
              opacity: 0.9,
              fillOpacity: 0.5
            }}
            eventHandlers={{
              click: () => onSelect(id)
            }}
          >
            <Popup>
              <div className="popup">
                <div className="popup-title">{properties.place || 'Unknown location'}</div>
                <div><b>Magnitude:</b> {mag ?? '—'}</div>
                <div><b>Depth:</b> {depthKm != null ? `${depthKm} km` : '—'}</div>
                <div><b>Time:</b> {formatAgo(new Date(properties.time))}</div>
                {properties.url && (
                  <div style={{ marginTop: 6 }}>
                    <a href={properties.url} target="_blank" rel="noreferrer">USGS Event Page ↗</a>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
