'use client'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { HabitList } from './HabitList'
import { CreateHabitModal } from './CreateHabitModal'
import { useUIStore } from '@/lib/zustand'
import type { HabitWithStats } from '@/types/models'

export function HabitsView({ initialHabits }: { initialHabits: HabitWithStats[] }) {
  const openModal = useUIStore((s) => s.openModal)
  return (
    <>
      <PageHeader
        title="Habits"
        description="Build consistency through daily practice."
        action={<Button size="sm" onClick={() => openModal('createHabit')}>+ New habit</Button>}
      />
      <HabitList initialHabits={initialHabits} />
      <CreateHabitModal />
    </>
  )
}
