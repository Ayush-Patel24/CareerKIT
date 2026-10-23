-- ========================================================
-- CareerKit Database Schema & Row Level Security Policies
-- ========================================================

-- Enable pgcrypto for UUID generation if not already active
create extension if not exists "pgcrypto";

-- --------------------------------------------------------
-- 1. Profiles Table
-- --------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles RLS Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to automatically create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, email, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    now(),
    now()
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------
-- 2. Resumes Table
-- --------------------------------------------------------
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Resume',
  template_id text not null default 'classic',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create index on user_id and updated_at for fast queries
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resumes_updated_at on public.resumes(updated_at desc);

-- Enable RLS on resumes
alter table public.resumes enable row level security;

-- Resumes RLS Policies
create policy "Users can select their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- --------------------------------------------------------
-- 3. Analyses Table
-- --------------------------------------------------------
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  resume_title text default 'Uploaded Resume',
  resume_text text,
  job_description text,
  score integer default 0,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Create index on user_id and created_at
create index if not exists idx_analyses_user_id on public.analyses(user_id);
create index if not exists idx_analyses_created_at on public.analyses(created_at desc);

-- Enable RLS on analyses
alter table public.analyses enable row level security;

-- Analyses RLS Policies
create policy "Users can view their own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);
