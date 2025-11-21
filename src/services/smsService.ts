import { formatToE164 } from './userService';
import { supabase } from '../lib/supabase';

/**
 * Check if Supabase Edge Function is configured
 */
export const isTwilioConfigured = (): boolean => {
  // Check if Supabase is configured (Edge Function will validate Twilio credentials)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return !!supabaseUrl;
};

/**
 * SMS message templates
 */
export const SMS_TEMPLATES = {
  threeDayReminder: (billName: string, amount: number, dueDate: string) =>
    `📋 Bill Reminder: "${billName}" ($${amount.toFixed(2)}) is due in 3 days on ${dueDate}. Don't forget to pay!`,
  
  oneDayReminder: (billName: string, amount: number, dueDate: string) =>
    `⚠️ Urgent: "${billName}" ($${amount.toFixed(2)}) is due TOMORROW (${dueDate}). Please pay soon!`,
  
  sameDayReminder: (billName: string, amount: number) =>
    `🚨 LAST CHANCE: "${billName}" ($${amount.toFixed(2)}) is due TODAY! Pay now to avoid late fees.`,
};

/**
 * Send SMS via Supabase Edge Function
 */
export const sendSMS = async (
  to: string,
  message: string
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { to, message },
    });

    if (error) {
      console.error('Edge Function error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Failed to send SMS',
      };
    }

    console.log('SMS sent successfully via Edge Function');
    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Send a bill reminder SMS
 */
export const sendBillReminder = async (
  billName: string,
  amount: number,
  dueDate: string,
  daysUntilDue: number,
  recipientPhone: string,
  recipientCountryCode: string
): Promise<{ success: boolean; error?: string }> => {
  // Format phone number to E.164
  const formattedPhone = formatToE164(recipientCountryCode, recipientPhone);

  // Select appropriate template based on days until due
  let message: string;
  if (daysUntilDue === 3) {
    message = SMS_TEMPLATES.threeDayReminder(billName, amount, dueDate);
  } else if (daysUntilDue === 1) {
    message = SMS_TEMPLATES.oneDayReminder(billName, amount, dueDate);
  } else if (daysUntilDue === 0) {
    message = SMS_TEMPLATES.sameDayReminder(billName, amount);
  } else {
    message = `📋 Reminder: "${billName}" ($${amount.toFixed(2)}) is due on ${dueDate}.`;
  }

  return sendSMS(formattedPhone, message);
};

/**
 * Test SMS functionality with a sample message
 */
export const sendTestSMS = async (
  recipientPhone: string,
  recipientCountryCode: string
): Promise<{ success: boolean; error?: string }> => {
  const formattedPhone = formatToE164(recipientCountryCode, recipientPhone);
  const message = '🎉 Test message from TxT M💰NEY! Your SMS reminders are working correctly.';
  
  return sendSMS(formattedPhone, message);
};
