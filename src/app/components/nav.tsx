'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, type IconName } from './icons'

type Item = { href: string; label: string; icon: IconName; active: (path: string) => boolean }

const mainItems: Item[] = [
  { href: '/', label: 'Dashboard', icon: 'grid', active: (p) => p === '/' },
  { href: '/incidentes', label: 'Indisponibilidades', icon: 'alert', active: (p) => p.startsWith('/incidentes') },
  { href: '/causa-raiz', label: 'Causa raiz', icon: 'search', active: (p) => p.startsWith('/causa-raiz') },
]

const quickItems: Item[] = [
  { href: '/incidentes/novo', label: 'Novo incidente', icon: 'plus', active: (p) => p === '/incidentes/novo' },
  { href: '/causa-raiz/novo', label: 'Nova causa raiz', icon: 'plus', active: (p) => p === '/causa-raiz/novo' },
]

function NavLink({ item, pathname }: { item: Item; pathname: string }) {
  const active = item.active(pathname)
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'border-cvc-yellow bg-white/15 text-white'
          : 'border-transparent text-blue-100/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon name={item.icon} className="h-5 w-5 shrink-0" />
      {item.label}
    </Link>
  )
}

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-linear-to-b from-cvc-navy to-cvc-blue-dark px-4 py-5 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-cvc-yellow text-sm font-black tracking-tight text-cvc-navy">
          CVC
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-bold text-white">Indisponibilidades</span>
          <span className="block text-xs text-cvc-yellow">Trend Operadora · TI</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1">
        {mainItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <p className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-blue-200/60">Ações rápidas</p>
      <nav className="mt-2 space-y-1">
        {quickItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-white/10 p-3 text-xs text-blue-100/80">
        <p className="font-semibold text-white">Registro de incidentes</p>
        <p className="mt-1">Use o histórico para fechar chamados do mesmo período.</p>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 overflow-x-auto bg-cvc-navy px-4 py-3 lg:hidden">
      {mainItems.map((item) => {
        const active = item.active(pathname)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
              active ? 'bg-cvc-yellow text-cvc-navy' : 'bg-white/10 text-white'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
