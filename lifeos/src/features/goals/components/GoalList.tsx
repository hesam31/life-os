'use client'
import { useGoals } from '../hooks/useGoals'
import { GoalCard } from './GoalCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useUIStore } from '@/lib/zustand'
import type { GoalWithProgress } from '@/types/models'

export function GoalList({ initialGoals }: { initialGoals: GoalWithProgress[] }) {
  const openModal = useUIStore((s) => s.openModal)
  const { data: goals = initialGoals, isLoading } = useGoals()

  if (isLoading && !goals.length) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!goals.length) return (
    <EmptyState
      icon="◈"
      title="No goals yet"
      description="Set a meaningful goal and link your habits and tasks to it."
      action={{ label: 'Create your first goal', onClick: () => openModal('createGoal') }}
    />
  )

  const active    = goals.filter((g) => g.status === 'active')
  const inactive  = goals.filter((g) => g.status !== 'active')

  return (
    <div className="space-y-6">
      {active.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Active</p>
          <div className="grid gap-3 sm:grid-cols-2">{active.map((g) => <GoalCard key={g.id} goal={g} />)}</div>
        </section>
      )}
      {inactive.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Completed / Abandoned</p>
          <div className="grid gap-3 sm:grid-cols-2">{inactive.map((g) => <GoalCard key={g.id} goal={g} />)}</div>
        </section>
      )}
    </div>
  )
}
