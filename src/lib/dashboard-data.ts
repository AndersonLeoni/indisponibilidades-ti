import { supabase } from './supabase'
import { minutesBetween, nowNaive } from './datetime'
import type { Incident, IncidentStatus } from './types'
import type { RootCause } from './root-cause-types'

export const PERIODS = [7, 30, 90] as const
export type Period = (typeof PERIODS)[number]

export function parsePeriod(value: string): Period {
  const n = Number(value)
  return (PERIODS as readonly number[]).includes(n) ? (n as Period) : 30
}

const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

function addMonths(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1 + delta, 1)).toISOString().slice(0, 7)
}

function percentChange(current: number, previous: number): number | null {
  return previous === 0 ? null : Math.round(((current - previous) / previous) * 100)
}

export type DailyPoint = { date: string; count: number; minutes: number }
export type SystemStat = { system: string; count: number; minutes: number }
export type MonthStat = { key: string; label: string; count: number }

export type DashboardData = {
  days: Period
  today: string
  now: string
  kpis: {
    incidents: number
    incidentsDelta: number | null
    open: number
    downtimeMinutes: number
    downtimeDelta: number | null
    mttrMinutes: number | null
    rootCausesFixed: number | null
    rootCausesPending: number | null
  }
  daily: DailyPoint[]
  byStatus: Record<IncidentStatus, number>
  bySystem: SystemStat[]
  topDowntime: SystemStat[]
  monthly: MonthStat[]
  recent: Incident[]
  open: Incident[]
  recentRootCauses: RootCause[] | null
}

export async function getDashboardData(days: Period): Promise<DashboardData> {
  const now = nowNaive()
  const today = now.slice(0, 10)
  const periodStart = addDays(today, -(days - 1))
  const previousStart = addDays(periodStart, -days)
  const currentMonth = today.slice(0, 7)
  const monthsStart = `${addMonths(currentMonth, -5)}-01`
  const since = previousStart < monthsStart ? previousStart : monthsStart

  const [incidentsRes, openRes, rootCausesRes] = await Promise.all([
    supabase.from('incidents').select('*').gte('started_at', since).order('started_at', { ascending: false }),
    supabase.from('incidents').select('*').is('ended_at', null).order('started_at', { ascending: true }),
    supabase.from('root_causes').select('*').order('occurred_at', { ascending: false }),
  ])
  if (incidentsRes.error) throw incidentsRes.error
  if (openRes.error) throw openRes.error

  const incidents = incidentsRes.data as Incident[]
  const open = openRes.data as Incident[]
  // A tabela de causa raiz pode ainda não existir; o dashboard segue sem esses números.
  const rootCauses = rootCausesRes.error ? null : (rootCausesRes.data as RootCause[])

  const minutesOf = (incident: Incident) => minutesBetween(incident.started_at, incident.ended_at ?? now)
  const dayOf = (incident: Incident) => incident.started_at.slice(0, 10)

  const inPeriod = incidents.filter((i) => dayOf(i) >= periodStart && dayOf(i) <= today)
  const inPrevious = incidents.filter((i) => dayOf(i) >= previousStart && dayOf(i) < periodStart)

  const daily: DailyPoint[] = Array.from({ length: days }, (_, k) => ({
    date: addDays(periodStart, k),
    count: 0,
    minutes: 0,
  }))
  const dailyIndex = new Map(daily.map((point, k) => [point.date, k]))
  for (const incident of inPeriod) {
    const point = daily[dailyIndex.get(dayOf(incident)) ?? -1]
    if (!point) continue
    point.count += 1
    point.minutes += minutesOf(incident)
  }

  const byStatus: Record<IncidentStatus, number> = { investigando: 0, mitigado: 0, resolvido: 0 }
  const systems = new Map<string, SystemStat>()
  for (const incident of inPeriod) {
    byStatus[incident.status] += 1
    const key = incident.system.trim().toLowerCase()
    const stat = systems.get(key) ?? { system: incident.system.trim(), count: 0, minutes: 0 }
    stat.count += 1
    stat.minutes += minutesOf(incident)
    systems.set(key, stat)
  }
  const bySystem = [...systems.values()].sort((a, b) => b.count - a.count || b.minutes - a.minutes)
  const topDowntime = [...systems.values()].sort((a, b) => b.minutes - a.minutes).slice(0, 5)

  const monthly: MonthStat[] = Array.from({ length: 6 }, (_, k) => {
    const key = addMonths(currentMonth, k - 5)
    return { key, label: MONTH_LABELS[Number(key.slice(5, 7)) - 1], count: 0 }
  })
  for (const incident of incidents) {
    const month = monthly.find((m) => m.key === incident.started_at.slice(0, 7))
    if (month) month.count += 1
  }

  const downtimeMinutes = inPeriod.reduce((sum, i) => sum + minutesOf(i), 0)
  const previousDowntime = inPrevious.reduce((sum, i) => sum + minutesOf(i), 0)
  const resolved = inPeriod.filter((i) => i.ended_at)
  const mttrMinutes = resolved.length
    ? Math.round(resolved.reduce((sum, i) => sum + minutesOf(i), 0) / resolved.length)
    : null

  const rootCausesFixed = rootCauses ? rootCauses.filter((r) => r.status === 'corrigida').length : null

  return {
    days,
    today,
    now,
    kpis: {
      incidents: inPeriod.length,
      incidentsDelta: percentChange(inPeriod.length, inPrevious.length),
      open: open.length,
      downtimeMinutes,
      downtimeDelta: percentChange(downtimeMinutes, previousDowntime),
      mttrMinutes,
      rootCausesFixed,
      rootCausesPending: rootCauses && rootCausesFixed !== null ? rootCauses.length - rootCausesFixed : null,
    },
    daily,
    byStatus,
    bySystem,
    topDowntime,
    monthly,
    recent: incidents.slice(0, 6),
    open,
    recentRootCauses: rootCauses ? rootCauses.slice(0, 5) : null,
  }
}
