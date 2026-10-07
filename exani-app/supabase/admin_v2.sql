-- Administrative V2 additions already applied to Supabase.
-- Keeps the repository aligned with the live database.

grant update on table public.profiles to authenticated;
grant insert, update, delete on table public.questions to authenticated;

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  drop constraint if exists profiles_course_check;

alter table public.profiles
  add constraint profiles_course_check
  check (course is null or course in ('EXANI I', 'EXANI II', 'AMBOS'));

create unique index if not exists profiles_email_unique_idx
  on public.profiles (lower(email))
  where email is not null;

create index if not exists questions_topic_difficulty_idx
  on public.questions(topic_code, difficulty)
  where is_active = true;

create index if not exists attempts_user_created_idx
  on public.attempts(user_id, created_at desc);

create index if not exists attempts_question_idx
  on public.attempts(question_id);

-- Production additionally defines the SECURITY DEFINER RPCs:
-- get_practice_questions
-- submit_question_answer
-- admin_dashboard_summary
-- admin_list_questions
-- admin_save_question
-- admin_set_question_active
--
-- They are applied as managed Supabase migrations and intentionally keep
-- answer keys out of the normal student question feed.
