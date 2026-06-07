create table public.habit_logs (
  id               uuid          primary key default gen_random_uuid(),
  habit_id         uuid          not null references public.habits(id) on delete cascade,
  user_id          uuid          not null references public.profiles(id) on delete cascade,
  logged_date      date          not null,
  completed_value  numeric(10,2) not null default 1 check (completed_value >= 0),
  note             text          check (char_length(note) <= 500),
  created_at       timestamptz   not null default now(),
  updated_at       timestamptz   not null default now(),
  constraint habit_logs_unique_per_day unique (habit_id, logged_date)
);
create trigger habit_logs_updated_at before update on public.habit_logs for each row execute function public.set_updated_at();
