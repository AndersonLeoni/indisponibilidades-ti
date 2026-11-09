import Link from 'next/link'
import { createRootCause } from '@/lib/root-cause-actions'
import { listIncidents } from '@/lib/incidents-data'
import { RootCauseFormFields } from '@/app/components/root-cause-form-fields'

export const dynamic = 'force-dynamic'

export default async function NovaCausaRaizPage() {
  const incidents = await listIncidents()

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Nova causa raiz</h1>
      <form action={createRootCause} className="mt-6 space-y-4">
        <RootCauseFormFields incidents={incidents} />
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
    </main>
  )
}
