'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn.utils'
import { useUIStore } from '@/lib/zustand'
import { useAuth } from '@/features/auth'

const nav = [
  { href: '/dashboard', icon: 'âٹ‍', label: 'Dashboard' },
  { href: '/habits',    icon: 'â—ژ', label: 'Habits'    },
  { href: '/tasks',     icon: 'âœ“', label: 'Tasks'     },
  { href: '/goals',     icon: 'â—ˆ', label: 'Goals'     },
]

export function Sidebar() {
  const pathname   = usePathname()
  const collapsed  = useUIStore((s) => s.sidebarCollapsed)
  const toggle     = useUIStore((s) => s.toggleSidebar)
  const { signOut } = useAuth()

  return (
    <aside
      className={cn(
        'flex flex-col h-screen transition-all duration-200 shrink-0',
        'border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-14 px-4 border-b border-white/10', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            Life<span className="text-[var(--color-accent)]">OS</span>
          </span>
        )}
        <button onClick={toggle} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                collapsed ? 'justify-center' : '',
                active
                  ? 'bg-[var(--color-accent)] text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="text-base leading-none">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={signOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors',
            collapsed ? 'justify-center' : ''
          )}
        >
          <span className="text-base leading-none">âژ‹</span>
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
