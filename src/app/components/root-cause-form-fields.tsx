import { formatDateTime } from '@/lib/datetime'
import { rootCauseStatusLabel, type RootCause, type RootCauseStatus } from '@/lib/root-cause-types'
import type { Incident } from '@/lib/types'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none'

export function RootCauseFormFields({
  rootCause,
  incidents,
}: {
  rootCause?: RootCause
  incidents: Incident[]
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sistema afetado</label>
          <input
            name="system"
            required
            defaultValue={rootCause?.system}
            placeholder="Ex.: Omnibees, Booking, PABX"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data da ocorrência</label>
          <input
            type="date"
            name="occurred_at"
            required
            defaultValue={rootCause?.occurred_at}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Título curto</label>
        <input
          name="title"
          required
          defaultValue={rootCause?.title}
          placeholder="Resumo do problema"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" defaultValue={rootCause?.status ?? 'em_analise'} className={inputClass}>
            {(Object.keys(rootCauseStatusLabel) as RootCauseStatus[]).map((status) => (
              <option key={status} value={status}>
                {rootCauseStatusLabel[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chamado / GDIS (opcional)</label>
          <input
            name="ticket_ref"
            defaultValue={rootCause?.ticket_ref}
            placeholder="Ex.: GDIS-1234"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Incidente relacionado (opcional)</label>
        <select name="incident_id" defaultValue={rootCause?.incident_id ?? ''} className={inputClass}>
          <option value="">Nenhum</option>
          {incidents.map((incident) => (
            <option key={incident.id} value={incident.id}>
              {formatDateTime(incident.started_at)} — {incident.system}: {incident.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Problema / sintoma</label>
        <textarea
          name="problem"
          rows={3}
          defaultValue={rootCause?.problem}
          placeholder="O que foi observado"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Causa raiz</label>
        <textarea
          name="root_cause"
          rows={4}
          defaultValue={rootCause?.root_cause}
          placeholder="Por que aconteceu"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Correção aplicada</label>
        <textarea
          name="correction"
          rows={3}
          defaultValue={rootCause?.correction}
          placeholder="O que foi feito para corrigir / evitar recorrência"
          className={inputClass}
        />
      </div>
    </>
  )
}
