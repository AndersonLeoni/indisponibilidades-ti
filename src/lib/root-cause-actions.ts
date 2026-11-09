'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from './supabase'
import type { RootCauseInput, RootCauseStatus } from './root-cause-types'

function parseForm(formData: FormData): RootCauseInput {
  const incidentId = String(formData.get('incident_id') ?? '')

  return {
    system: String(formData.get('system') ?? '').trim(),
    title: String(formData.get('title') ?? '').trim(),
    occurred_at: String(formData.get('occurred_at') ?? ''),
    status: String(formData.get('status') ?? 'em_analise') as RootCauseStatus,
    problem: String(formData.get('problem') ?? '').trim(),
    root_cause: String(formData.get('root_cause') ?? '').trim(),
    correction: String(formData.get('correction') ?? '').trim(),
    ticket_ref: String(formData.get('ticket_ref') ?? '').trim(),
    incident_id: incidentId || null,
  }
}

export async function createRootCause(formData: FormData) {
  const { error } = await supabase.from('root_causes').insert(parseForm(formData))
  if (error) throw new Error(error.message)

  revalidatePath('/causa-raiz')
  redirect('/causa-raiz')
}

export async function updateRootCause(id: string, formData: FormData) {
  const { error } = await supabase
    .from('root_causes')
    .update({ ...parseForm(formData), updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/causa-raiz')
  redirect('/causa-raiz')
}

export async function deleteRootCause(id: string) {
  const { error } = await supabase.from('root_causes').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/causa-raiz')
  redirect('/causa-raiz')
}
