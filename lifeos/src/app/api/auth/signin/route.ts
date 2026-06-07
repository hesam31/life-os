import { z } from 'zod'
import { getSupabaseServerClient } from '@/services/supabase/server'
import { errors } from '@/lib/api/errors'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  const body   = await request.json() as unknown
  const result = schema.safeParse(body)
  if (!result.success) return errors.validation('Invalid credentials')

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword(result.data)
  if (error) return errors.validation('Invalid email or password')
  return Response.json({ data: { user: data.user } })
}
