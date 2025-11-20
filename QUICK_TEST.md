# Quick Testing Instructions

## Step 1: Start Test Server

Open a terminal and run:

```bash
npm run test-server
```

Keep this terminal open. You should see:
```
🚀 Test server running on http://localhost:3001
```

## Step 2: Update Frontend to Use Test Server

Edit your `.env` file and change:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

## Step 3: Restart Frontend Dev Server

If your dev server is running, stop it (Ctrl+C) and restart:

```bash
npm run dev
```

## Step 4: Test the Forms

### Test Waitlist Form:
1. Go to `http://localhost:3000`
2. Fill out "Get early access" form with your email
3. Select a user type
4. Submit and select a vibe
5. **Check your email** - you should receive a personalized email!

### Test Vendor Form:
1. Scroll to "Are you a Hartford business?"
2. Click "Learn more"
3. Enter a business email
4. Submit
5. **Check your email** - you should receive a vendor email!

## Step 5: Verify

- ✅ Check your inbox for emails
- ✅ Check test server console for success messages
- ✅ Visit `http://localhost:3001/api/test/submissions` to see all submissions
- ✅ Check browser console for any errors

## Troubleshooting

**Email not sending?**
- Make sure `RESEND_API_KEY` is in your `.env` file
- Verify `splita.co` domain in Resend dashboard
- Check test server console for errors

**Form not submitting?**
- Make sure test server is running on port 3001
- Check that `VITE_API_BASE_URL=http://localhost:3001` in `.env`
- Restart dev server after changing `.env`

