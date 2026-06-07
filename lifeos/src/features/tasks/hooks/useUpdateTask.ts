'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'
import type { UpdateTaskRequest } from '@/types/api'
import type { Task } from '@/types/models'

export function useUpdateTask() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  return useMutation({
    mutationFn:  ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      api.patch<Task>(`/api/tasks/${id}`, data).then((r) => r.data),
    onMutate:    async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks.all() })
      const lists = qc.getQueriesData<Task[]>({ queryKey: queryKeys.tasks.all() })
      lists.forEach(([key, old]) => {
        qc.setQueryData<Task[]>(key, old?.map((t) => t.id === id ? { ...t, ...data } : t) ?? [])
      })
      return { lists }
    },
    onError:     (e: Error, _, ctx) => { ctx?.lists.forEach(([key, old]) => qc.setQueryData(key, old)); addToast(e.message, 'error') },
    onSettled:   () => { qc.invalidateQueries({ queryKey: queryKeys.tasks.all() }); qc.invalidateQueries({ queryKey: queryKeys.goals.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }) },
  })
}
