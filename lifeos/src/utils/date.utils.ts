import { format, isToday, isPast, differenceInDays, parseISO, isValid } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

export function getTodayInTimezone(timezone: string): string {
  const now    = new Date()
  const zoned  = toZonedTime(now, timezone)
  return format(zoned, 'yyyy-MM-dd')
}

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, fmt) : ''
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  if (isToday(d)) return 'Today'
  const diff = differenceInDays(d, new Date())
  if (diff === 1)  return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 0)    return `In ${diff} days`
  return `${Math.abs(diff)} days ago`
}

export function getDaysRemaining(targetDate: string): number {
  return differenceInDays(parseISO(targetDate), new Date())
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  const d = parseISO(dueDate)
  return isValid(d) && isPast(d) && !isToday(d)
}

export function isTodayDate(date: string): boolean {
  return isToday(parseISO(date))
}

export function getDayOfWeek(date: Date = new Date()): number {
  return date.getDay()
}
