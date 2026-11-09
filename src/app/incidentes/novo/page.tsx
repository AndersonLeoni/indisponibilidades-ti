import Link from 'next/link'
import { createIncident } from '@/lib/actions'
import { IncidentFormFields } from '@/app/components/incident-form-fields'

export default function NovoIncidentePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-cvc-navy">Novo incidente</h1>
      <form
        action={createIncident}
        className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
      >
        <IncidentFormFields />
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-cvc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cvc-blue-dark"
          >
            Salvar
          </button>
          <Link href="/incidentes" className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  )
}
