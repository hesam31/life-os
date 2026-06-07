'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'
import type { UpdateHabitRequest } from '@/types/api'
import type { Habit } from '@/types/models'

export function useUpdateHabit() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  return useMutation({
    mutationFn:  ({ id, data }: { id: string; data: UpdateHabitRequest }) =>
      api.patch<Habit>(`/api/habits/${id}`, data).then((r) => r.data),
    onSuccess:   () => { qc.invalidateQueries({ queryKey: queryKeys.habits.all() }); addToast('Habit updated!', 'success') },
    onError:     (e: Error) => addToast(e.message, 'error'),
  })
}
