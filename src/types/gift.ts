export type EventType = 'birthday' | 'christmas' | 'anniversary' | 'graduation' | 'wedding' | 'baby_shower' | 'other';

export interface Gift {
  id: string;
  user_id: string;
  gift_name: string;
  recipient_name: string;
  amount: number;
  event_type: EventType;
  event_date: string;
  purchased: boolean;
  purchase_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateGiftInput {
  gift_name: string;
  recipient_name: string;
  amount: number;
  event_type: EventType;
  event_date: string;
  purchased?: boolean;
  notes?: string;
}

export interface UpdateGiftInput {
  gift_name?: string;
  recipient_name?: string;
  amount?: number;
  event_type?: EventType;
  event_date?: string;
  purchased?: boolean;
  purchase_date?: string | null;
  notes?: string | null;
}

export const EVENT_TYPES = [
  { value: 'birthday', label: '🎂 Birthday', icon: '🎂' },
  { value: 'christmas', label: '🎄 Christmas', icon: '🎄' },
  { value: 'anniversary', label: '💍 Anniversary', icon: '💍' },
  { value: 'graduation', label: '🎓 Graduation', icon: '🎓' },
  { value: 'wedding', label: '💒 Wedding', icon: '💒' },
  { value: 'baby_shower', label: '👶 Baby Shower', icon: '👶' },
  { value: 'other', label: '🎁 Other', icon: '🎁' },
] as const;
