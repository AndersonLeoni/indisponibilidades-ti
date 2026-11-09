import Link from 'next/link'
import { listIncidents } from '@/lib/incidents-data'
import { deleteIncident } from '@/lib/actions'
import { formatDateTime, formatDuration } from '@/lib/datetime'
import type { IncidentStatus } from '@/lib/types'

const statusLabel: Record<IncidentStatus, string> = {
  investigando: 'Em investigação',
  mitigado: 'Mitigado',
  resolvido: 'Resolvido',
}

const statusStyle: Record<IncidentStatus, string> = {
  investigando: 'bg-amber-100 text-amber-800',
  mitigado: 'bg-blue-100 text-blue-800',
  resolvido: 'bg-green-100 text-green-800',
}

function param(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : ''
}

export default async function Home(props: PageProps<'/incidentes'>) {
  const searchParams = await props.searchParams
  const system = param(searchParams.system)
  const status = param(searchParams.status)
  const from = param(searchParams.from)
  const to = param(searchParams.to)

  const incidents = await listIncidents({ system, status, from, to })

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cvc-navy">Indisponibilidades de sistema</h1>
          <p className="mt-1 text-sm text-gray-500">
            Registro de incidentes para referência ao fechar chamados do mesmo período.
          </p>
        </div>
        <Link
          href="/incidentes/novo"
          className="shrink-0 rounded-md bg-cvc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cvc-blue-dark"
        >
          Novo incidente
        </Link>
      </div>

      <form className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5" method="get">
        <input
          name="system"
          defaultValue={system}
          placeholder="Sistema"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        >
          <option value="">Todos os status</option>
          <option value="investigando">Em investigação</option>
          <option value="mitigado">Mitigado</option>
          <option value="resolvido">Resolvido</option>
        </select>
        <input
          type="date"
          name="from"
          defaultValue={from}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <input
          type="date"
          name="to"
          defaultValue={to}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Filtrar
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sistema</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Início</th>
              <th className="px-4 py-3 font-medium">Duração</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {incidents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum incidente encontrado.
                </td>
              </tr>
            )}
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{incident.system}</div>
                  <div className="text-gray-500">{incident.title}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyle[incident.status]}`}
                  >
                    {statusLabel[incident.status]}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {formatDateTime(incident.started_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {formatDuration(incident.started_at, incident.ended_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3 text-sm">
                    <Link href={`/incidentes/${incident.id}`} className="text-gray-700 hover:underline">
                      Editar
                    </Link>
                    <Link href={`/incidentes/${incident.id}/comunicado`} className="text-blue-700 hover:underline">
                      Comunicado
                    </Link>
                    <form action={deleteIncident.bind(null, incident.id)}>
                      <button type="submit" className="text-red-600 hover:underline">
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
