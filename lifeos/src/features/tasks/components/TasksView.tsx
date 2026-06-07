'use client'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { TaskList } from './TaskList'
import { CreateTaskModal } from './CreateTaskModal'
import { useUIStore } from '@/lib/zustand'

export function TasksView() {
  const openModal = useUIStore((s) => s.openModal)
  return (
    <>
      <PageHeader
        title="Tasks"
        description="Stay on top of your actionable items."
        action={<Button size="sm" onClick={() => openModal('createTask')}>+ New task</Button>}
      />
      <TaskList />
      <CreateTaskModal />
    </>
  )
}
