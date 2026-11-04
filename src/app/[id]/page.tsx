import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getIncident } from '@/lib/incidents-data'
import { updateIncident, deleteIncident } from '@/lib/actions'
import { IncidentFormFields } from '@/app/components/incident-form-fields'

export default async function IncidentePage(props: PageProps<'/[id]'>) {
  const { id } = await props.params
  const incident = await getIncident(id).catch(() => null)
  if (!incident) notFound()

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Editar incidente</h1>
        <Link href={`/${incident.id}/comunicado`} className="text-sm font-medium text-blue-700 hover:underline">
          Gerar comunicado →
        </Link>
      </div>

      <form action={updateIncident.bind(null, incident.id)} className="mt-6 space-y-4">
        <IncidentFormFields incident={incident} />
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

      <form action={deleteIncident.bind(null, incident.id)} className="mt-4">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Excluir incidente
        </button>
      </form>
    </main>
  )
}
