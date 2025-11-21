import { supabase } from '../lib/supabase';
import type { Gift, CreateGiftInput, UpdateGiftInput } from '../types/gift';

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Create a new gift
 */
export const createGift = async (input: CreateGiftInput): Promise<Gift> => {
  const { data, error } = await supabase
    .from('gifts')
    .insert([
      {
        ...input,
        user_id: DEFAULT_USER_ID,
        purchased: input.purchased || false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating gift:', error);
    throw new Error(`Failed to create gift: ${error.message}`);
  }

  return data;
};

/**
 * Get all gifts for the user
 */
export const getGifts = async (): Promise<Gift[]> => {
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching gifts:', error);
    throw new Error(`Failed to fetch gifts: ${error.message}`);
  }

  return data || [];
};

/**
 * Get a single gift by ID
 */
export const getGiftById = async (id: string): Promise<Gift | null> => {
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('id', id)
    .eq('user_id', DEFAULT_USER_ID)
    .single();

  if (error) {
    console.error('Error fetching gift:', error);
    return null;
  }

  return data;
};

/**
 * Update a gift
 */
export const updateGift = async (
  id: string,
  updates: UpdateGiftInput
): Promise<Gift> => {
  const { data, error } = await supabase
    .from('gifts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', DEFAULT_USER_ID)
    .select()
    .single();

  if (error) {
    console.error('Error updating gift:', error);
    throw new Error(`Failed to update gift: ${error.message}`);
  }

  return data;
};

/**
 * Delete a gift
 */
export const deleteGift = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('gifts')
    .delete()
    .eq('id', id)
    .eq('user_id', DEFAULT_USER_ID);

  if (error) {
    console.error('Error deleting gift:', error);
    throw new Error(`Failed to delete gift: ${error.message}`);
  }
};

/**
 * Mark a gift as purchased
 */
export const markGiftAsPurchased = async (id: string): Promise<Gift> => {
  return updateGift(id, {
    purchased: true,
    purchase_date: new Date().toISOString().split('T')[0],
  });
};

/**
 * Mark a gift as not purchased
 */
export const markGiftAsUnpurchased = async (id: string): Promise<Gift> => {
  return updateGift(id, {
    purchased: false,
    purchase_date: null,
  });
};

/**
 * Get gifts by event type
 */
export const getGiftsByEventType = async (eventType: string): Promise<Gift[]> => {
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .eq('event_type', eventType)
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching gifts by event type:', error);
    throw new Error(`Failed to fetch gifts: ${error.message}`);
  }

  return data || [];
};

/**
 * Get gifts by purchased status
 */
export const getGiftsByPurchasedStatus = async (
  purchased: boolean
): Promise<Gift[]> => {
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .eq('purchased', purchased)
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching gifts by purchased status:', error);
    throw new Error(`Failed to fetch gifts: ${error.message}`);
  }

  return data || [];
};

/**
 * Get upcoming gifts (not purchased, event date in the future)
 */
export const getUpcomingGifts = async (): Promise<Gift[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .eq('purchased', false)
    .gte('event_date', today)
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming gifts:', error);
    throw new Error(`Failed to fetch upcoming gifts: ${error.message}`);
  }

  return data || [];
};
