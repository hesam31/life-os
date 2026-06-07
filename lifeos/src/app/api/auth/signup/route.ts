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