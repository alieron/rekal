create extension if not exists pgcrypto;

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  note text not null default '',
  resource text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_topic_id_idx on notes(topic_id);
create index if not exists notes_created_at_idx on notes(created_at desc);
create index if not exists topics_created_at_idx on topics(created_at desc);
