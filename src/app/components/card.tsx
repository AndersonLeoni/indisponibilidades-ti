import type { ReactNode } from 'react'

export function Card({
  title,
  subtitle,
  action,
  tone = 'default',
  className = '',
  children,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  tone?: 'default' | 'alert'
  className?: string
  children: ReactNode
}) {
  const toneClass = tone === 'alert' ? 'bg-linear-to-br from-red-50 to-white ring-red-100' : 'bg-white ring-black/5'

  return (
    <section className={`animate-rise rounded-2xl p-5 shadow-sm ring-1 ${toneClass} ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
