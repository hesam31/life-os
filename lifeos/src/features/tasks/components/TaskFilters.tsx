'use client'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { TaskFilters as TF } from '@/types/api'

export function TaskFilters({ filters, onChange }: { filters: TF; onChange: (f: TF) => void }) {
  return (
    <div className="flex gap-3 items-end flex-wrap">
      <div className="w-36">
        <Select
          label="Status"
          value={filters.status ?? ''}
          onChange={(e) => onChange({ ...filters, status: (e.target.value || undefined) as TF['status'] })}
          options={[
            { value: '',            label: 'All statuses'  },
            { value: 'todo',        label: 'To do'         },
            { value: 'in_progress', label: 'In progress'   },
            { value: 'done',        label: 'Done'          },
          ]}
        />
      </div>
      <div className="w-36">
        <Select
          label="Priority"
          value={filters.priority ?? ''}
          onChange={(e) => onChange({ ...filters, priority: (e.target.value || undefined) as TF['priority'] })}
          options={[
            { value: '',       label: 'All priorities' },
            { value: 'high',   label: 'High'           },
            { value: 'medium', label: 'Medium'         },
            { value: 'low',    label: 'Low'            },
          ]}
        />
      </div>
      {(filters.status ?? filters.priority) && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>Clear filters</Button>
      )}
    </div>
  )
}
