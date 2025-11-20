# Resend Contacts Setup Guide

This guide explains how to set up Resend to automatically add contacts when users fill out your forms.

## Step 1: Create Audiences in Resend

1. **Go to Resend Dashboard:**
   - Visit [resend.com/audiences](https://resend.com/audiences)
   - Sign in to your account

2. **Create Waitlist Audience:**
   - Click **"Create Audience"** or **"New Audience"**
   - Name it: `Waitlist` or `Splita Waitlist`
   - Copy the **Audience ID** (looks like: `abc123-def456-...`)

3. **Create Vendor Audience:**
   - Create another audience
   - Name it: `Vendors` or `Splita Vendors`
   - Copy the **Audience ID**

## Step 2: Add Audience IDs to Environment Variables

Add these to your `.env.test-server` or backend `.env` file:

```bash
RESEND_API_KEY=re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA
RESEND_WAITLIST_AUDIENCE_ID=your-waitlist-audience-id-here
RESEND_VENDOR_AUDIENCE_ID=your-vendor-audience-id-here
```

## Step 3: How It Works

When a user submits a form:

1. **Waitlist Form:**
   - Email is saved to your database
   - Contact is automatically added to Resend Waitlist audience
   - Welcome email is sent
   - Contact metadata includes `userType` and `vibe` preferences

2. **Vendor Form:**
   - Email is saved to your database
   - Contact is automatically added to Resend Vendor audience
   - Welcome email is sent
   - Contact is tagged as "Business"

## Step 4: View Contacts in Resend

1. Go to [resend.com/audiences](https://resend.com/audiences)
2. Click on your audience (Waitlist or Vendors)
3. You'll see all contacts that have been added
4. You can export contacts, segment them, and send campaigns

## Step 5: Using Contacts for Marketing

Once contacts are in Resend:

- **Send Campaigns:** Create email campaigns targeting specific audiences
- **Segment:** Filter contacts by metadata (userType, vibe, etc.)
- **Export:** Download contact lists for other tools
- **Track:** See open rates, click rates, and engagement

## Troubleshooting

### Contacts Not Appearing

1. **Check API Key:**
   - Verify `RESEND_API_KEY` is correct
   - Make sure it has permissions to create contacts

2. **Check Audience IDs:**
   - Verify audience IDs are correct
   - Make sure audiences exist in your Resend account

3. **Check Server Logs:**
   - Look for error messages in your server console
   - Check for "Resend contact error" messages

### API Errors

If you see errors like:
- `"Audience not found"` - Check that audience ID is correct
- `"Invalid API key"` - Verify your Resend API key
- `"Rate limit exceeded"` - You're sending too many requests

### Fallback Behavior

- If audience ID is not set, contacts will be added to your default audience
- If contact creation fails, the form submission still succeeds (logged as warning)
- You can always manually add contacts later in Resend dashboard

## Testing

1. **Start your test server:**
   ```bash
   npm run test-server
   ```

2. **Submit a test form:**
   - Fill out the waitlist or vendor form
   - Check server console for: `✅ Contact added to Resend`

3. **Verify in Resend:**
   - Go to Resend dashboard
   - Check your audience for the new contact

## Production Setup

For your production backend:

1. **Set environment variables** in your hosting platform (Vercel, Netlify, etc.)
2. **Use the same code** - the test server code works in production
3. **Monitor contacts** - Check Resend dashboard regularly
4. **Set up campaigns** - Use Resend to send updates to your audiences

## Next Steps

- Set up email campaigns in Resend
- Create segments based on userType or vibe
- Export contacts for other marketing tools
- Set up automated email sequences

