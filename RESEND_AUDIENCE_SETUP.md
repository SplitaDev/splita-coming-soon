# Resend Audience Setup Guide

This project now uses Resend's Audience feature to manage contacts instead of a local database.

## Setup Instructions

### 1. Create Audiences in Resend

1. Go to [Resend Dashboard](https://resend.com/audiences)
2. Click "Create Audience"
3. Create two audiences:
   - **Waitlist Audience** (e.g., "Splita Waitlist")
   - **Vendor Audience** (e.g., "Splita Vendors")

### 2. Get Audience IDs

1. After creating each audience, click on it to view details
2. Copy the Audience ID from the URL or audience settings
3. The ID will look like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 3. Update Environment Variables

Add these to your `.env` file in the `server/` directory:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
SPLITA_EMAIL=Splita <hello@splita.co>
RESEND_WAITLIST_AUDIENCE_ID=0febd25d-9658-4d72-998f-18a8d90fc24e
RESEND_VENDOR_AUDIENCE_ID=e7cbab7f-7e22-410d-811a-085006b2a713
```

**Your audience IDs are already configured!** Just make sure your `.env` file includes:
- `RESEND_API_KEY` (your Resend API key)
- `SPLITA_EMAIL` (your sending email address)
- The audience IDs above

### 4. Restart Server

After updating environment variables:

```bash
cd server
npm start
```

## How It Works

- **Waitlist Submissions**: When users join the waitlist, they're automatically added to the Waitlist audience in Resend
- **Vendor Submissions**: When vendors sign up, they're added to the Vendor audience
- **Email Sending**: Welcome emails are still sent via Resend's email API
- **Contact Management**: All contacts are managed in the Resend dashboard

## Viewing Contacts

- Go to [Resend Dashboard > Audiences](https://resend.com/audiences)
- Click on your audience to see all contacts
- Export contacts as CSV if needed
- Manage subscriptions and contact details

## Benefits

✅ No local database needed  
✅ Automatic duplicate handling  
✅ Built-in contact management  
✅ Easy export and analytics  
✅ Integration with Resend's email features  

## Notes

- Contacts are automatically deduplicated by Resend
- Metadata (userType, vibe, timestamp) is stored with each contact
- The admin endpoints now redirect to Resend dashboard for viewing contacts
- Stats endpoint returns fallback values (use Resend dashboard for real stats)

