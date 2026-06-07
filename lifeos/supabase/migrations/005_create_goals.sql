create table public.goals (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  title       text        not null check (char_length(title) between 1 and 150),
  description text        check (char_length(description) <= 1000),
  status      goal_status not null default 'active',
  target_date date        not null,
  deleted_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger goals_updated_at before update on public.goals for each row execute function public.set_updated_at();
