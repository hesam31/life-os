create table public.tasks (
  id           uuid          primary key default gen_random_uuid(),
  user_id      uuid          not null references public.profiles(id) on delete cascade,
  goal_id      uuid          references public.goals(id) on delete set null,
  title        text          not null check (char_length(title) between 1 and 200),
  description  text          check (char_length(description) <= 2000),
  status       task_status   not null default 'todo',
  priority     task_priority not null default 'medium',
  due_date     date,
  completed_at timestamptz,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now(),
  constraint completed_at_consistency check (
    (status = 'done' and completed_at is not null) or (status != 'done' and completed_at is null)
  )
);

create or replace function public.handle_task_status_change()
returns trigger as $$
begin
  if new.status = 'done' and old.status != 'done' then new.completed_at = now();
  elsif new.status != 'done' and old.status = 'done' then new.completed_at = null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger tasks_status_change before update of status on public.tasks for each row execute function public.handle_task_status_change();
create trigger tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();
