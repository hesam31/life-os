'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import type { HabitWithStats } from '@/types/models'

export function useHabits() {
  return useQuery({
    queryKey: queryKeys.habits.list(),
    queryFn:  async () => {
      const res = await api.get<HabitWithStats[]>('/api/habits')
      return res.data
    },
  })
}
