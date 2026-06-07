import { z } from 'zod'
import { getSupabaseServerClient } from '@/services/supabase/server'
import { errors } from '@/lib/api/errors'

const schema = z.object({ email: z.string().email() })

export async function POST(request: Request) {
  const body   = await request.json() as unknown
  const result = schema.safeParse(body)
  if (!result.success) return errors.validation('Invalid email')

  const supabase = await getSupabaseServerClient()
  await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })
  return Response.json({ data: { message: 'Check your email for a reset link.' } })
}
