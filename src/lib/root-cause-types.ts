export type RootCauseStatus = 'em_analise' | 'causa_identificada' | 'corrigida'

export type RootCause = {
  id: string
  system: string
  title: string
  occurred_at: string
  status: RootCauseStatus
  problem: string
  root_cause: string
  correction: string
  ticket_ref: string
  incident_id: string | null
  created_at: string
  updated_at: string
}

export type RootCauseInput = Omit<RootCause, 'id' | 'created_at' | 'updated_at'>

export const rootCauseStatusLabel: Record<RootCauseStatus, string> = {
  em_analise: 'Em análise',
  causa_identificada: 'Causa identificada',
  corrigida: 'Corrigida',
}

export const rootCauseStatusStyle: Record<RootCauseStatus, string> = {
  em_analise: 'bg-amber-100 text-amber-800',
  causa_identificada: 'bg-blue-100 text-blue-800',
  corrigida: 'bg-green-100 text-green-800',
}
