'use client'
import { Modal } from '@/components/ui/Modal'
import { GoalForm } from './GoalForm'
import { useCreateGoal } from '../hooks/useCreateGoal'
import { useUIStore } from '@/lib/zustand'
import type { CreateGoalInput } from '../schemas/goal.schemas'

export function CreateGoalModal() {
  const openModals = useUIStore((s) => s.openModals)
  const closeModal = useUIStore((s) => s.closeModal)
  const create     = useCreateGoal()

  return (
    <Modal open={!!openModals.createGoal} onClose={() => closeModal('createGoal')} title="New goal">
      <GoalForm
        onSubmit={async (data: CreateGoalInput) => { await create.mutateAsync(data); closeModal('createGoal') }}
        loading={create.isPending}
      />
    </Modal>
  )
}
