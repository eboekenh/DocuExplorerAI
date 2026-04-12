-- Supabase SQL Editor'de çalıştır: https://supabase.com/dashboard → SQL Editor

-- 1. Sessions tablosu
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  document_title text default '',
  paragraphs jsonb default '[]'::jsonb,
  annotations jsonb default '{}'::jsonb,
  lang text default 'tr',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Row Level Security: Sadece kendi verini görebilirsin
alter table public.sessions enable row level security;

create policy "Users can view own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on public.sessions for delete
  using (auth.uid() = user_id);

-- 3. Index for fast lookup
create index sessions_user_id_idx on public.sessions(user_id);
