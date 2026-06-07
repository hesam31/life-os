'use client'
import { Modal } from '@/components/ui/Modal'
import { HabitForm } from './HabitForm'
import { useCreateHabit } from '../hooks/useCreateHabit'
import { useUIStore } from '@/lib/zustand'
import type { CreateHabitInput } from '../schemas/habit.schemas'

export function CreateHabitModal() {
  const openModals = useUIStore((s) => s.openModals)
  const closeModal = useUIStore((s) => s.closeModal)
  const create     = useCreateHabit()

  const onSubmit = async (data: CreateHabitInput) => {
    await create.mutateAsync(data)
    closeModal('createHabit')
  }

  return (
    <Modal open={!!openModals.createHabit} onClose={() => closeModal('createHabit')} title="New habit">
      <HabitForm onSubmit={onSubmit} loading={create.isPending} />
    </Modal>
  )
}
