'use client'

import { useState } from 'react'

export type TimePoint = { label: string; short: string; value: number }

const SERIES = '#2a78d6'
const W = 640
const H = 240
const PAD = { l: 34, r: 14, t: 14, b: 28 }

export function TimeSeriesChart({ points, unit, ariaLabel }: { points: TimePoint[]; unit: string; ariaLabel: string }) {
  const [hover, setHover] = useState<number | null>(null)

  const n = points.length
  const max = Math.max(1, ...points.map((p) => p.value))
  const step = Math.ceil(max / 4)
  const top = step * 4
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const x = (i: number) => PAD.l + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1))
  const y = (v: number) => PAD.t + (1 - v / top) * innerH

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ')
  const area = `${line} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`
  const ticks = [0, 1, 2, 3, 4].map((k) => k * step)
  const labelEvery = Math.ceil(n / 6)
  const isEmpty = points.every((p) => p.value === 0)

  function indexFromPointer(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction = (event.clientX - rect.left) / rect.width
    return Math.min(n - 1, Math.max(0, Math.round(fraction * (n - 1))))
  }

  function handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') setHover((h) => Math.min(n - 1, (h ?? -1) + 1))
    if (event.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? n) - 1))
    if (event.key === 'Escape') setHover(null)
  }

  const active = hover !== null ? points[hover] : null
  const activeLeft = hover !== null ? (x(hover) / W) * 100 : 0

  return (
    <div
      className="relative"
      tabIndex={0}
      onKeyDown={handleKey}
      onBlur={() => setHover(null)}
      role="group"
      aria-label={`${ariaLabel}. Use as setas para percorrer os dias.`}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(tick)}
              y2={y(tick)}
              stroke={tick === 0 ? '#c3c2b7' : '#e1e0d9'}
              strokeWidth={1}
            />
            <text x={PAD.l - 8} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#898781">
              {tick}
            </text>
          </g>
        ))}

        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text key={p.label} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill="#898781">
              {p.short}
            </text>
          ) : null,
        )}

        <path d={area} fill={SERIES} fillOpacity={0.1} />
        <path
          d={line}
          pathLength={1}
          className="animate-draw"
          fill="none"
          stroke={SERIES}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <circle cx={x(n - 1)} cy={y(points[n - 1].value)} r={4} fill={SERIES} stroke="#fff" strokeWidth={2} />

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={y(0)} stroke="#c3c2b7" strokeWidth={1} />
            <circle cx={x(hover)} cy={y(points[hover].value)} r={4.5} fill={SERIES} stroke="#fff" strokeWidth={2} />
          </g>
        )}

        <rect
          x={PAD.l}
          y={PAD.t}
          width={innerW}
          height={innerH}
          fill="transparent"
          onPointerMove={(event) => setHover(indexFromPointer(event))}
          onPointerLeave={() => setHover(null)}
        />

        {isEmpty && (
          <text x={W / 2} y={H / 2 - 10} textAnchor="middle" fontSize={13} fill="#898781">
            Sem ocorrências no período
          </text>
        )}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -mt-2 -translate-y-full rounded-lg bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-black/10"
          style={{
            left: `${activeLeft}%`,
            top: `${(y(active.value) / H) * 100}%`,
            transform: `translate(${activeLeft > 70 ? '-100%' : activeLeft < 15 ? '0%' : '-50%'}, -100%)`,
          }}
        >
          <p className="text-gray-500">{active.label}</p>
          <p className="mt-0.5 flex items-center gap-2 text-gray-900">
            <span className="inline-block h-0.5 w-3 rounded" style={{ background: SERIES }} />
            <span className="text-sm font-semibold">{active.value}</span>
            <span className="text-gray-500">{unit}</span>
          </p>
        </div>
      )}
    </div>
  )
}
