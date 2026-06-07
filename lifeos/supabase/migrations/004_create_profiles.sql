create table public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text        not null,
  full_name  text,
  timezone   text        not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
