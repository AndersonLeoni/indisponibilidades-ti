import Link from 'next/link'
import { getDashboardData, parsePeriod, PERIODS, type DashboardData } from '@/lib/dashboard-data'
import { formatDate, formatDateTime, formatDuration, formatMinutes, minutesBetween } from '@/lib/datetime'
import { incidentStatusLabel, incidentStatusStyle, type IncidentStatus } from '@/lib/types'
import { rootCauseStatusLabel, rootCauseStatusStyle } from '@/lib/root-cause-types'
import { Card } from '@/app/components/card'
import { Icon } from '@/app/components/icons'
import { KpiCard } from '@/app/components/kpi-card'
import { HBars, MonthlyBars } from '@/app/components/bars'
import { TimeSeriesChart } from '@/app/components/time-series-chart'
import { DonutChart, type DonutSegment } from '@/app/components/donut-chart'

const GRADIENTS = {
  blue: 'linear-gradient(135deg, #0b3fa8, #2f7bea)',
  yellow: 'linear-gradient(135deg, #ffd500, #ffa400)',
  navy: 'linear-gradient(135deg, #061b4d, #1546a8)',
  sky: 'linear-gradient(135deg, #0077c2, #1aa6e8)',
  green: 'linear-gradient(135deg, #0b7a35, #1f9d4e)',
  orange: 'linear-gradient(135deg, #d9480f, #f76707)',
}

// Ordem fixa das cores categóricas (paleta validada); o 6º slot e "Outros" são neutros/auxiliares.
const CATEGORICAL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300']
const OTHERS_COLOR = '#898781'

const STATUS_VISUAL: Record<IncidentStatus, { color: string; icon: 'alert' | 'wave' | 'check' }> = {
  investigando: { color: '#d03b3b', icon: 'alert' },
  mitigado: { color: '#fab219', icon: 'wave' },
  resolvido: { color: '#0ca30c', icon: 'check' },
}

function param(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : ''
}

function deltaHint(delta: number | null, days: number): string {
  if (delta === null) return 'sem base de comparação'
  if (delta === 0) return `igual aos ${days} dias anteriores`
  return `${delta > 0 ? '▲' : '▼'} ${Math.abs(delta)}% vs ${days} dias anteriores`
}

function shortDate(date: string): string {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

function systemSegments(data: DashboardData): DonutSegment[] {
  const top = data.bySystem.slice(0, 5)
  const rest = data.bySystem.slice(5).reduce((sum, s) => sum + s.count, 0)
  const segments = top.map((s, i) => ({ label: s.system, value: s.count, color: CATEGORICAL[i] }))
  if (rest > 0) segments.push({ label: 'Outros', value: rest, color: OTHERS_COLOR })
  return segments
}

export default async function DashboardPage(props: PageProps<'/'>) {
  const searchParams = await props.searchParams
  const days = parsePeriod(param(searchParams.dias))
  const data = await getDashboardData(days)
  const { kpis } = data

  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const statusTotal = data.byStatus.investigando + data.byStatus.mitigado + data.byStatus.resolvido

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-5 px-6 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cvc-navy">Dashboard</h1>
          <p className="mt-1 text-sm capitalize text-gray-500">{todayLabel}</p>
        </div>
        <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5" role="group" aria-label="Período">
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={p === 30 ? '/' : `/?dias=${p}`}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                p === days ? 'bg-cvc-blue text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p} dias
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Incidentes no período"
          value={String(kpis.incidents)}
          hint={deltaHint(kpis.incidentsDelta, days)}
          gradient={GRADIENTS.blue}
          icon="alert"
          spark={data.daily.map((d) => d.count)}
          delay={0}
        />
        <KpiCard
          label="Em andamento agora"
          value={String(kpis.open)}
          hint={kpis.open === 1 ? 'incidente aberto' : 'incidentes abertos'}
          gradient={GRADIENTS.yellow}
          darkText
          icon="pulse"
          delay={60}
        />
        <KpiCard
          label="Tempo indisponível"
          value={formatMinutes(kpis.downtimeMinutes)}
          hint={deltaHint(kpis.downtimeDelta, days)}
          gradient={GRADIENTS.navy}
          icon="clock"
          spark={data.daily.map((d) => d.minutes)}
          delay={120}
        />
        <KpiCard
          label="Tempo médio de resolução"
          value={kpis.mttrMinutes === null ? '—' : formatMinutes(kpis.mttrMinutes)}
          hint="incidentes encerrados no período"
          gradient={GRADIENTS.sky}
          icon="timer"
          delay={180}
        />
        <KpiCard
          label="Causas raiz corrigidas"
          value={kpis.rootCausesFixed === null ? '—' : String(kpis.rootCausesFixed)}
          hint="total registrado"
          gradient={GRADIENTS.green}
          icon="checkCircle"
          delay={240}
        />
        <KpiCard
          label="Causas raiz em aberto"
          value={kpis.rootCausesPending === null ? '—' : String(kpis.rootCausesPending)}
          hint="em análise ou identificadas"
          gradient={GRADIENTS.orange}
          icon="search"
          delay={300}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <Card
          title="Incidentes por dia"
          subtitle={`Últimos ${days} dias`}
          className="xl:col-span-6"
        >
          <TimeSeriesChart
            points={data.daily.map((d) => ({
              label: formatDate(d.date),
              short: shortDate(d.date),
              value: d.count,
            }))}
            unit={kpis.incidents === 1 ? 'incidente' : 'incidentes'}
            ariaLabel={`Incidentes por dia nos últimos ${days} dias, total de ${kpis.incidents}`}
          />
          <details className="mt-3 text-xs text-gray-500">
            <summary className="cursor-pointer select-none font-medium text-cvc-blue">Ver dados em tabela</summary>
            <div className="mt-2 max-h-48 overflow-auto rounded-lg ring-1 ring-black/5">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Dia</th>
                    <th className="px-3 py-2 font-medium">Incidentes</th>
                    <th className="px-3 py-2 font-medium">Tempo indisponível</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {data.daily.map((d) => (
                    <tr key={d.date}>
                      <td className="px-3 py-1.5">{formatDate(d.date)}</td>
                      <td className="px-3 py-1.5 tabular-nums">{d.count}</td>
                      <td className="px-3 py-1.5 tabular-nums">{d.minutes ? formatMinutes(d.minutes) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </Card>

        <Card title="Incidentes por sistema" subtitle="Participação no período" className="xl:col-span-3">
          <DonutChart segments={systemSegments(data)} totalLabel="incidentes" />
        </Card>

        <Card title="Situação dos incidentes" subtitle="Status no período" className="xl:col-span-3">
          <ul className="space-y-4">
            {(Object.keys(STATUS_VISUAL) as IncidentStatus[]).map((status, k) => {
              const visual = STATUS_VISUAL[status]
              const count = data.byStatus[status]
              const share = statusTotal === 0 ? 0 : (count / statusTotal) * 100
              return (
                <li key={status}>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-white"
                      style={{ background: visual.color, color: status === 'mitigado' ? '#0b0b0b' : '#fff' }}
                    >
                      <Icon name={visual.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1 text-gray-700">{incidentStatusLabel[status]}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                    <span className="w-10 text-right text-xs text-gray-500">{Math.round(share)}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#eef1f6]">
                    <div
                      className="animate-grow-x h-2 rounded-full"
                      style={{ width: `${share}%`, background: visual.color, animationDelay: `${k * 80}ms` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <Card title="Sistemas com mais indisponibilidade" subtitle="Tempo total no período (top 5)">
          <HBars
            items={data.topDowntime.map((s) => ({
              label: s.system,
              value: s.minutes,
              display: formatMinutes(s.minutes),
            }))}
          />
        </Card>

        <Card
          title="Incidentes em andamento"
          subtitle={`${data.open.length} aberto(s) agora`}
          tone={data.open.length > 0 ? 'alert' : 'default'}
          action={
            <span className={`grid h-8 w-8 place-items-center rounded-lg ${data.open.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
              <Icon name={data.open.length > 0 ? 'bell' : 'checkCircle'} className="h-4 w-4" />
            </span>
          }
        >
          {data.open.length === 0 ? (
            <p className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-3 text-sm text-green-800">
              <Icon name="checkCircle" className="h-4 w-4 shrink-0" />
              Nenhum incidente em andamento.
            </p>
          ) : (
            <ul className="space-y-2">
              {data.open.slice(0, 5).map((incident) => (
                <li key={incident.id}>
                  <Link
                    href={`/incidentes/${incident.id}`}
                    className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm ring-1 ring-red-100 transition hover:ring-red-300"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-gray-900">{incident.system}</span>
                      <span className="block truncate text-xs text-gray-500">{incident.title}</span>
                    </span>
                    <span className="text-right text-xs">
                      <span className={`rounded-full px-2 py-0.5 font-medium ${incidentStatusStyle[incident.status]}`}>
                        {incidentStatusLabel[incident.status]}
                      </span>
                      <span className="mt-1 block text-gray-500">
                        há {formatMinutes(minutesBetween(incident.started_at, data.now))}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Causas raiz recentes"
          subtitle="Histórico de problemas analisados"
          action={
            <Link href="/causa-raiz" className="text-xs font-medium text-cvc-blue hover:underline">
              Ver todas →
            </Link>
          }
        >
          {data.recentRootCauses === null ? (
            <p className="rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-800">
              A tabela de causa raiz ainda não foi criada no banco. Execute o arquivo supabase/root-causes.sql no SQL
              Editor do Supabase.
            </p>
          ) : data.recentRootCauses.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma causa raiz registrada ainda.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.recentRootCauses.map((item) => (
                <li key={item.id}>
                  <Link href={`/causa-raiz/${item.id}`} className="flex items-center gap-3 py-2.5 text-sm hover:bg-gray-50">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-gray-900">
                        {item.system} — {item.title}
                      </span>
                      <span className="block text-xs text-gray-500">{formatDate(item.occurred_at)}</span>
                    </span>
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${rootCauseStatusStyle[item.status]}`}
                    >
                      {rootCauseStatusLabel[item.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <Card title="Incidentes por mês" subtitle="Últimos 6 meses" className="xl:col-span-4">
          <MonthlyBars items={data.monthly} />
        </Card>

        <Card
          title="Últimos incidentes"
          className="xl:col-span-8"
          action={
            <Link href="/incidentes" className="text-xs font-medium text-cvc-blue hover:underline">
              Ver todos →
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="pb-2 font-medium">Sistema</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Início</th>
                  <th className="pb-2 font-medium">Duração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      Nenhum incidente registrado.
                    </td>
                  </tr>
                )}
                {data.recent.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="py-2.5 pr-3">
                      <Link href={`/incidentes/${incident.id}`} className="block">
                        <span className="font-medium text-gray-900">{incident.system}</span>
                        <span className="block text-xs text-gray-500">{incident.title}</span>
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${incidentStatusStyle[incident.status]}`}
                      >
                        {incidentStatusLabel[incident.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-3 text-gray-700">{formatDateTime(incident.started_at)}</td>
                    <td className="whitespace-nowrap py-2.5 text-gray-700">
                      {formatDuration(incident.started_at, incident.ended_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  )
}
