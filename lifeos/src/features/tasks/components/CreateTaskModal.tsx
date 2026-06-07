'use client'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from './TaskForm'
import { useCreateTask } from '../hooks/useCreateTask'
import { useUIStore } from '@/lib/zustand'
import type { CreateTaskInput } from '../schemas/task.schemas'

export function CreateTaskModal() {
  const openModals = useUIStore((s) => s.openModals)
  const closeModal = useUIStore((s) => s.closeModal)
  const create     = useCreateTask()

  return (
    <Modal open={!!openModals.createTask} onClose={() => closeModal('createTask')} title="New task">
      <TaskForm
        onSubmit={async (data: CreateTaskInput) => { await create.mutateAsync(data); closeModal('createTask') }}
        loading={create.isPending}
      />
    </Modal>
  )
}
