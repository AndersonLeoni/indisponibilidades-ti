// Datas são guardadas como horário "ingênuo" (sem fuso), pois o uso é só no
// horário local da equipe. Formatação é feita por manipulação de string, não
// por conversão de timezone, para evitar deslocamentos entre servidor/navegador.

export function toInputValue(value: string | null): string {
  if (!value) return ''
  return value.slice(0, 16)
}

export function toStoredValue(inputValue: string): string {
  return inputValue.length === 16 ? `${inputValue}:00` : inputValue
}

export function formatDateTime(value: string | null): string {
  if (!value) return 'em andamento'
  const [datePart, timePart] = value.split('T')
  const [year, month, day] = datePart.split('-')
  const [hour, minute] = timePart.split(':')
  return `${day}/${month}/${year} ${hour}:${minute}`
}

// "Agora" no mesmo formato ingênuo (sem fuso) usado nos registros, sempre em
// horário de Brasília, mesmo quando o servidor roda em UTC (Vercel).
export function nowNaive(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T')
}

export function minutesBetween(start: string, end: string): number {
  return Math.max(0, Math.round((new Date(`${end}Z`).getTime() - new Date(`${start}Z`).getTime()) / 60000))
}

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60)
  const rest = total % 60
  if (hours === 0) return `${rest}min`
  if (hours >= 100) return `${hours}h`
  return `${hours}h${String(rest).padStart(2, '0')}min`
}

export function formatDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function diffMinutes(start: string, end: string | null): number | null {
  if (!end) return null
  const ms = new Date(`${end}Z`).getTime() - new Date(`${start}Z`).getTime()
  return Math.round(ms / 60000)
}

export function formatDuration(start: string, end: string | null): string {
  const minutes = diffMinutes(start, end)
  if (minutes === null) return 'em andamento'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours > 0 ? `${hours}h${String(rest).padStart(2, '0')}min` : `${rest}min`
}
