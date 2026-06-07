"use client"
import { Modal } from "@/components/ui/Modal"
import { TaskForm } from "./TaskForm"
import { useCreateTask } from "../hooks/useCreateTask"
import { useUIStore } from "@/lib/zustand"

export function CreateTaskModal() {
  const openModals = useUIStore((s) => s.openModals)
  const closeModal = useUIStore((s) => s.closeModal)
  const create     = useCreateTask()

  return (
    <Modal open={!!openModals.createTask} onClose={() => closeModal("createTask")} title="New task">
      <TaskForm
        onSubmit={async (data) => {
          if (!data.title) return
          await create.mutateAsync({ title: data.title, description: data.description, priority: data.priority, due_date: data.due_date, goal_id: data.goal_id })
          closeModal("createTask")
        }}
        loading={create.isPending}
      />
    </Modal>
  )
}