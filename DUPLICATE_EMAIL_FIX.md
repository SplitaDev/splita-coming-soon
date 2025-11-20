# Fixing Duplicate Emails

## Problem
You're receiving 2 emails per form submission.

## Root Cause
Resend is likely configured to automatically send welcome emails when contacts are added to audiences. Combined with our manual email sending, this causes duplicates.

## Solution Options

### Option 1: Disable Resend Automatic Emails (Recommended)

1. Go to [Resend Dashboard](https://resend.com/audiences)
2. Click on your audience (Waitlist or Vendor)
3. Look for "Automations" or "Welcome Emails" settings
4. **Disable automatic welcome emails** for the audience
5. Keep our custom email templates

This way, only our custom emails will be sent.

### Option 2: Disable Manual Emails (Use Resend Automation)

If you prefer to use Resend's built-in automation:

1. Add to your `server/.env` file:
   ```env
   SEND_MANUAL_EMAIL=false
   ```
2. Configure welcome emails in Resend dashboard
3. Restart the server

### Option 3: Check for Double Submissions

If the above doesn't work, check:
- Is the form being submitted twice? (Check browser console)
- Are there multiple event listeners on the form?
- Is the API being called twice?

## Quick Test

After making changes:
1. Submit a test form
2. Check your email
3. You should receive **only 1 email**

## Current Configuration

The server now checks `SEND_MANUAL_EMAIL` environment variable:
- If `SEND_MANUAL_EMAIL=false` → Only Resend automatic emails (if enabled)
- If not set or `true` → Only our custom emails (recommended)

**Recommended**: Disable automatic emails in Resend dashboard and keep our custom templates.

