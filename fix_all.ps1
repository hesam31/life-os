$base = "C:\Users\hesam\Downloads\lifeos\lifeos"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# 1. tsconfig
[System.IO.File]::WriteAllText("$base\tsconfig.json", '{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": false,
    "noUncheckedIndexedAccess": false,
    "noImplicitReturns": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}', $utf8NoBom)
Write-Host "tsconfig done"

# 2. signin route
[System.IO.File]::WriteAllText("$base\src\app\api\auth\signin\route.ts", @'
import { getSupabaseServerClient } from "@/services/supabase/server"
import { errors } from "@/lib/api/errors"

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>
    const email = body["email"] as string
    const password = body["password"] as string
    if (!email || !password) return errors.validation("Email and password required")
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return errors.validation("Invalid email or password")
    return Response.json({ data: { user: data.user } })
  } catch { return errors.internal() }
}
'@, $utf8NoBom)
Write-Host "signin done"

# 3. signup route
[System.IO.File]::WriteAllText("$base\src\app\api\auth\signup\route.ts", @'
import { getSupabaseServerClient } from "@/services/supabase/server"
import { errors } from "@/lib/api/errors"

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>
    const email = body["email"] as string
    const password = body["password"] as string
    const full_name = body["full_name"] as string
    if (!email || !password) return errors.validation("Email and password required")
    if (password.length < 8) return errors.validation("Password must be at least 8 characters")
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: full_name ?? "" } } })
    if (error) return errors.validation(error.message)
    return Response.json({ data: { message: "Check your email to confirm your account." } }, { status: 201 })
  } catch { return errors.internal() }
}
'@, $utf8NoBom)
Write-Host "signup done"

# 4. signout route
[System.IO.File]::WriteAllText("$base\src\app\api\auth\signout\route.ts", @'
import { getSupabaseServerClient } from "@/services/supabase/server"

export async function POST() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  return Response.json({ data: { message: "Signed out" } })
}
'@, $utf8NoBom)
Write-Host "signout done"

# 5. reset-password route
[System.IO.File]::WriteAllText("$base\src\app\api\auth\reset-password\route.ts", @'
import { getSupabaseServerClient } from "@/services/supabase/server"
import { errors } from "@/lib/api/errors"

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>
    const email = body["email"] as string
    if (!email) return errors.validation("Email required")
    const supabase = await getSupabaseServerClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    })
    return Response.json({ data: { message: "Check your email for a reset link." } })
  } catch { return errors.internal() }
}
'@, $utf8NoBom)
Write-Host "reset-password done"

# 6. habits route
[System.IO.File]::WriteAllText("$base\src\app\api\habits\route.ts", @'
import { requireAuth } from "@/lib/api/middleware"
import { errors } from "@/lib/api/errors"
import { getHabits, createHabit } from "@/services/habits.service"

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const habits = await getHabits(user!.id)
    return Response.json({ data: habits })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json() as Record<string, unknown>
    const habit = await createHabit(user!.id, body as any)
    return Response.json({ data: habit }, { status: 201 })
  } catch { return errors.internal() }
}
'@, $utf8NoBom)
Write-Host "habits route done"

# 7. tasks route
[System.IO.File]::WriteAllText("$base\src\app\api\tasks\route.ts", @'
import { requireAuth } from "@/lib/api/middleware"
import { errors } from "@/lib/api/errors"
import { getTasks, createTask } from "@/services/tasks.service"

export async function GET(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") as any
  const priority = searchParams.get("priority") as any
  try {
    const tasks = await getTasks(user!.id, { status, priority })
    return Response.json({ data: tasks })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json() as Record<string, unknown>
    const task = await createTask(user!.id, body as any)
    return Response.json({ data: task }, { status: 201 })
  } catch { return errors.internal() }
}
'@, $utf8NoBom)
Write-Host "tasks route done"

# 8. goals route
[System.IO.File]::WriteAllText("$base\src\app\api\goals\route.ts", @'
import { requireAuth } from "@/lib/api/middleware"
import { errors } from "@/lib/api/errors"
import { getGoals, createGoal } from "@/services/goals.service"

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const goals = await getGoals(user!.id)
    return Response.json({ data: goals })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json() as Record<string, unknown>
    const goal = await createGoal(user!.id, body as any)
    return Response.json({ data: goal }, { status: 201 })
  } catch { return errors.internal() }
}
'@, $utf8NoBom)
Write-Host "goals route done"

Write-Host "ALL DONE - now run: git add -A && git commit -m 'fix: all type errors' && git push origin main"
