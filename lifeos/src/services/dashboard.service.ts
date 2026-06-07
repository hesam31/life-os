import { getSupabaseServerClient } from './supabase/server'
import { getTodayInTimezone } from '@/utils/date.utils'
import { differenceInDays, parseISO } from 'date-fns'
import type { DashboardData, ActivityItem } from '@/types/models'

export async function getDashboardData(userId: string, timezone = 'UTC'): Promise<DashboardData> {
  const supabase = await getSupabaseServerClient()
  const today    = getTodayInTimezone(timezone)

  const [habitsRes, logsRes, tasksRes, goalsRes, recentTasksRes] = await Promise.all([
    supabase.from('habits').select('id, frequency, custom_days').eq('user_id', userId).is('deleted_at', null),
    supabase.from('habit_logs').select('habit_id, logged_date').eq('user_id', userId).eq('logged_date', today),
    supabase.from('tasks').select('*').eq('user_id', userId).neq('status', 'done').lte('due_date', today).order('due_date', { ascending: true }),
    supabase.from('goals').select('*, tasks(id, status), habits(id)').eq('user_id', userId).eq('status', 'active').is('deleted_at', null).order('target_date', { ascending: true }),
    supabase.from('tasks').select('id, title, completed_at').eq('user_id', userId).eq('status', 'done').not('completed_at', 'is', null).order('completed_at', { ascending: false }).limit(5),
  ])

  const habits     = habitsRes.data ?? []
  const todayLogs  = new Set((logsRes.data ?? []).map((l) => l.habit_id))
  const isScheduledToday = (h: { frequency: string; custom_days: boolean[] | null }): boolean => {
    const day = new Date().getDay()
    if (h.frequency === 'daily')    return true
    if (h.frequency === 'weekdays') return day >= 1 && day <= 5
    if (h.frequency === 'weekends') return day === 0 || day === 6
    if (h.frequency === 'custom' && h.custom_days) return h.custom_days[day] === true
    return true
  }
  const scheduledToday = habits.filter(isScheduledToday)
  const completedToday = scheduledToday.filter((h) => todayLogs.has(h.id))

  const allTasks    = tasksRes.data ?? []
  const tasksToday  = allTasks.filter((t) => t.due_date === today)
  const tasksOv     = allTasks.filter((t) => t.due_date !== null && t.due_date < today).slice(0, 10)

  const activeGoals = (goalsRes.data ?? []).map((g) => {
    const tasks    = (g as unknown as { tasks: { id: string; status: string }[] }).tasks ?? []
    const taskHabs = (g as unknown as { habits: { id: string }[] }).habits ?? []
    const done     = tasks.filter((t) => t.status === 'done').length
    const progress = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100)
    return {
      id: g.id, user_id: g.user_id, title: g.title, description: g.description,
      status: g.status, target_date: g.target_date, deleted_at: g.deleted_at,
      created_at: g.created_at, updated_at: g.updated_at,
      progress, linked_task_count: tasks.length, linked_habit_count: taskHabs.length,
      days_remaining: differenceInDays(parseISO(g.target_date), new Date()),
    }
  })

  const recentHabitLogs = await supabase
    .from('habit_logs')
    .select('id, habit_id, logged_date, created_at, habits(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const activity: ActivityItem[] = [
    ...(recentHabitLogs.data ?? []).map((l) => ({
      type:       'habit_log' as const,
      timestamp:  l.created_at,
      habit_name: (l as unknown as { habits: { name: string } | null }).habits?.name ?? 'Habit',
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
