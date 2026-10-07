create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('admin','teacher','student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.access_status as enum ('active','blocked','expired');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'student',
  access_status public.access_status not null default 'active',
  course text,
  access_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  area text not null check (area in ('CL','RI','MT')),
  topic_code text not null,
  topic_name text not null,
  difficulty smallint not null check (difficulty between 1 and 3),
  prompt text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text,
  correct_option text not null check (correct_option in ('A','B','C','D')),
  explanation text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option text,
  is_correct boolean not null,
  response_time_seconds integer check (response_time_seconds is null or response_time_seconds >= 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;

grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant select on public.questions to authenticated;
grant select, insert on public.attempts to authenticated;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and access_status = 'active'
      and (access_expires_at is null or access_expires_at > now())
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create policy "profiles read own"
on public.profiles for select to authenticated
using ((select auth.uid()) = id or (select private.is_admin()));

create policy "profiles admins update"
on public.profiles for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "questions read authenticated"
on public.questions for select to authenticated
using (
  is_active = true
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.access_status = 'active'
      and (p.access_expires_at is null or p.access_expires_at > now())
  )
);

create policy "questions admins insert"
on public.questions for insert to authenticated
with check ((select private.is_admin()));

create policy "questions admins update"
on public.questions for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "questions admins delete"
on public.questions for delete to authenticated
using ((select private.is_admin()));

create policy "attempts read own"
on public.attempts for select to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()));

create policy "attempts insert own"
on public.attempts for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.access_status = 'active'
      and (p.access_expires_at is null or p.access_expires_at > now())
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''),'@',1), 'Usuario')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
