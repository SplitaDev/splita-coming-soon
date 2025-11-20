# 🚀 Quick Start Guide

## Backend Server Setup ✅

Your backend server is now configured with:
- ✅ Resend API Key: `re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA`
- ✅ Splita Email: `arinze@splita.co`
- ✅ Database: SQLite (auto-created)
- ✅ Port: 3001

## Start the Backend Server

```bash
cd server
npm start
```

You should see:
```
✅ Database ready
🚀 Server running on http://localhost:3001
📊 Database: data/splita_submissions.db
📧 Email service: Ready
```

## Start the Frontend

In a new terminal:

```bash
npm run dev
```

## Test It Out

1. **Open your app:** `http://localhost:5173` (or your Vite port)

2. **Submit a form:**
   - Fill out the waitlist form
   - Data is saved to both:
     - Local IndexedDB (browser)
     - Server SQLite database

3. **View submissions:**
   - **Local DB:** Add `?admin=true` to URL
   - **Server DB:** `curl http://localhost:3001/api/admin/waitlist`

## View Local Database

Add `?admin=true` to your frontend URL:
```
http://localhost:5173?admin=true
```

Click the floating button in the bottom-right to view all local submissions.

## View Server Database

```bash
cd server
node view-submissions.js
```

Or via API:
```bash
curl http://localhost:3001/api/admin/waitlist
```

## Everything is Ready! 🎉

- ✅ Backend server configured
- ✅ Local database working
- ✅ Forms saving to both databases
- ✅ Email service ready
- ✅ Admin panels available

Just start both servers and you're good to go!

