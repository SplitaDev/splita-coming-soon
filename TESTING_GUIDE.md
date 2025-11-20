# Testing Guide - Forms and Email

This guide will help you test the waitlist and vendor forms to ensure they work and send custom emails.

## Quick Start

### Step 1: Install Test Server Dependencies

```bash
npm install express cors resend dotenv --save-dev
```

### Step 2: Set Up Environment Variable

Create a `.env` file in the project root (or add to existing one):

```bash
RESEND_API_KEY=re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA
```

### Step 3: Start the Test Server

In one terminal, run:

```bash
npm run test-server
```

You should see:
```
🚀 Test server running on http://localhost:3001
📧 Using Resend API key: ✅ Set
```

### Step 4: Update Frontend to Use Test Server

Update your `.env` file to point to the test server:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

### Step 5: Start Frontend Dev Server

In another terminal, run:

```bash
npm run dev
```

Your app will be at `http://localhost:3000`

## Testing the Forms

### Test 1: Waitlist Form

1. Go to `http://localhost:3000`
2. Scroll to the "Get early access" section
3. Enter your email address
4. Select a user type (Student, Friend Group, Vendor, or Creator)
5. Click "Join waitlist"
6. Select a vibe preference (Night Mode or Sea-Green Mode)

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Email is sent to the address you entered
- ✅ Email is personalized with your user type and vibe preference
- ✅ Check the test server console for confirmation

### Test 2: Vendor Form

1. Scroll to "Are you a Hartford business?" section
2. Click "Learn more"
3. Enter a business email address
4. Click "Get vendor access"

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Email is sent to the business email
- ✅ Email includes Hartford-specific messaging
- ✅ Check the test server console for confirmation

## Viewing Test Submissions

Visit `http://localhost:3001/api/test/submissions` to see all form submissions:

```json
{
  "waitlist": [
    {
      "email": "test@example.com",
      "userType": "Student",
      "vibe": "Night Mode",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "id": 1234567890
    }
  ],
  "vendors": [
    {
      "email": "business@example.com",
      "timestamp": "2024-01-15T10:35:00.000Z",
      "id": 1234567891
    }
  ],
  "stats": {
    "signups": 3424,
    "waitlist": 1,
    "cities": 1
  }
}
```

## Checking Email Delivery

1. **Check your inbox** - Emails should arrive within seconds
2. **Check Resend dashboard** - Go to [resend.com/emails](https://resend.com/emails) to see delivery status
3. **Check test server console** - You'll see logs like:
   ```
   📝 Waitlist submission: { email: 'test@example.com', userType: 'Student', vibe: 'Night Mode' }
   📧 Sending email: { to: 'test@example.com', type: 'waitlist', userType: 'Student', vibe: 'Night Mode' }
   ✅ Email sent successfully: msg_xxxxxxxxxxxxx
   ```

## Troubleshooting

### Email Not Sending

1. **Check Resend API key** - Make sure it's set in `.env`
2. **Verify domain in Resend** - You need to verify `splita.co` in Resend dashboard
3. **Check console errors** - Look at both browser console and test server console
4. **Test Resend directly** - Try sending a test email from Resend dashboard

### Form Not Submitting

1. **Check API URL** - Make sure `VITE_API_BASE_URL=http://localhost:3001` in `.env`
2. **Restart dev server** - After changing `.env`, restart with `npm run dev`
3. **Check CORS** - The test server has CORS enabled, but check browser console for errors
4. **Check network tab** - Open browser DevTools → Network tab to see API calls

### Stats Not Updating

1. **Refresh the page** - Stats update every 30 seconds
2. **Check test server** - Visit `http://localhost:3001/api/stats` directly
3. **Submit a form** - Waitlist count should increase after submission

## Email Templates

The test server sends personalized emails:

### Waitlist Email
- Subject: "Welcome to Splita, [UserType]! 🎉"
- Includes user type (Student, Friend Group, etc.)
- Includes vibe preference if selected
- Personalized welcome message

### Vendor Email
- Subject: "Welcome, Hartford Business Partner! 🏢"
- Business-focused messaging
- Hartford-specific content
- Call-to-action to book a call

## Next Steps

Once testing is complete:

1. **Set up production backend** - Use the code from `BACKEND_SETUP.md`
2. **Update API URL** - Change `VITE_API_BASE_URL` to your production API
3. **Verify domain** - Make sure `splita.co` is verified in Resend
4. **Deploy** - Build and deploy to Netlify/Vercel

## Testing Checklist

- [ ] Test server running on port 3001
- [ ] Frontend running on port 3000
- [ ] Waitlist form submits successfully
- [ ] Waitlist email received and personalized
- [ ] Vendor form submits successfully
- [ ] Vendor email received
- [ ] Stats update correctly
- [ ] All console logs show success
- [ ] No errors in browser console
- [ ] No errors in test server console

