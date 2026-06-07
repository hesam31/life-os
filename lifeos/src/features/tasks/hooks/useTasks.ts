'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import type { Task } from '@/types/models'
import type { TaskFilters } from '@/types/api'

export function useTasks(filters: TaskFilters = {}) {
  const params = new URLSearchParams()
  if (filters.status)   params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  const qs = params.toString()

  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn:  () => api.get<Task[]>(`/api/tasks${qs ? `?${qs}` : ''}`).then((r) => r.data),
  })
}
