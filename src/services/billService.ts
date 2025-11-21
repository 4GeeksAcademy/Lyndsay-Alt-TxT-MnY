import { supabase } from '../lib/supabase'
import type { Bill, CreateBillInput, UpdateBillInput } from '../types/bill'
import { calculateBillStatus } from '../utils/billUtils'

// Default user ID for MVP (single-user mode)
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001'

/**
 * Create a new bill
 */
export async function createBill(input: CreateBillInput): Promise<{ data: Bill | null; error: Error | null }> {
  try {
    // Calculate initial status
    const status = calculateBillStatus({
      ...input,
      id: '',
      user_id: DEFAULT_USER_ID,
      status: 'upcoming',
      payment_date: null,
      last_reminder_sent: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sms_enabled: input.sms_enabled ?? false
    } as Bill)

    const { data, error } = await supabase
      .from('bills')
      .insert({
        user_id: DEFAULT_USER_ID,
        name: input.name,
        amount: input.amount,
        due_date: input.due_date,
        category: input.category,
        status,
        sms_enabled: input.sms_enabled ?? false
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error creating bill:', error)
    return { data: null, error: error as Error }
  }
}

/**
 * Get all bills
 */
export async function getBills(): Promise<{ data: Bill[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', DEFAULT_USER_ID)
      .order('due_date', { ascending: true })

    if (error) throw error

    // Recalculate status for each bill (in case status has changed since last update)
    const billsWithUpdatedStatus = data?.map(bill => ({
      ...bill,
      status: calculateBillStatus(bill)
    }))

    return { data: billsWithUpdatedStatus, error: null }
  } catch (error) {
    console.error('Error fetching bills:', error)
    return { data: null, error: error as Error }
  }
}

/**
 * Get a single bill by ID
 */
export async function getBillById(id: string): Promise<{ data: Bill | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('id', id)
      .eq('user_id', DEFAULT_USER_ID)
      .single()

    if (error) throw error

    // Recalculate status
    const billWithUpdatedStatus = data ? {
      ...data,
      status: calculateBillStatus(data)
    } : null

    return { data: billWithUpdatedStatus, error: null }
  } catch (error) {
    console.error('Error fetching bill:', error)
    return { data: null, error: error as Error }
  }
}

/**
 * Update a bill
 */
export async function updateBill(
  id: string,
  input: UpdateBillInput
): Promise<{ data: Bill | null; error: Error | null }> {
  try {
    // First get the current bill to calculate new status
    const { data: currentBill, error: fetchError } = await getBillById(id)
    if (fetchError || !currentBill) throw fetchError || new Error('Bill not found')

    // Merge current bill with updates
    const updatedBill = { ...currentBill, ...input }
    const newStatus = calculateBillStatus(updatedBill)

    const { data, error } = await supabase
      .from('bills')
      .update({
        ...input,
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', DEFAULT_USER_ID)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error updating bill:', error)
    return { data: null, error: error as Error }
  }
}

/**
 * Delete a bill
 */
export async function deleteBill(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)
      .eq('user_id', DEFAULT_USER_ID)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error deleting bill:', error)
    return { error: error as Error }
  }
}

/**
 * Mark a bill as paid
 */
export async function markBillAsPaid(id: string): Promise<{ data: Bill | null; error: Error | null }> {
  return updateBill(id, {
    payment_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  })
}

/**
 * Mark a bill as unpaid
 */
export async function markBillAsUnpaid(id: string): Promise<{ data: Bill | null; error: Error | null }> {
  return updateBill(id, {
    payment_date: null
  })
}

/**
 * Get bills by category
 */
export async function getBillsByCategory(category: string): Promise<{ data: Bill[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', DEFAULT_USER_ID)
      .eq('category', category)
      .order('due_date', { ascending: true })

    if (error) throw error

    const billsWithUpdatedStatus = data?.map(bill => ({
      ...bill,
      status: calculateBillStatus(bill)
    }))

    return { data: billsWithUpdatedStatus, error: null }
  } catch (error) {
    console.error('Error fetching bills by category:', error)
    return { data: null, error: error as Error }
  }
}

/**
 * Get bills by status
 */
export async function getBillsByStatus(status: string): Promise<{ data: Bill[] | null; error: Error | null }> {
  try {
    const { data: allBills, error } = await getBills()
    if (error || !allBills) throw error

    // Filter bills by calculated status (since status might have changed)
    const filteredBills = allBills.filter(bill => bill.status === status)

    return { data: filteredBills, error: null }
  } catch (error) {
    console.error('Error fetching bills by status:', error)
    return { data: null, error: error as Error }
  }
}
