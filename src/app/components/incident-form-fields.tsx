import { toInputValue } from '@/lib/datetime'
import type { Incident } from '@/lib/types'

export function IncidentFormFields({ incident }: { incident?: Incident }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sistema afetado</label>
        <input
          name="system"
          required
          defaultValue={incident?.system}
          placeholder="Ex.: Omnibees, Booking, PABX"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Título curto</label>
        <input
          name="title"
          required
          defaultValue={incident?.title}
          placeholder="Resumo do incidente"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Início</label>
          <input
            type="datetime-local"
            name="started_at"
            required
            defaultValue={toInputValue(incident?.started_at ?? null)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fim (vazio = em andamento)</label>
          <input
            type="datetime-local"
            name="ended_at"
            defaultValue={toInputValue(incident?.ended_at ?? null)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          defaultValue={incident?.status ?? 'investigando'}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        >
          <option value="investigando">Em investigação</option>
          <option value="mitigado">Mitigado</option>
          <option value="resolvido">Resolvido</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={incident?.description}
          placeholder="O que aconteceu"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Correção</label>
        <textarea
          name="correction"
          rows={3}
          defaultValue={incident?.correction}
          placeholder="Causa raiz / correção aplicada"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
    </>
  )
}
