const SERIES = '#2a78d6'

export function HBars({ items }: { items: { label: string; value: number; display: string }[] }) {
  const max = Math.max(1, ...items.map((item) => item.value))

  if (items.length === 0) return <p className="text-sm text-gray-400">Sem dados no período.</p>

  return (
    <ul className="space-y-3.5">
      {items.map((item, k) => (
        <li key={item.label} className="group" title={`${item.label}: ${item.display}`}>
          <p className="mb-1 truncate text-xs text-gray-700">{item.label}</p>
          <div className="flex items-center gap-2">
            <div
              className="animate-grow-x h-2.5 rounded-r-[4px] transition-[filter] group-hover:brightness-110"
              style={{
                width: `${Math.max(2, (item.value / max) * 78)}%`,
                background: SERIES,
                animationDelay: `${k * 70}ms`,
              }}
            />
            <span className="text-xs font-semibold text-gray-900">{item.display}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function MonthlyBars({ items }: { items: { key: string; label: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((item) => item.count))

  return (
    <div>
      <div className="flex h-36 items-end justify-between gap-3 border-b border-[#c3c2b7]">
        {items.map((item, k) => (
          <div
            key={item.key}
            className="group flex flex-1 flex-col items-center justify-end"
            title={`${item.label}: ${item.count} incidente(s)`}
          >
            <span className="mb-1 text-xs font-semibold text-gray-700">{item.count}</span>
            <div
              className="animate-grow-y w-6 rounded-t-[4px] transition-[filter] group-hover:brightness-110"
              style={{
                height: item.count === 0 ? 0 : Math.max(3, Math.round((item.count / max) * 112)),
                background: SERIES,
                animationDelay: `${k * 70}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-3">
        {items.map((item) => (
          <span key={item.key} className="flex-1 text-center text-xs capitalize text-gray-500">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Sparkline({ values }: { values: number[] }) {
  const w = 120
  const h = 32
  const max = Math.max(1, ...values)
  const stepX = values.length > 1 ? w / (values.length - 1) : 0
  const pts = values.map((v, i) => `${(i * stepX).toFixed(1)},${(h - 2 - (v / max) * (h - 6)).toFixed(1)}`)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill="currentColor" fillOpacity={0.15} />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
