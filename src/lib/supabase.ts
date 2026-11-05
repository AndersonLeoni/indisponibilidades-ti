import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined

// Cliente usado apenas no servidor (Server Components / Server Actions).
// Usa a service role key, que tem acesso total ao banco — nunca importar
// este módulo em um Client Component. Criado sob demanda (não no load do
// módulo) para não quebrar o build quando as variáveis ainda não existem.
function getSupabase(): SupabaseClient {
  if (client) return client

  // SUPABASE_SECRET_KEY / SUPABASE_URL: nomes criados automaticamente pela
  // integração Supabase x Vercel. SUPABASE_SERVICE_ROLE_KEY: nome usado no
  // .env.local local. Aceita qualquer um dos dois para não depender de uma
  // variável duplicada.
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SECRET_KEY) precisam estar definidos (.env.local em dev, variáveis de ambiente na Vercel em produção).',
    )
  }

  client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
  return client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver)
  },
})
