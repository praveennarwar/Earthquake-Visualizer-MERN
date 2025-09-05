import React from 'react'

export default function Controls({
  minMag, setMinMag,
  search, setSearch,
  sortBy, setSortBy,
  count,
  onFit
}) {
  return (
    <div className="controls card">
      <div className="row">
        <label>Min Magnitude: <b>{minMag.toFixed(1)}</b></label>
        <input
          type="range"
          min="0" max="8" step="0.1"
          value={minMag}
          onChange={e => setMinMag(parseFloat(e.target.value))}
        />
      </div>

      <div className="row">
        <label>Search Place</label>
        <input
          type="text"
          placeholder="e.g., Alaska"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        <label>Sort By</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="time">Most Recent</option>
          <option value="mag">Magnitude</option>
        </select>
      </div>

      <div className="row actions">
        <button className="btn" onClick={onFit}>Fit to Data</button>
        <span className="muted">{count} earthquakes</span>
      </div>

      <div className="legend">
        <div className="legend-title">Legend</div>
        <div className="legend-items">
          <div><span className="dot depth-shallow"></span>Depth &lt; 70 km</div>
          <div><span className="dot depth-intermediate"></span>70–300 km</div>
          <div><span className="dot depth-deep"></span>&gt; 300 km</div>
          <div className="legend-note">Circle size scales with magnitude</div>
        </div>
      </div>
    </div>
  )
}
