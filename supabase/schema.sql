-- Execute isso no SQL Editor do Supabase (painel web do projeto),
-- uma única vez, para criar a tabela usada pelo app.

create type incident_status as enum ('investigando', 'mitigado', 'resolvido');

create table incidents (
  id uuid primary key default gen_random_uuid(),
  system text not null,
  title text not null default '',
  started_at timestamp not null,
  ended_at timestamp,
  status incident_status not null default 'investigando',
  description text not null default '',
  correction text not null default '',
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create index incidents_started_at_idx on incidents (started_at desc);
