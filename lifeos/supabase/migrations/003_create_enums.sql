do $$ begin
  if not exists (select 1 from pg_type where typname = 'habit_frequency') then
    create type public.habit_frequency as enum ('daily','weekdays','weekends','custom');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'goal_status') then
    create type public.goal_status as enum ('active','completed','abandoned');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum ('todo','in_progress','done');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'task_priority') then
    create type public.task_priority as enum ('low','medium','high');
  end if;
end $$;