create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin','teacher','student');
create type public.access_status as enum ('active','blocked','expired');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'student',
  access_status public.access_status not null default 'active',
  course text,
  access_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.questions (
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

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option text,
  is_correct boolean not null,
  response_time_seconds integer,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;

create policy "profiles read own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "attempts read own"
on public.attempts for select
to authenticated
using (auth.uid() = user_id);

create policy "attempts insert own"
on public.attempts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "questions read authenticated"
on public.questions for select
to authenticated
using (is_active = true);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "admins manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage questions"
on public.questions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read attempts"
on public.attempts for select
to authenticated
using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
