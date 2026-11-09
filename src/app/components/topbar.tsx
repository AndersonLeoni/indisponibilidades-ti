import Link from 'next/link'
import { Icon } from './icons'

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-black/5 bg-white/85 px-6 py-3 backdrop-blur">
      <p className="text-sm font-semibold text-cvc-navy">Gestão de indisponibilidades de sistema</p>
      <div className="flex items-center gap-2">
        <Link
          href="/causa-raiz/novo"
          className="inline-flex items-center gap-1.5 rounded-lg bg-cvc-yellow px-3 py-2 text-sm font-semibold text-cvc-navy hover:bg-cvc-yellow-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          <span className="hidden sm:inline">Nova causa raiz</span>
        </Link>
        <Link
          href="/incidentes/novo"
          className="inline-flex items-center gap-1.5 rounded-lg bg-cvc-blue px-3 py-2 text-sm font-semibold text-white hover:bg-cvc-blue-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          <span className="hidden sm:inline">Novo incidente</span>
        </Link>
      </div>
    </header>
  )
}
