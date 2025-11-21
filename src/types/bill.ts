export type BillStatus = 'paid' | 'due_soon' | 'overdue' | 'upcoming'

export type BillCategory = 
  | 'utilities' 
  | 'rent_mortgage' 
  | 'insurance' 
  | 'subscriptions' 
  | 'credit_cards' 
  | 'loans' 
  | 'other'

export interface Bill {
  id: string
  user_id: string
  name: string
  amount: number
  due_date: string
  category: BillCategory
  status: BillStatus
  sms_enabled: boolean
  payment_date: string | null
  last_reminder_sent: string | null
  created_at: string
  updated_at: string
}

export interface CreateBillInput {
  name: string
  amount: number
  due_date: string
  category: BillCategory
  sms_enabled?: boolean
}

export interface UpdateBillInput {
  name?: string
  amount?: number
  due_date?: string
  category?: BillCategory
  sms_enabled?: boolean
  payment_date?: string | null
}

export interface BudgetSummary {
  total_monthly_bills: number
  total_paid: number
  remaining_balance: number
  progress_percentage: number
  bills_by_status: {
    paid: number
    due_soon: number
    overdue: number
    upcoming: number
  }
}
