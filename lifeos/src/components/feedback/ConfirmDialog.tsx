'use client'
import { useUIStore } from '@/lib/zustand'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export function ConfirmDialog() {
  const confirm      = useUIStore((s) => s.confirm)
  const closeConfirm = useUIStore((s) => s.closeConfirm)
  if (!confirm) return null
  return (
    <Modal open title={confirm.title} onClose={closeConfirm} size="sm">
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">{confirm.message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={closeConfirm}>Cancel</Button>
        <Button variant="danger" size="sm" onClick={() => { confirm.onConfirm(); closeConfirm() }}>Confirm</Button>
      </div>
    </Modal>
  )
}
