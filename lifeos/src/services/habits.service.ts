import { getSupabaseServerClient } from './supabase/server'
import { getTodayInTimezone } from '@/utils/date.utils'
import type { Habit, HabitWithStats, HabitLog } from '@/types/models'
import type { CreateHabitRequest, UpdateHabitRequest, LogHabitRequest } from '@/types/api'

function calcStreak(logs: { logged_date: string }[], frequency: string, customDays: boolean[] | null): { current: number; longest: number } {
  if (!logs.length) return { current: 0, longest: 0 }
  const sorted = [...logs].sort((a, b) => b.logged_date.localeCompare(a.logged_date))
  const isScheduled = (date: Date): boolean => {
    const day = date.getDay()
    if (frequency === 'daily')    return true
    if (frequency === 'weekdays') return day >= 1 && day <= 5
    if (frequency === 'weekends') return day === 0 || day === 6
    if (frequency === 'custom' && customDays) return customDays[day] === true
    return true
  }
  const logSet = new Set(sorted.map((l) => l.logged_date))
  let current = 0; let longest = 0; let streak = 0
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(today)
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().split('T')[0]!
    if (isScheduled(d)) {
      if (logSet.has(key)) { streak++; if (i === 0 || current > 0) current = streak }
      else { if (i === 0) { current = 0 } else { longest = Math.max(longest, streak); streak = 0; if (i < 2) current = 0; break } }
    }
    longest = Math.max(longest, streak)
    d.setDate(d.getDate() - 1)
  }
  return { current, longest: Math.max(longest, streak) }
}

function calcCompletionRate(logs: { logged_date: string }[], frequency: string, customDays: boolean[] | null): number {
  const isScheduled = (date: Date): boolean => {
    const day = date.getDay()
    if (frequency === 'daily')    return true
    if (frequency === 'weekdays') return day >= 1 && day <= 5
    if (frequency === 'weekends') return day === 0 || day === 6
    if (frequency === 'custom' && customDays) return customDays[day] === true
    return true
  }
  const logSet     = new Set(logs.map((l) => l.logged_date))
  let scheduled    = 0; let completed = 0
  const today      = new Date(); today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 30; i++) {
    const d   = new Date(today); d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]!
    if (isScheduled(d)) { scheduled++; if (logSet.has(key)) completed++ }
  }
  return scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100)
}

export async function getHabits(userId: string, timezone = 'UTC'): Promise<HabitWithStats[]> {
  const supabase  = await getSupabaseServerClient()
  const today     = getTodayInTimezone(timezone)
  const since     = new Date(); since.setDate(since.getDate() - 365)
  const sinceStr  = since.toISOString().split('T')[0]!

  const { data: habits, error } = await supabase
    .from('habits').select('*').eq('user_id', userId).is('deleted_at', null).order('created_at', { ascending: false })
  if (error) throw error

  return Promise.all((habits ?? []).map(async (habit) => {
    const { data: logs } = await supabase
      .from('habit_logs').select('id, logged_date, completed_value')
      .eq('habit_id', habit.id).gte('logged_date', sinceStr).order('logged_date', { ascending: false })

    const allLogs     = logs ?? []
    const todayLog    = allLogs.find((l) => l.logged_date === today) ?? null
    const { current, longest } = calcStreak(allLogs, habit.frequency, habit.custom_days)
    const completion_rate      = calcCompletionRate(allLogs, habit.frequency, habit.custom_days)

    return {
      ...habit,
      current_streak:  current,
      longest_streak:  longest,
      completion_rate,
      is_logged_today: todayLog !== null,
      today_log:       todayLog as HabitLog | null,
    }
  }))
}

export async function getHabit(userId: string, habitId: string, timezone = 'UTC'): Promise<HabitWithStats | null> {
  const habits = await getHabits(userId, timezone)
  return habits.find((h) => h.id === habitId) ?? null
}

export async function createHabit(userId: string, data: CreateHabitRequest): Promise<Habit> {
  const supabase = await getSupabaseServerClient()
  const { data: habit, error } = await supabase
    .from('habits').insert({ ...data, user_id: userId }).select().single()
  if (error) throw error
  return habit
}

export async function updateHabit(userId: string, habitId: string, data: UpdateHabitRequest): Promise<Habit> {
  const supabase = await getSupabaseServerClient()
  const { data: habit, error } = await supabase
    .from('habits').update(data).eq('id', habitId).eq('user_id', userId).select().single()
  if (error) throw error
  return habit
}

export async function deleteHabit(userId: string, habitId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.from('habits').update({ deleted_at: new Date().toISOString() }).eq('id', habitId).eq('user_id', userId)
}

export async function logHabit(userId: string, habitId: string, data: LogHabitRequest, timezone = 'UTC'): Promise<HabitLog> {
  const supabase   = await getSupabaseServerClient()
  const loggedDate = getTodayInTimezone(timezone)
  const { data: log, error } = await supabase
    .from('habit_logs')
    .upsert({ habit_id: habitId, user_id: userId, logged_date: loggedDate, completed_value: data.completed_value, note: data.note ?? null }, { onConflict: 'habit_id,logged_date' })
    .select().single()
  if (error) throw error
  return log
}

export async function unlogHabit(userId: string, habitId: string, timezone = 'UTC'): Promise<void> {
  const supabase   = await getSupabaseServerClient()
  const loggedDate = getTodayInTimezone(timezone)
  await supabase.from('habit_logs').delete().eq('habit_id', habitId).eq('user_id', userId).eq('logged_date', loggedDate)
}
