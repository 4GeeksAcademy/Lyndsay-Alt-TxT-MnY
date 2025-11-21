export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone_number: string | null
          country_code: string | null
          phone_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone_number?: string | null
          country_code?: string | null
          phone_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone_number?: string | null
          country_code?: string | null
          phone_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bills: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          due_date: string
          category: string
          status: string
          sms_enabled: boolean
          payment_date: string | null
          last_reminder_sent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          amount: number
          due_date: string
          category: string
          status?: string
          sms_enabled?: boolean
          payment_date?: string | null
          last_reminder_sent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          due_date?: string
          category?: string
          status?: string
          sms_enabled?: boolean
          payment_date?: string | null
          last_reminder_sent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          user_id: string
          gift_name: string
          recipient_name: string
          amount: number
          event_type: string
          event_date: string
          purchased: boolean
          purchase_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          gift_name: string
          recipient_name: string
          amount: number
          event_type: string
          event_date: string
          purchased?: boolean
          purchase_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gift_name?: string
          recipient_name?: string
          amount?: number
          event_type?: string
          event_date?: string
          purchased?: boolean
          purchase_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
