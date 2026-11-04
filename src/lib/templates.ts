import { formatDateTime, formatDuration } from './datetime'
import type { Incident } from './types'

const statusLabel: Record<Incident['status'], string> = {
  investigando: 'Em investigação',
  mitigado: 'Mitigado',
  resolvido: 'Resolvido',
}

export type ComunicadoTemplate = {
  id: string
  label: string
  build: (incident: Incident) => string
}

export const comunicadoTemplates: ComunicadoTemplate[] = [
  {
    id: 'em-andamento',
    label: 'Indisponibilidade em andamento',
    build: (incident) => `⚠️ Comunicado de Indisponibilidade

Sistema: ${incident.system}
Status: ${statusLabel[incident.status]}
Início do ocorrido: ${formatDateTime(incident.started_at)}

Descrição: ${incident.description}

Equipe de TI já está atuando na correção. Novas atualizações serão enviadas em breve.`,
  },
  {
    id: 'resolvida',
    label: 'Indisponibilidade resolvida',
    build: (incident) => `✅ Comunicado de Normalização

Sistema: ${incident.system}
Status: Resolvido
Início: ${formatDateTime(incident.started_at)}
Término: ${formatDateTime(incident.ended_at)}
Duração: ${formatDuration(incident.started_at, incident.ended_at)}

Descrição: ${incident.description}
Correção aplicada: ${incident.correction || 'não informada'}

O sistema já está operando normalmente.`,
  },
  {
    id: 'instabilidade-parcial',
    label: 'Instabilidade parcial',
    build: (incident) => `🟡 Comunicado de Instabilidade Parcial

Sistema: ${incident.system}
Status: ${statusLabel[incident.status]}
Início: ${formatDateTime(incident.started_at)}

Descrição: ${incident.description}

O sistema pode apresentar lentidão ou falhas intermitentes. Equipe de TI está monitorando a situação.`,
  },
]
