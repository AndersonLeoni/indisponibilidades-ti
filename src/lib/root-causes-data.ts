import { supabase } from './supabase'
import type { RootCause } from './root-cause-types'

export type RootCauseFilters = {
  q?: string
  system?: string
  status?: string
}

export async function listRootCauses(filters: RootCauseFilters = {}): Promise<RootCause[]> {
  let query = supabase.from('root_causes').select('*').order('occurred_at', { ascending: false })

  if (filters.system) query = query.ilike('system', `%${filters.system}%`)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.q) {
    // vírgulas e parênteses quebram a sintaxe do filtro .or() do PostgREST
    const term = filters.q.replace(/[,()%]/g, ' ').trim()
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,problem.ilike.%${term}%,root_cause.ilike.%${term}%,correction.ilike.%${term}%,ticket_ref.ilike.%${term}%`,
      )
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data as RootCause[]
}

export async function getRootCause(id: string): Promise<RootCause> {
  const { data, error } = await supabase.from('root_causes').select('*').eq('id', id).single()
  if (error) throw error
  return data as RootCause
}
