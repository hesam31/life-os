"use client"
import { Modal } from "@/components/ui/Modal"
import { HabitForm } from "./HabitForm"
import { useCreateHabit } from "../hooks/useCreateHabit"
import { useUIStore } from "@/lib/zustand"

export function CreateHabitModal() {
  const openModals = useUIStore((s) => s.openModals)
  const closeModal = useUIStore((s) => s.closeModal)
  const create     = useCreateHabit()

  return (
    <Modal open={!!openModals.createHabit} onClose={() => closeModal("createHabit")} title="New habit">
      <HabitForm
        onSubmit={async (data) => {
          if (!data.name || !data.frequency) return
          await create.mutateAsync({ name: data.name, description: data.description, frequency: data.frequency, custom_days: data.custom_days, target_value: data.target_value, unit: data.unit, goal_id: data.goal_id })
          closeModal("createHabit")
        }}
        loading={create.isPending}
      />
    </Modal>
  )
}