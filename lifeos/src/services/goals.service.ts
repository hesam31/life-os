import { getSupabaseServerClient } from './supabase/server'
import { differenceInDays, parseISO } from 'date-fns'
import type { Goal, GoalWithProgress, GoalDetail } from '@/types/models'
import type { CreateGoalRequest, UpdateGoalRequest } from '@/types/api'

async function enrichGoal(goal: Goal, userId: string, supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>): Promise<GoalWithProgress> {
  const [tasksRes, habitsRes] = await Promise.all([
    supabase.from('tasks').select('id, status').eq('goal_id', goal.id).eq('user_id', userId),
    supabase.from('habits').select('id').eq('goal_id', goal.id).eq('user_id', userId).is('deleted_at', null),
  ])
  const tasks         = tasksRes.data ?? []
  const habits        = habitsRes.data ?? []
  const done          = tasks.filter((t) => t.status === 'done').length
  const progress      = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100)
  const days_remaining = differenceInDays(parseISO(goal.target_date), new Date())

  return { ...goal, progress, linked_task_count: tasks.length, linked_habit_count: habits.length, days_remaining }
}

export async function getGoals(userId: string): Promise<GoalWithProgress[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('target_date', { ascending: true })
  if (error) throw error
  return Promise.all((data ?? []).map((g) => enrichGoal(g, userId, supabase)))
}

export async function getGoal(userId: string, goalId: string): Promise<GoalDetail | null> {
  const supabase = await getSupabaseServerClient()
  const { data: goal, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()
  if (error || !goal) return null

  const [tasksRes, habitsRes] = await Promise.all([
    supabase.from('tasks').select('*').eq('goal_id', goalId).eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('habits').select('*').eq('goal_id', goalId).eq('user_id', userId).is('deleted_at', null),
  ])

  const enriched = await enrichGoal(goal, userId, supabase)
  return { ...enriched, tasks: tasksRes.data ?? [], habits: habitsRes.data ?? [] }
}

export async function createGoal(userId: string, data: CreateGoalRequest): Promise<Goal> {
  const supabase = await getSupabaseServerClient()
  const { data: goal, error } = await supabase
    .from('goals')
    .insert({ ...data, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return goal
}

export async function updateGoal(userId: string, goalId: string, data: UpdateGoalRequest): Promise<Goal> {
  const supabase = await getSupabaseServerClient()
  const { data: goal, error } = await supabase
    .from('goals')
    .update(data)
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return goal
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.from('goals').update({ deleted_at: new Date().toISOString() }).eq('id', goalId).eq('user_id', userId)
  await supabase.from('habits').update({ goal_id: null }).eq('goal_id', goalId).eq('user_id', userId)
  await supabase.from('tasks').update({ goal_id: null }).eq('goal_id', goalId).eq('user_id', userId)
}
