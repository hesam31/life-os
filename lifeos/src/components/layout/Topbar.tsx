'use client'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/habits':    'Habits',
  '/app/tasks':     'Tasks',
  '/app/goals':     'Goals',
}

export function Topbar() {
  const pathname = usePathname()
  const title    = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ?? 'LifeOS'

  return (
    <header className="h-14 flex items-center px-6 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)] shrink-0">
      <h1 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h1>
    </header>
  )
}
