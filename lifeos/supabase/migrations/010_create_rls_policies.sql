alter table public.profiles   enable row level security;
alter table public.habits     enable row level security;
alter table public.habit_logs enable row level security;
alter table public.tasks      enable row level security;
alter table public.goals      enable row level security;

create policy "profiles: view own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "habits: view own"   on public.habits for select using (auth.uid() = user_id);
create policy "habits: insert own" on public.habits for insert with check (auth.uid() = user_id);
create policy "habits: update own" on public.habits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits: delete own" on public.habits for delete using (auth.uid() = user_id);

create policy "habit_logs: view own"   on public.habit_logs for select using (auth.uid() = user_id);
create policy "habit_logs: insert own" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "habit_logs: update own" on public.habit_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habit_logs: delete own" on public.habit_logs for delete using (auth.uid() = user_id);

create policy "tasks: view own"   on public.tasks for select using (auth.uid() = user_id);
create policy "tasks: insert own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks: update own" on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks: delete own" on public.tasks for delete using (auth.uid() = user_id);

create policy "goals: view own"   on public.goals for select using (auth.uid() = user_id);
create policy "goals: insert own" on public.goals for insert with check (auth.uid() = user_id);
create policy "goals: update own" on public.goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals: delete own" on public.goals for delete using (auth.uid() = user_id);
