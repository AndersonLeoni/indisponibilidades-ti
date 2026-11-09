-- Execute no SQL Editor do Supabase (uma única vez) para criar a tabela da aba "Causa raiz".

create type root_cause_status as enum ('em_analise', 'causa_identificada', 'corrigida');

create table root_causes (
  id uuid primary key default gen_random_uuid(),
  system text not null,
  title text not null,
  occurred_at date not null,
  status root_cause_status not null default 'em_analise',
  problem text not null default '',
  root_cause text not null default '',
  correction text not null default '',
  ticket_ref text not null default '',
  incident_id uuid references incidents (id) on delete set null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create index root_causes_occurred_at_idx on root_causes (occurred_at desc);
