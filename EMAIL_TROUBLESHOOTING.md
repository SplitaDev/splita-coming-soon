# Email Sending Troubleshooting

## Current Status
✅ Email sending is **ENABLED** in the code
✅ API key has full permissions
✅ Email functions are being called

## Common Issues

### 1. Domain Not Verified in Resend
If your domain (`splita.co` or `@splita.co`) isn't verified in Resend, emails may not send.

**Fix:**
1. Go to [Resend Domains](https://resend.com/domains)
2. Add and verify your domain
3. Update `SPLITA_EMAIL` in `.env` to use your verified domain:
   ```env
   SPLITA_EMAIL=Splita <hello@splita.co>
   ```

### 2. Check Server Logs
When you submit a form, check the server console for:
- `📧 Sending waitlist email to: [email]`
- `✅ Waitlist email sent successfully!`
- Or error messages if something fails

### 3. Test Email Sending Directly
You can test the email endpoint directly:
```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com","type":"waitlist","userType":"Student"}'
```

### 4. Check Resend Dashboard
1. Go to [Resend Emails](https://resend.com/emails)
2. Check if emails are being sent
3. Look for any error messages or delivery issues

## Current Configuration
- **From Email**: `arinze@splita.co` (from .env)
- **API Key**: Full permissions ✅
- **Email Sending**: Enabled ✅

## Next Steps
1. Check server logs when submitting a form
2. Verify your domain in Resend
3. Check Resend dashboard for sent emails
4. Test with a real email address

