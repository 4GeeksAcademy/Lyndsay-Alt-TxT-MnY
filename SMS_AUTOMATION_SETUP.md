# TxT M💰NEY SMS Automation Setup

This guide explains how to set up automated SMS reminders using cron jobs or scheduled tasks.

## Option 1: Using GitHub Actions (Recommended for Simple Setup)

Create `.github/workflows/send-reminders.yml`:

```yaml
name: Send Bill Reminders

on:
  schedule:
    # Run every day at 9:00 AM UTC
    - cron: '0 9 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Send reminders
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_TWILIO_ACCOUNT_SID: ${{ secrets.VITE_TWILIO_ACCOUNT_SID }}
          VITE_TWILIO_AUTH_TOKEN: ${{ secrets.VITE_TWILIO_AUTH_TOKEN }}
          VITE_TWILIO_PHONE_NUMBER: ${{ secrets.VITE_TWILIO_PHONE_NUMBER }}
        run: node scripts/send-reminders.js
```

## Option 2: Supabase Edge Function

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Create Edge Function:
```bash
supabase functions new send-reminders
```

3. Implement in `supabase/functions/send-reminders/index.ts`:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Process reminders logic here
  // ... (similar to reminderService.ts)

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

4. Deploy:
```bash
supabase functions deploy send-reminders
```

5. Set up pg_cron:
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily at 9 AM
SELECT cron.schedule(
  'send-bill-reminders',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/send-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

## Option 3: External Cron Service

### Using EasyCron.com:

1. Sign up at https://www.easycron.com
2. Create a new cron job with:
   - URL: Your deployed API endpoint
   - Schedule: `0 9 * * *` (daily at 9 AM)
   - HTTP Method: POST
   - Add your API authentication headers

### Using Cron-job.org:

1. Sign up at https://cron-job.org
2. Create a new cron job:
   - URL: Your reminder endpoint
   - Execution schedule: Daily at 9:00 AM
   - Request method: GET or POST

## Option 4: Server Cron Job (Linux/Mac)

1. Edit crontab:
```bash
crontab -e
```

2. Add this line:
```bash
0 9 * * * cd /path/to/txtmoney && node scripts/send-reminders.js >> /var/log/txtmoney-reminders.log 2>&1
```

## Testing

### Manual Trigger:
Use the "Trigger Reminders Now" button in the Settings page to test immediately.

### Command Line:
```bash
# Create a test script
node -e "import('./src/services/reminderService.ts').then(m => m.processReminders())"
```

## Environment Variables

Make sure these are set in your environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TWILIO_ACCOUNT_SID`
- `VITE_TWILIO_AUTH_TOKEN`
- `VITE_TWILIO_PHONE_NUMBER`

## Monitoring

- Check Twilio console for SMS delivery status
- Monitor your Supabase logs
- Set up error alerts in your cron service
- Review `last_reminder_sent` timestamps in your bills table

## Cost Considerations

- Twilio charges ~$0.0075 per SMS in the US
- Free trial includes $15 credit (~2000 messages)
- GitHub Actions: 2000 minutes/month free
- EasyCron: Free tier available (limited jobs)
