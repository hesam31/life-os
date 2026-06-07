import { getSupabaseServerClient } from './supabase/server'
import type { Task } from '@/types/models'
import type { CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '@/types/api'

export async function getTasks(userId: string, filters: TaskFilters = {}): Promise<Task[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase.from('tasks').select('*').eq('user_id', userId)
  if (filters.status)   query = query.eq('status', filters.status)
  if (filters.priority) query = query.eq('priority', filters.priority)
  query = query.order('due_date', { ascending: true, nullsFirst: false }).order('priority', { ascending: false })
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getTask(userId: string, taskId: string): Promise<Task | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('tasks').select('*').eq('id', taskId).eq('user_id', userId).single()
  if (error) return null
  return data
}

export async function createTask(userId: string, data: CreateTaskRequest): Promise<Task> {
  const supabase = await getSupabaseServerClient()
  const { data: task, error } = await supabase
    .from('tasks').insert({ ...data, user_id: userId }).select().single()
  if (error) throw error
  return task
}

export async function updateTask(userId: string, taskId: string, data: UpdateTaskRequest): Promise<Task> {
  const supabase = await getSupabaseServerClient()
  const { data: task, error } = await supabase
    .from('tasks').update(data).eq('id', taskId).eq('user_id', userId).select().single()
  if (error) throw error
  return task
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', userId)
  if (error) throw error
}
