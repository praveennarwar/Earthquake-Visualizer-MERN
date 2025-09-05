import React, { useEffect, useMemo, useState } from 'react'
import Controls from './components/Controls.jsx'
import QuakeMap from './components/QuakeMap.jsx'
import QuakeList from './components/QuakeList.jsx'
import { formatTime } from './utils/format.js'

export default function App() {
  const [raw, setRaw] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [minMag, setMinMag] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('time')
  const [selectedId, setSelectedId] = useState(null)
  const [fitSignal, setFitSignal] = useState(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const r = await fetch('/api/earthquakes')
      if (!r.ok) throw new Error('Network error')
      const data = await r.json()
      setRaw(data)
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const features = useMemo(() => raw?.features ?? [], [raw])

  const filtered = useMemo(() => {
    return features
      .filter(f => {
        const mag = f.properties?.mag ?? -Infinity
        const place = (f.properties?.place || '').toLowerCase()
        return mag >= minMag && place.includes(search.toLowerCase())
      })
      .sort((a, b) => {
        if (sortBy === 'mag') return (b.properties.mag ?? -999) - (a.properties.mag ?? -999)
        return (b.properties.time ?? 0) - (a.properties.time ?? 0)
      })
  }, [features, minMag, search, sortBy])

  const lastUpdated = raw?.metadata?.generated ? new Date(raw.metadata.generated) : null

  return (
    <div className="app">
      <header className="topbar">
        <h1>🌍 Earthquake Visualizer</h1>
        <div className="meta">
          {lastUpdated && <span>Last updated: {formatTime(lastUpdated)}</span>}
          <button className="btn" onClick={fetchData} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <Controls
            minMag={minMag}
            setMinMag={setMinMag}
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            count={filtered.length}
            onFit={() => setFitSignal(v => v + 1)}
          />
          <QuakeList
            items={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        <main className="main">
          {error && <div className="error">⚠️ {error}</div>}
          {!error && (
            <QuakeMap
              items={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              fitSignal={fitSignal}
            />
          )}
        </main>
      </div>

      <footer className="footer">
        Data: USGS “All Day” feed · This is a student visualization tool.
      </footer>
    </div>
  )
}
