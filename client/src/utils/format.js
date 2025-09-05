export function formatTime(d) {
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

export function formatAgo(d) {
  const ms = Date.now() - d.getTime()
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs>1?'s':''} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days>1?'s':''} ago`
}

export function formatMag(m) {
  if (m == null || Number.isNaN(m)) return 'M —'
  return `M ${m.toFixed(1)}`
}
