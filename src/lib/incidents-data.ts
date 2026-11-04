import { supabase } from './supabase'
import type { Incident } from './types'

export type IncidentFilters = {
  system?: string
  status?: string
  from?: string
  to?: string
}

export async function listIncidents(filters: IncidentFilters = {}): Promise<Incident[]> {
  let query = supabase.from('incidents').select('*').order('started_at', { ascending: false })

  if (filters.system) query = query.ilike('system', `%${filters.system}%`)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.from) query = query.gte('started_at', filters.from)
  if (filters.to) query = query.lte('started_at', filters.to)

  const { data, error } = await query
  if (error) throw error
  return data as Incident[]
}

export async function getIncident(id: string): Promise<Incident> {
  const { data, error } = await supabase.from('incidents').select('*').eq('id', id).single()
  if (error) throw error
  return data as Incident
}
