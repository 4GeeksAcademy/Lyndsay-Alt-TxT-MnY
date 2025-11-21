import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  status: string;
  sms_enabled: boolean;
  last_reminder_sent: string | null;
}

interface UserProfile {
  phone_number: string;
  notifications_enabled: boolean;
}

const SMS_TEMPLATES = {
  threeDayReminder: (billName: string, amount: number, dueDate: string) =>
    `🔔 Reminder: Your bill "${billName}" ($${amount.toFixed(2)}) is due in 3 days on ${dueDate}. - TxT M💰NEY`,
  oneDayReminder: (billName: string, amount: number, dueDate: string) =>
    `⚠️ URGENT: Your bill "${billName}" ($${amount.toFixed(2)}) is due TOMORROW (${dueDate})! - TxT M💰NEY`,
  sameDayReminder: (billName: string, amount: number) =>
    `🚨 ALERT: Your bill "${billName}" ($${amount.toFixed(2)}) is due TODAY! - TxT M💰NEY`,
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate Twilio credentials
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('phone_number, phone_verified')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (userError || !userProfile?.phone_number || !userProfile?.phone_verified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User phone not configured or verified',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get all bills
    const { data: bills, error: billsError } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', '00000000-0000-0000-0000-000000000001');

    if (billsError) {
      throw new Error(`Failed to fetch bills: ${billsError.message}`);
    }

    const results = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const bill of bills || []) {
      // Skip if SMS disabled or already paid
      if (!bill.sms_enabled || bill.status === 'paid') {
        continue;
      }

      const dueDate = new Date(bill.due_date);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Check if reminder should be sent
      const lastReminderDate = bill.last_reminder_sent ? new Date(bill.last_reminder_sent) : null;
      const lastReminderToday = lastReminderDate?.toDateString() === today.toDateString();

      if (lastReminderToday) {
        continue; // Already sent today
      }

      let message = '';
      let shouldSend = false;

      if (daysUntilDue === 3) {
        message = SMS_TEMPLATES.threeDayReminder(bill.name, bill.amount, bill.due_date);
        shouldSend = true;
      } else if (daysUntilDue === 1) {
        message = SMS_TEMPLATES.oneDayReminder(bill.name, bill.amount, bill.due_date);
        shouldSend = true;
      } else if (daysUntilDue === 0) {
        message = SMS_TEMPLATES.sameDayReminder(bill.name, bill.amount);
        shouldSend = true;
      }

      if (shouldSend) {
        // Send SMS via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: userProfile.phone_number,
            From: twilioPhoneNumber,
            Body: message,
          }),
        });

        if (response.ok) {
          // Update last_reminder_sent
          await supabase
            .from('bills')
            .update({ last_reminder_sent: new Date().toISOString() })
            .eq('id', bill.id);

          results.push({
            billId: bill.id,
            billName: bill.name,
            daysUntilDue,
            success: true,
          });
        } else {
          const errorData = await response.json();
          results.push({
            billId: bill.id,
            billName: bill.name,
            daysUntilDue,
            success: false,
            error: errorData.message,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processedCount: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing reminders:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
