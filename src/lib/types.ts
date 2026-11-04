export type IncidentStatus = 'investigando' | 'mitigado' | 'resolvido'

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
