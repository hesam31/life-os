import { getSupabaseServerClient } from './supabase/server'
import { getTodayInTimezone } from '@/utils/date.utils'
import { differenceInDays, parseISO } from 'date-fns'
import type { DashboardData, ActivityItem, GoalWithProgress } from '@/types/models'

export async function getDashboardData(userId: string, timezone = 'UTC'): Promise<DashboardData> {
  const supabase = await getSupabaseServerClient()
  const today    = getTodayInTimezone(timezone)

  const [habitsRes, logsRes, tasksRes, goalsRes, recentTasksRes, recentHabitLogsRes] = await Promise.all([
    supabase.from('habits').select('id, frequency, custom_days').eq('user_id', userId).is('deleted_at', null),
    supabase.from('habit_logs').select('habit_id, logged_date').eq('user_id', userId).eq('logged_date', today),
    supabase.from('tasks').select('*').eq('user_id', userId).neq('status', 'done').lte('due_date', today).order('due_date', { ascending: true }),
    supabase.from('goals').select('id, user_id, title, description, status, target_date, deleted_at, created_at, updated_at').eq('user_id', userId).eq('status', 'active').is('deleted_at', null).order('target_date', { ascending: true }),
    supabase.from('tasks').select('id, title, completed_at').eq('user_id', userId).eq('status', 'done').not('completed_at', 'is', null).order('completed_at', { ascending: false }).limit(5),
    supabase.from('habit_logs').select('id, habit_id, logged_date, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
  ])

  const habits = habitsRes.data ?? []
  const logs   = logsRes.data ?? []
  const todayLogs = new Set(logs.map((l: { habit_id: string }) => l.habit_id))

  const isScheduledToday = (h: { frequency: string; custom_days: boolean[] | null }): boolean => {
    const day = new Date().getDay()
    if (h.frequency === 'daily')    return true
    if (h.frequency === 'weekdays') return day >= 1 && day <= 5
    if (h.frequency === 'weekends') return day === 0 || day === 6
    if (h.frequency === 'custom' && h.custom_days) return h.custom_days[day] === true
    return true
  }

  const scheduledToday = habits.filter(isScheduledToday)
  const completedToday = scheduledToday.filter((h: { id: string }) => todayLogs.has(h.id))

  const allTasks   = tasksRes.data ?? []
  const tasksToday = allTasks.filter((t) => t.due_date === today)
  const tasksOv    = allTasks.filter((t) => t.due_date !== null && t.due_date < today).slice(0, 10)

  const goalIds = (goalsRes.data ?? []).map((g) => g.id)

  let goalTaskCounts: Record<string, { total: number; done: number }> = {}
  let goalHabitCounts: Record<string, number> = {}

  if (goalIds.length > 0) {
    const [gtRes, ghRes] = await Promise.all([
      supabase.from('tasks').select('goal_id, status').in('goal_id', goalIds).eq('user_id', userId),
      supabase.from('habits').select('goal_id').in('goal_id', goalIds).eq('user_id', userId).is('deleted_at', null),
    ])

    for (const t of gtRes.data ?? []) {
      if (!t.goal_id) continue
      if (!goalTaskCounts[t.goal_id]) goalTaskCounts[t.goal_id] = { total: 0, done: 0 }
      goalTaskCounts[t.goal_id]!.total++
      if (t.status === 'done') goalTaskCounts[t.goal_id]!.done++
    }

    for (const h of ghRes.data ?? []) {
      if (!h.goal_id) continue
      goalHabitCounts[h.goal_id] = (goalHabitCounts[h.goal_id] ?? 0) + 1
    }
  }

  const activeGoals: GoalWithProgress[] = (goalsRes.data ?? []).map((g) => {
    const tc       = goalTaskCounts[g.id] ?? { total: 0, done: 0 }
    const progress = tc.total === 0 ? 0 : Math.round((tc.done / tc.total) * 100)
    return {
      ...g,
      progress,
      linked_task_count:  tc.total,
      linked_habit_count: goalHabitCounts[g.id] ?? 0,
      days_remaining:     differenceInDays(parseISO(g.target_date), new Date()),
    }
  })

  // Get habit names for activity feed
  const habitIds = (recentHabitLogsRes.data ?? []).map((l: { habit_id: string }) => l.habit_id)
  let habitNames: Record<string, string> = {}
  if (habitIds.length > 0) {
    const namesRes = await supabase.from('habits').select('id, name').in('id', habitIds)
    for (const h of namesRes.data ?? []) {
      habitNames[h.id] = h.name
    }
  }

  const activity: ActivityItem[] = [
    ...(recentHabitLogsRes.data ?? []).map((l: { habit_id: string; created_at: string }) => ({
      type:       'habit_log' as const,
      timestamp:  l.created_at,
      habit_name: habitNames[l.habit_id] ?? 'Habit',
      habit_id:   l.habit_id,
    })),
    ...(recentTasksRes.data ?? []).map((t) => ({
      type:       'task_done' as const,
      timestamp:  t.completed_at!,
      task_title: t.title,
      task_id:    t.id,
    })),
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 10)

  return {
    habit_summary:   { total: scheduledToday.length, completed: completedToday.length },
    tasks_today:     tasksToday.slice(0, 10),
    tasks_overdue:   tasksOv,
    active_goals:    activeGoals,
    recent_activity: activity,
  }
}