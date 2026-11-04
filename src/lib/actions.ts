'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from './supabase'
import { toStoredValue } from './datetime'
import type { IncidentInput, IncidentStatus } from './types'

function parseIncidentForm(formData: FormData): IncidentInput {
  const startedAtRaw = String(formData.get('started_at') ?? '')
  const endedAtRaw = String(formData.get('ended_at') ?? '')

  return {
    system: String(formData.get('system') ?? '').trim(),
    title: String(formData.get('title') ?? '').trim(),
    started_at: toStoredValue(startedAtRaw),
    ended_at: endedAtRaw ? toStoredValue(endedAtRaw) : null,
    status: String(formData.get('status') ?? 'investigando') as IncidentStatus,
    description: String(formData.get('description') ?? '').trim(),
    correction: String(formData.get('correction') ?? '').trim(),
  }
}

export async function createIncident(formData: FormData) {
  const incident = parseIncidentForm(formData)
  const { error } = await supabase.from('incidents').insert(incident)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  redirect('/')
}

export async function updateIncident(id: string, formData: FormData) {
  const incident = parseIncidentForm(formData)
  const { error } = await supabase.from('incidents').update(incident).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath(`/${id}`)
  redirect(`/${id}`)
}

export async function deleteIncident(id: string) {
  const { error } = await supabase.from('incidents').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  redirect('/')
}

export async function sendTeamsMessage(text: string) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('TEAMS_WEBHOOK_URL não configurado nas variáveis de ambiente.')
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error(`Falha ao enviar para o Teams (status ${response.status}).`)
  }
}
