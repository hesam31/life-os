'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'
import type { CreateHabitRequest } from '@/types/api'
import type { Habit } from '@/types/models'

export function useCreateHabit() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  return useMutation({
    mutationFn:  (data: CreateHabitRequest) => api.post<Habit>('/api/habits', data).then((r) => r.data),
    onSuccess:   () => { qc.invalidateQueries({ queryKey: queryKeys.habits.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }); addToast('Habit created!', 'success') },
    onError:     (e: Error) => addToast(e.message, 'error'),
  })
}
