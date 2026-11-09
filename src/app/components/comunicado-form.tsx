'use client'

import { useState, useTransition } from 'react'
import { sendTeamsMessage } from '@/lib/actions'

type Template = { id: string; label: string; text: string }

export function ComunicadoForm({ templates }: { templates: Template[] }) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? '')
  const [text, setText] = useState(templates[0]?.text ?? '')
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  function selectTemplate(id: string) {
    const template = templates.find((item) => item.id === id)
    setSelectedId(id)
    setText(template?.text ?? '')
    setFeedback(null)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setFeedback('Mensagem copiada para a área de transferência.')
  }

  function handleSendTeams() {
    setFeedback(null)
    startTransition(async () => {
      try {
        await sendTeamsMessage(text)
        setFeedback('Mensagem enviada para o Teams.')
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Falha ao enviar para o Teams.')
      }
    })
  }

  return (
    <div className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de comunicado</label>
        <select
          value={selectedId}
          onChange={(event) => selectTemplate(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mensagem (editável antes de enviar)</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSendTeams}
          disabled={isPending}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? 'Enviando...' : 'Enviar para o Teams'}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Copiar mensagem
        </button>
        {feedback && <span className="text-sm text-gray-500">{feedback}</span>}
      </div>
    </div>
  )
}
