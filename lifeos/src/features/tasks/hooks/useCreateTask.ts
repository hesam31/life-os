'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'
import type { CreateTaskRequest } from '@/types/api'
import type { Task } from '@/types/models'

export function useCreateTask() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  return useMutation({
    mutationFn: (data: CreateTaskRequest) => api.post<Task>('/api/tasks', data).then((r) => r.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: queryKeys.tasks.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }); addToast('Task created!', 'success') },
    onError:    (e: Error) => addToast(e.message, 'error'),
  })
}
