import Link from 'next/link'
import { createIncident } from '@/lib/actions'
import { IncidentFormFields } from '@/app/components/incident-form-fields'

export default function NovoIncidentePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Novo incidente</h1>
      <form action={createIncident} className="mt-6 space-y-4">
        <IncidentFormFields />
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Salvar
          </button>
          <Link href="/" className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  )
}
