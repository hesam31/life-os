import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/services/supabase/server"
import SedoraLanding from "@/features/landing/SedoraLanding"

export const dynamic = "force-dynamic"

export default async function RootPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect("/dashboard")
  return <SedoraLanding />
}