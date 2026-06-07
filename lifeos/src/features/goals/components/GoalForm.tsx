'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoalSchema, type CreateGoalInput } from '../schemas/goal.schemas'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export function GoalForm({ onSubmit, loading, submitLabel = 'Save' }: {
  onSubmit:     (data: CreateGoalInput) => void
  loading?:     boolean
  submitLabel?: string
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateGoalInput>({
    resolver: zodResolver(createGoalSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Goal title" placeholder="e.g. Run a half marathon" error={errors.title?.message} {...register('title')} />
      <Textarea label="Description (optional)" placeholder="What does success look like?" {...register('description')} />
      <Input label="Target date" type="date" error={errors.target_date?.message} {...register('target_date')} />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}
