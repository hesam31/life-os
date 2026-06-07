'use client'
import { useHabits } from '../hooks/useHabits'
import { HabitCard } from './HabitCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useUIStore } from '@/lib/zustand'
import type { HabitWithStats } from '@/types/models'

export function HabitList({ initialHabits }: { initialHabits: HabitWithStats[] }) {
  const openModal = useUIStore((s) => s.openModal)
  const { data: habits = initialHabits, isLoading } = useHabits()

  if (isLoading && !habits.length) return <div className="flex justify-center py-20"><Spinner /></div>

  if (!habits.length) return (
    <EmptyState
      icon="◎"
      title="No habits yet"
      description="Build consistency by tracking daily habits linked to your goals."
      action={{ label: 'Create your first habit', onClick: () => openModal('createHabit') }}
    />
  )

  const logged   = habits.filter((h) => h.is_logged_today)
  const pending  = habits.filter((h) => !h.is_logged_today)

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Pending today</p>
          <div className="space-y-2">{pending.map((h) => <HabitCard key={h.id} habit={h} />)}</div>
        </section>
      )}
      {logged.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Completed today</p>
          <div className="space-y-2">{logged.map((h) => <HabitCard key={h.id} habit={h} />)}</div>
        </section>
      )}
    </div>
  )
}
