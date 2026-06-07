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