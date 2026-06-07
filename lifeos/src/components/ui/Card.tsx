import { cn } from '@/utils/cn.utils'

export function Card({ children, className, hover = false }: {
  children:   React.ReactNode
  className?: string
  hover?:     boolean
}) {
  return (
    <div className={cn(
      'rounded-xl border bg-[var(--color-bg-card)] border-[var(--color-border)]',
      hover && 'transition-shadow hover:shadow-md cursor-pointer',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]', className)}>{children}</div>
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}
