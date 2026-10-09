-- Simulador de Evaluación Académica
-- Delta de esquema para evaluaciones aleatorias por materia, tema y nivel.

alter table public.simulation_sessions
  drop constraint if exists simulation_sessions_mode_check;

alter table public.simulation_sessions
  add constraint simulation_sessions_mode_check
  check (mode in ('quick','diagnostic','standard','intensive','math','advanced','subject','topic','mixed'));

alter table public.simulation_sessions
  add column if not exists subject_area text,
  add column if not exists topic_filter text,
  add column if not exists difficulty_filter smallint;

alter table public.profiles
  drop constraint if exists profiles_course_check;

alter table public.profiles
  add constraint profiles_course_check
  check (course is null or course in ('GENERAL','PRIMARIA','SECUNDARIA','BACHILLERATO'));

create index if not exists simulation_session_questions_question_idx
  on public.simulation_session_questions(question_id);

-- Producción define además:
-- public.subject_catalog()
-- public.start_evaluation(text, integer, integer, text)
-- Ambas funciones validan sesión autenticada y acceso activo antes de devolver contenido.
