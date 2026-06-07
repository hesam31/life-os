"use client"
import { Modal } from "@/components/ui/Modal"
import { GoalForm } from "./GoalForm"
import { useCreateGoal } from "../hooks/useCreateGoal"
import { useUIStore } from "@/lib/zustand"

export function CreateGoalModal() {
  const openModals = useUIStore((s) => s.openModals)
  const closeModal = useUIStore((s) => s.closeModal)
  const create     = useCreateGoal()

  return (
    <Modal open={!!openModals.createGoal} onClose={() => closeModal("createGoal")} title="New goal">
      <GoalForm
        onSubmit={async (data) => {
          if (!data.title || !data.target_date) return
          await create.mutateAsync({ title: data.title, description: data.description, target_date: data.target_date })
          closeModal("createGoal")
        }}
        loading={create.isPending}
      />
    </Modal>
  )
}