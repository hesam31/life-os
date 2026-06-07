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