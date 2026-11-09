import Link from 'next/link'
import { listRootCauses } from '@/lib/root-causes-data'
import { deleteRootCause } from '@/lib/root-cause-actions'
import { formatDate } from '@/lib/datetime'
import { rootCauseStatusLabel, rootCauseStatusStyle } from '@/lib/root-cause-types'

function param(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : ''
}

const inputClass =
  'rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none'

export default async function CausaRaizPage(props: PageProps<'/causa-raiz'>) {
  const searchParams = await props.searchParams
  const q = param(searchParams.q)
  const system = param(searchParams.system)
  const status = param(searchParams.status)

  const rootCauses = await listRootCauses({ q, system, status })

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cvc-navy">Causa raiz</h1>
          <p className="mt-1 text-sm text-gray-500">
            Histórico de problemas analisados e corrigidos, para consulta em ocorrências futuras.
          </p>
        </div>
        <Link
          href="/causa-raiz/novo"
          className="shrink-0 rounded-md bg-cvc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-cvc-blue-dark"
        >
          Nova causa raiz
        </Link>
      </div>

      <form className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" method="get">
        <input name="q" defaultValue={q} placeholder="Buscar em título, causa, correção..." className={inputClass} />
        <input name="system" defaultValue={system} placeholder="Sistema" className={inputClass} />
        <select name="status" defaultValue={status} className={inputClass}>
          <option value="">Todos os status</option>
          <option value="em_analise">Em análise</option>
          <option value="causa_identificada">Causa identificada</option>
          <option value="corrigida">Corrigida</option>
        </select>
        <button type="submit" className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
          Filtrar
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Problema</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ocorrência</th>
              <th className="px-4 py-3 font-medium">Chamado</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rootCauses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma causa raiz encontrada.
                </td>
              </tr>
            )}
            {rootCauses.map((item) => (
              <tr key={item.id} className="align-top hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {item.system} — {item.title}
                  </div>
                  {item.root_cause && (
                    <div className="mt-1 line-clamp-2 text-gray-500">Causa: {item.root_cause}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${rootCauseStatusStyle[item.status]}`}
                  >
                    {rootCauseStatusLabel[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{formatDate(item.occurred_at)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.ticket_ref || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/causa-raiz/${item.id}`} className="text-gray-700 hover:underline">
                      Editar
                    </Link>
                    <form action={deleteRootCause.bind(null, item.id)}>
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
