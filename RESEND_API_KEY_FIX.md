# Fix: Resend API Key Issue

## Problem
Your Resend API key is **restricted to only send emails**. It cannot create contacts or manage audiences.

## Error Message
```
"statusCode": 401,
"message": "This API key is restricted to only send emails",
"name": "restricted_api_key"
```

## Solution

### Step 1: Create a New API Key
1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. **IMPORTANT**: Do NOT select "Restrict to sending emails only"
4. Give it a name (e.g., "Splita Full Access")
5. Copy the new API key

### Step 2: Update Your .env File
In `server/.env`, replace the old API key:

```env
RESEND_API_KEY=re_YOUR_NEW_FULL_ACCESS_KEY_HERE
```

### Step 3: Restart Server
```bash
cd server
npm start
```

## Verify It Works
After updating, test by submitting a form on your site. The contact should appear in your Resend audience.

## Why This Happened
Resend allows you to create restricted API keys that can only send emails (for security). To manage contacts and audiences, you need a full API key with all permissions.

## Security Note
- Full API keys can manage contacts, audiences, and send emails
- Keep your API key secure and never commit it to Git
- Consider using environment variables in production

