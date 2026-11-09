'use client'

import { useState } from 'react'

export type DonutSegment = { label: string; value: number; color: string }

const R = 62
const STROKE = 18
const GAP = 2
const CIRCUMFERENCE = 2 * Math.PI * R

export function DonutChart({ segments, totalLabel }: { segments: DonutSegment[]; totalLabel: string }) {
  const [active, setActive] = useState<number | null>(null)
  const total = segments.reduce((sum, s) => sum + s.value, 0)

  const lengths = segments.map((s) => (total === 0 ? 0 : (s.value / total) * CIRCUMFERENCE))
  const rings = segments.map((segment, i) => {
    const length = lengths[i]
    const offset = lengths.slice(0, i).reduce((sum, l) => sum + l, 0)
    const dash = Math.max(0, length - (segments.length > 1 ? GAP : 0))
    const ring = (
      <circle
        key={segment.label}
        cx={80}
        cy={80}
        r={R}
        fill="none"
        stroke={segment.color}
        strokeWidth={active === i ? STROKE + 4 : STROKE}
        strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
        strokeDashoffset={-offset}
        className="cursor-pointer transition-[stroke-width] duration-150"
        onPointerEnter={() => setActive(i)}
        onPointerLeave={() => setActive(null)}
      />
    )
    return ring
  })

  const shown = active !== null ? segments[active] : null

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="img" aria-label={totalLabel}>
          <circle cx={80} cy={80} r={R} fill="none" stroke="#eef1f6" strokeWidth={STROKE} />
          {rings}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-gray-900">{shown ? shown.value : total}</span>
          <span className="max-w-24 truncate text-[11px] text-gray-500">{shown ? shown.label : totalLabel}</span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2.5">
        {segments.length === 0 && <li className="text-sm text-gray-400">Sem dados no período.</li>}
        {segments.map((segment, i) => (
          <li
            key={segment.label}
            tabIndex={0}
            className={`flex items-center gap-2 rounded-md px-1.5 py-1 text-sm outline-none transition-colors ${
              active === i ? 'bg-gray-100' : ''
            }`}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: segment.color }} />
            <span className="min-w-0 flex-1 truncate text-gray-700">{segment.label}</span>
            <span className="font-semibold text-gray-900">{segment.value}</span>
            <span className="w-10 text-right text-xs text-gray-500">
              {total === 0 ? '0%' : `${Math.round((segment.value / total) * 100)}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
