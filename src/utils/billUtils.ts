import { differenceInDays, isPast, isToday, parseISO } from 'date-fns'
import type { Bill, BillStatus } from '../types/bill'

/**
 * Calculate the status of a bill based on its due date and payment status
 * @param bill - The bill object to calculate status for
 * @returns The calculated bill status
 */
export function calculateBillStatus(bill: Bill): BillStatus {
  // If bill is already paid, return paid status
  if (bill.payment_date) {
    return 'paid'
  }

  const dueDate = parseISO(bill.due_date)
  const today = new Date()
  
  // If due date is in the past, it's overdue
  if (isPast(dueDate) && !isToday(dueDate)) {
    return 'overdue'
  }
  
  // Calculate days until due
  const daysUntilDue = differenceInDays(dueDate, today)
  
  // If due within 7 days (including today), it's due soon
  if (daysUntilDue <= 7) {
    return 'due_soon'
  }
  
  // Otherwise, it's upcoming
  return 'upcoming'
}

/**
 * Check if a bill is overdue
 */
export function isBillOverdue(bill: Bill): boolean {
  if (bill.payment_date) return false
  const dueDate = parseISO(bill.due_date)
  return isPast(dueDate) && !isToday(dueDate)
}

/**
 * Check if a bill is due soon (within 7 days)
 */
export function isBillDueSoon(bill: Bill): boolean {
  if (bill.payment_date) return false
  const dueDate = parseISO(bill.due_date)
  const today = new Date()
  const daysUntilDue = differenceInDays(dueDate, today)
  return daysUntilDue >= 0 && daysUntilDue <= 7
}

/**
 * Get days until bill is due
 */
export function getDaysUntilDue(bill: Bill): number {
  const dueDate = parseISO(bill.due_date)
  const today = new Date()
  return differenceInDays(dueDate, today)
}

/**
 * Format bill status for display
 */
export function formatBillStatus(status: BillStatus): string {
  const statusMap: Record<BillStatus, string> = {
    paid: 'Paid',
    due_soon: 'Due Soon',
    overdue: 'Overdue',
    upcoming: 'Upcoming'
  }
  return statusMap[status]
}

/**
 * Get color class for bill status (Tailwind CSS)
 */
export function getStatusColorClass(status: BillStatus): string {
  const colorMap: Record<BillStatus, string> = {
    paid: 'text-green-600 bg-green-50',
    due_soon: 'text-yellow-600 bg-yellow-50',
    overdue: 'text-red-600 bg-red-50',
    upcoming: 'text-blue-600 bg-blue-50'
  }
  return colorMap[status]
}
