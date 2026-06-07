# LifeOS

Personal productivity app — habits, tasks, goals, dashboard.

## Stack
Next.js 14 · TypeScript · Tailwind CSS · Supabase · React Query · Zustand · Zod

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Create Supabase project
- Go to https://supabase.com → New project
- Copy your Project URL and anon key

### 3. Configure environment
```bash
cp .env.example .env.local
# Fill in your Supabase URL, anon key, service role key, and app URL
```

### 4. Run migrations
In Supabase dashboard → SQL Editor, run each file in order:
supabase/migrations/001 through 010

### 5. Start dev server
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure
src/
  app/          → Next.js App Router pages + API routes
  features/     → auth | habits | tasks | goals | dashboard
  components/   → Shared UI (ui/ layout/ feedback/)
  services/     → Supabase data layer
  lib/          → Query client, Zustand store, API helpers
  types/        → TypeScript types (DB + domain + API)
  utils/        → Pure utility functions
  hooks/        → Shared React hooks

supabase/migrations/  → SQL schema files
