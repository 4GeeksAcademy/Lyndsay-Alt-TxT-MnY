import { supabase } from '../lib/supabase';

/**
 * Process reminders via Supabase Edge Function
 * The Edge Function handles all the logic server-side for security
 */
export const processReminders = async (): Promise<{
  success: boolean;
  sent?: number;
  failed?: number;
  skipped?: number;
  processedCount?: number;
  errors?: string[];
  results?: any[];
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('process-reminders', {
      body: {},
    });

    if (error) {
      console.error('Edge Function error:', error);
      return {
        success: false,
        errors: [error.message || 'Failed to process reminders'],
      };
    }

    if (!data.success) {
      return {
        success: false,
        errors: [data.error || 'Failed to process reminders'],
      };
    }

    console.log('Reminders processed successfully via Edge Function');
    return {
      success: true,
      processedCount: data.processedCount,
      results: data.results,
      sent: data.results?.filter((r: any) => r.success).length || 0,
      failed: data.results?.filter((r: any) => !r.success).length || 0,
    };
  } catch (error) {
    console.error('Error processing reminders:', error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
    };
  }
};

/**
 * Get bills that need reminders today
 * Useful for testing and manual triggers
 * Note: This is deprecated - use the Edge Function instead
 */
export const getBillsDueForReminder = async (): Promise<any[]> => {
  console.warn('getBillsDueForReminder is deprecated - reminders are now processed server-side');
  return [];
};

/**
 * Manually trigger reminders (for testing)
 */
export const triggerReminders = async (): Promise<string> => {
  const results = await processReminders();
  
  let message = `Reminder processing complete:\n`;
  message += `✅ Sent: ${results.sent || 0}\n`;
  message += `❌ Failed: ${results.failed || 0}\n`;
  message += `📊 Total processed: ${results.processedCount || 0}\n`;
  
  if (results.errors && results.errors.length > 0) {
    message += `\nErrors:\n${results.errors.join('\n')}`;
  }
  
  if (results.results && results.results.length > 0) {
    message += `\n\nDetails:\n`;
    results.results.forEach((r: any) => {
      const status = r.success ? '✅' : '❌';
      message += `${status} ${r.billName} (${r.daysUntilDue} days)\n`;
    });
  }
  
  return message;
};
