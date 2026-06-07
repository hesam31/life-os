'use client'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { GoalList } from './GoalList'
import { CreateGoalModal } from './CreateGoalModal'
import { useUIStore } from '@/lib/zustand'
import type { GoalWithProgress } from '@/types/models'

export function GoalsView({ initialGoals }: { initialGoals: GoalWithProgress[] }) {
  const openModal = useUIStore((s) => s.openModal)
  return (
    <>
      <PageHeader
        title="Goals"
        description="Define what you're working toward."
        action={<Button size="sm" onClick={() => openModal('createGoal')}>+ New goal</Button>}
      />
      <GoalList initialGoals={initialGoals} />
      <CreateGoalModal />
    </>
  )
}
