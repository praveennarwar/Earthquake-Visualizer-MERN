import React from 'react'
import { formatAgo, formatMag } from '../utils/format.js'

export default function QuakeList({ items, selectedId, onSelect }) {
  return (
    <div className="list card">
      {items.length === 0 && <div className="muted">No earthquakes match your filters.</div>}
      {items.map(f => {
        const { id, properties, geometry } = f
        const [ , , depthKm ] = geometry.coordinates
        const isSel = id === selectedId
        return (
          <button
            key={id}
            className={`list-item ${isSel ? 'active' : ''}`}
            onClick={() => onSelect(id)}
            title={properties.place}
          >
            <div className="list-row">
              <span className="mag">{formatMag(properties.mag)}</span>
              <span className="place">{properties.place || 'Unknown location'}</span>
            </div>
            <div className="list-sub">
              <span>{formatAgo(new Date(properties.time))}</span>
              <span>Depth {depthKm != null ? `${depthKm} km` : '—'}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
