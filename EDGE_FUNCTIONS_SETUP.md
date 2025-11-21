# Edge Function Deployment Guide

This document explains how to deploy and configure the Supabase Edge Functions for secure SMS functionality.

## Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref sjqlwqpowffozpoyrhtb
```

## Edge Functions Overview

The app uses two Edge Functions for secure server-side operations:

### 1. `send-sms` - Send individual SMS messages
- **Path**: `supabase/functions/send-sms/index.ts`
- **Purpose**: Sends SMS via Twilio API from the server
- **Endpoint**: `https://sjqlwqpowffozpoyrhtb.supabase.co/functions/v1/send-sms`
- **Security**: Twilio credentials never exposed to browser

### 2. `process-reminders` - Automated bill reminders
- **Path**: `supabase/functions/process-reminders/index.ts`
- **Purpose**: Processes all bills and sends reminder SMS
- **Endpoint**: `https://sjqlwqpowffozpoyrhtb.supabase.co/functions/v1/process-reminders`
- **Can be triggered**: Manually, via cron, or scheduled

## Deployment Steps

### Step 1: Set Twilio Secrets

Edge Functions need Twilio credentials set as **secrets** (not in .env):

```bash
# Set your Twilio Account SID
supabase secrets set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Set your Twilio Auth Token
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token_here

# Set your Twilio Phone Number (E.164 format)
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890

# Set Supabase URL (for database access)
supabase secrets set SUPABASE_URL=https://sjqlwqpowffozpoyrhtb.supabase.co

# Set Supabase Service Role Key (for admin operations)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Get Twilio credentials**: https://console.twilio.com

### Step 2: Deploy Edge Functions

Deploy both functions to Supabase:

```bash
# Deploy send-sms function
supabase functions deploy send-sms

# Deploy process-reminders function
supabase functions deploy process-reminders
```

### Step 3: Verify Deployment

Test the functions work correctly:

```bash
# Test send-sms (replace with your phone number)
curl -X POST \
  https://sjqlwqpowffozpoyrhtb.supabase.co/functions/v1/send-sms \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"+12345678901","message":"Test from TxT M💰NEY"}'

# Test process-reminders
curl -X POST \
  https://sjqlwqpowffozpoyrhtb.supabase.co/functions/v1/process-reminders \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Local Development

To test Edge Functions locally:

### 1. Start Supabase locally:
```bash
supabase start
```

### 2. Create `.env` file in `supabase/.env`:
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your_local_service_key
```

### 3. Serve functions locally:
```bash
supabase functions serve
```

### 4. Test locally:
```bash
curl -X POST http://localhost:54321/functions/v1/send-sms \
  -H "Authorization: Bearer YOUR_LOCAL_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"+12345678901","message":"Local test"}'
```

## Automated Reminders Setup

### Option 1: Supabase Cron (Recommended)

Use `pg_cron` extension in Supabase:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule reminders to run daily at 9 AM UTC
SELECT cron.schedule(
  'process-bill-reminders',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://sjqlwqpowffozpoyrhtb.supabase.co/functions/v1/process-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
```

### Option 2: GitHub Actions

Create `.github/workflows/reminders.yml`:

```yaml
name: Send Bill Reminders

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Supabase Edge Function
        run: |
          curl -X POST \
            https://sjqlwqpowffozpoyrhtb.supabase.co/functions/v1/process-reminders \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{}'
```

### Option 3: External Cron Service

Use services like EasyCron, Cron-job.org, or AWS EventBridge:

- **URL**: `https://sjqlwqpowffozpoyrhtb.supabase.co/functions/v1/process-reminders`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer YOUR_ANON_KEY`
  - `Content-Type: application/json`
- **Schedule**: Daily at desired time

## Security Best Practices

✅ **DO:**
- Keep Twilio credentials as Supabase secrets
- Use Edge Functions for all SMS operations
- Rotate Twilio Auth Token regularly
- Monitor Supabase function logs for errors

❌ **DON'T:**
- Put Twilio credentials in frontend code
- Use `VITE_` prefix for sensitive credentials
- Commit credentials to git
- Share Auth Token publicly

## Monitoring

View Edge Function logs:

```bash
# View send-sms logs
supabase functions logs send-sms

# View process-reminders logs
supabase functions logs process-reminders
```

Or in Supabase Dashboard:
https://supabase.com/dashboard/project/sjqlwqpowffozpoyrhtb/functions

## Troubleshooting

### Function returns "Twilio credentials not configured"
- Verify secrets are set: `supabase secrets list`
- Re-deploy functions after setting secrets

### SMS not sending
- Check Twilio account balance
- Verify phone number is E.164 format (+1234567890)
- Check Twilio console for error logs

### Function timeout
- Edge Functions have 150s timeout
- If processing many bills, consider batching

## Cost Considerations

- **Supabase Edge Functions**: Free tier includes 500K invocations/month
- **Twilio SMS**: ~$0.0075 per SMS in US
- Estimated monthly cost for 30 bills × 3 reminders = $0.68/month

## Next Steps

1. Deploy both Edge Functions
2. Set Twilio secrets in Supabase
3. Test SMS functionality in app
4. Set up automated reminders (choose option above)
5. Monitor logs and usage

## Support

- Supabase Docs: https://supabase.com/docs/guides/functions
- Twilio Docs: https://www.twilio.com/docs/sms
