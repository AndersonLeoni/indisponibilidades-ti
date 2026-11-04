import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getIncident } from '@/lib/incidents-data'
import { comunicadoTemplates } from '@/lib/templates'
import { ComunicadoForm } from '@/app/components/comunicado-form'

export default async function ComunicadoPage(props: PageProps<'/[id]/comunicado'>) {
  const { id } = await props.params
  const incident = await getIncident(id).catch(() => null)
  if (!incident) notFound()

  const templates = comunicadoTemplates.map((template) => ({
    id: template.id,
    label: template.label,
    text: template.build(incident),
  }))

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gerar comunicado</h1>
          <p className="mt-1 text-sm text-gray-500">
            {incident.system} — {incident.title}
          </p>
        </div>
        <Link href={`/${incident.id}`} className="text-sm text-gray-600 hover:underline">
          ← Voltar ao incidente
        </Link>
      </div>

      <ComunicadoForm templates={templates} />
    </main>
  )
}
