import { Badge } from '@/components/ui/Badge'
import type { GoalStatus } from '@/types/models'

const config: Record<GoalStatus, { label: string; variant: 'accent'|'success'|'muted' }> = {
  active:    { label: 'Active',    variant: 'accent'  },
  completed: { label: 'Completed', variant: 'success' },
  abandoned: { label: 'Abandoned', variant: 'muted'   },
}

export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
