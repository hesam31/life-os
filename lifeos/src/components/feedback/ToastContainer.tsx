'use client'
import { useEffect } from 'react'
import { useUIStore } from '@/lib/zustand'
import { cn } from '@/utils/cn.utils'

const icons = { success: '✓', error: '✕', info: 'ℹ' }
const styles = {
  success: 'border-[var(--color-success)] bg-[var(--color-success-subtle)] text-[var(--color-success)]',
  error:   'border-[var(--color-danger)]  bg-[var(--color-danger-subtle)]  text-[var(--color-danger)]',
  info:    'border-[var(--color-accent)]  bg-[var(--color-accent-subtle)]  text-[var(--color-accent)]',
}

function Toast({ id, message, variant }: { id: string; message: string; variant: 'success'|'error'|'info' }) {
  const remove = useUIStore((s) => s.removeToast)
  useEffect(() => { const t = setTimeout(() => remove(id), 4000); return () => clearTimeout(t) }, [id, remove])
  return (
    <div className={cn('flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg animate-slide-up', styles[variant])}>
      <span className="text-base">{icons[variant]}</span>
      <span>{message}</span>
      <button onClick={() => remove(id)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => <Toast key={t.id} {...t} />)}
    </div>
  )
}
