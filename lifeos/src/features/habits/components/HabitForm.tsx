'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createHabitSchema, type CreateHabitInput } from '../schemas/habit.schemas'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { HabitWithStats } from '@/types/models'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function HabitForm({ onSubmit, defaultValues, loading, submitLabel = 'Save' }: {
  onSubmit:      (data: CreateHabitInput) => void
  defaultValues?: Partial<CreateHabitInput>
  loading?:      boolean
  submitLabel?:  string
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateHabitInput>({
    resolver:      zodResolver(createHabitSchema),
    defaultValues: { frequency: 'daily', target_value: 1, unit: 'times', custom_days: Array(7).fill(false), ...defaultValues },
  })

  const frequency  = watch('frequency')
  const customDays = watch('custom_days') ?? Array(7).fill(false)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Habit name" placeholder="e.g. Morning run" error={errors.name?.message} {...register('name')} />
      <Textarea label="Description (optional)" placeholder="Why does this habit matter?" {...register('description')} />
      <Select
        label="Frequency"
        options={[
          { value: 'daily',    label: 'Every day'    },
          { value: 'weekdays', label: 'Weekdays only' },
          { value: 'weekends', label: 'Weekends only' },
          { value: 'custom',   label: 'Custom days'   },
        ]}
        {...register('frequency')}
      />
      {frequency === 'custom' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Days</label>
          <div className="flex gap-2">
            {DAYS.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  const next = [...customDays]
                  next[i] = !next[i]
                  setValue('custom_days', next as [boolean, boolean, boolean, boolean, boolean, boolean, boolean])
                }}
                className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors ${customDays[i] ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'}`}
              >
                {day}
              </button>
            ))}
          </div>
          {errors.custom_days && <p className="text-xs text-[var(--color-danger)]">{errors.custom_days.message}</p>}
        </div>
      )}
      <div className="flex gap-3">
        <div className="w-24">
          <Input label="Target" type="number" step="0.5" min="0.5" error={errors.target_value?.message} {...register('target_value', { valueAsNumber: true })} />
        </div>
        <div className="flex-1">
          <Input label="Unit" placeholder="times, pages, km…" error={errors.unit?.message} {...register('unit')} />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}
