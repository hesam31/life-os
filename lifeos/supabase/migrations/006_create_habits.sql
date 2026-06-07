create table public.habits (
  id           uuid            primary key default gen_random_uuid(),
  user_id      uuid            not null references public.profiles(id) on delete cascade,
  goal_id      uuid            references public.goals(id) on delete set null,
  name         text            not null check (char_length(name) between 1 and 100),
  description  text,
  frequency    habit_frequency not null default 'daily',
  custom_days  boolean[],
  target_value numeric(10,2)   not null default 1,
  unit         text            not null default 'times' check (char_length(unit) <= 30),
  deleted_at   timestamptz,
  created_at   timestamptz     not null default now(),
  updated_at   timestamptz     not null default now(),
  constraint custom_days_required_when_custom check (frequency != 'custom' or custom_days is not null)
);
create trigger habits_updated_at before update on public.habits for each row execute function public.set_updated_at();
