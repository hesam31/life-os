'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema, type CreateTaskInput } from '../schemas/task.schemas'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export function TaskForm({ onSubmit, loading, submitLabel = 'Save' }: {
  onSubmit:     (data: CreateTaskInput) => void
  loading?:     boolean
  submitLabel?: string
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTaskInput>({
    resolver:      zodResolver(createTaskSchema),
    defaultValues: { priority: 'medium' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Task title" placeholder="What needs to be done?" error={errors.title?.message} {...register('title')} />
      <Textarea label="Description (optional)" placeholder="Add more context…" {...register('description')} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Priority" options={[{ value:'high',label:'High' },{ value:'medium',label:'Medium' },{ value:'low',label:'Low' }]} {...register('priority')} />
        <Input label="Due date (optional)" type="date" error={errors.due_date?.message} {...register('due_date')} />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}
