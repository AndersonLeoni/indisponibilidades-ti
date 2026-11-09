import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRootCause } from '@/lib/root-causes-data'
import { listIncidents } from '@/lib/incidents-data'
import { updateRootCause, deleteRootCause } from '@/lib/root-cause-actions'
import { RootCauseFormFields } from '@/app/components/root-cause-form-fields'

export default async function EditarCausaRaizPage(props: PageProps<'/causa-raiz/[id]'>) {
  const { id } = await props.params
  const rootCause = await getRootCause(id).catch(() => null)
  if (!rootCause) notFound()

  const incidents = await listIncidents()

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Editar causa raiz</h1>
        {rootCause.incident_id && (
          <Link href={`/${rootCause.incident_id}`} className="text-sm font-medium text-blue-700 hover:underline">
            Ver incidente relacionado →
          </Link>
        )}
      </div>

      <form action={updateRootCause.bind(null, rootCause.id)} className="mt-6 space-y-4">
        <RootCauseFormFields rootCause={rootCause} incidents={incidents} />
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Salvar
          </button>
          <Link
            href="/causa-raiz"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancelar
          </Link>
        </div>
      </form>

      <form action={deleteRootCause.bind(null, rootCause.id)} className="mt-4">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Excluir causa raiz
        </button>
      </form>
    </main>
  )
}
