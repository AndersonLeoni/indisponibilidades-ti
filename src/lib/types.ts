export type IncidentStatus = 'investigando' | 'mitigado' | 'resolvido'

export const incidentStatusLabel: Record<IncidentStatus, string> = {
  investigando: 'Em investigação',
  mitigado: 'Mitigado',
  resolvido: 'Resolvido',
}

export const incidentStatusStyle: Record<IncidentStatus, string> = {
  investigando: 'bg-amber-100 text-amber-800',
  mitigado: 'bg-blue-100 text-blue-800',
  resolvido: 'bg-green-100 text-green-800',
}

export type Incident = {
  id: string
  system: string
  title: string
  started_at: string
  ended_at: string | null
  status: IncidentStatus
  description: string
  correction: string
  created_at: string
  updated_at: string
}

export type IncidentInput = {
  system: string
  title: string
  started_at: string
  ended_at: string | null
  status: IncidentStatus
  description: string
  correction: string
}
