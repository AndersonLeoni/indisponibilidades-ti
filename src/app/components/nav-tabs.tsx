'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Indisponibilidades', match: (path: string) => !path.startsWith('/causa-raiz') },
  { href: '/causa-raiz', label: 'Causa raiz', match: (path: string) => path.startsWith('/causa-raiz') },
]

export function NavTabs() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl gap-6 px-6">
        {tabs.map((tab) => {
          const active = tab.match(pathname)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`border-b-2 py-3 text-sm font-medium ${
                active
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
