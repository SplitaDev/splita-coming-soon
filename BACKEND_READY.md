# ✅ Backend Server Setup Complete!

Your backend server has been configured with your Resend API credentials.

## What's Been Set Up

### ✅ Environment Variables
- Created `server/.env` file with your Resend API key
- Configured SPLITA_EMAIL for email sending
- Server port set to 3001 (default)

### ✅ Server Files
- Express server with database integration
- Email service using Resend
- SQLite database for storing submissions
- Admin endpoints for viewing data

## Quick Start

### Option 1: Using the Start Script

```bash
cd server
./start.sh
```

### Option 2: Manual Start

```bash
cd server
npm install  # Only needed first time
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/stats` - Get statistics
- `POST /api/waitlist` - Submit waitlist form
- `POST /api/vendor` - Submit vendor form
- `POST /api/send-email` - Send email

### Admin Endpoints
- `GET /api/admin/waitlist` - View all waitlist submissions
- `GET /api/admin/vendors` - View all vendor submissions
- `GET /api/admin/export` - Export all data as JSON

## Testing

1. **Start the server:**
   ```bash
   cd server
   npm start
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Test waitlist submission:**
   ```bash
   curl -X POST http://localhost:3001/api/waitlist \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","userType":"Student","vibe":"Night Mode"}'
   ```

4. **View submissions:**
   ```bash
   curl http://localhost:3001/api/admin/waitlist
   ```

## Frontend Integration

Update your frontend `.env` file (or create it):

```bash
VITE_API_BASE_URL=http://localhost:3001
```

Or for production:
```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

## Database

The database is automatically created at `data/splita_submissions.db` on first run.

View submissions:
```bash
cd server
node view-submissions.js
```

## Email Configuration

Your Resend API key is configured in `server/.env`:
- ✅ RESEND_API_KEY is set
- ✅ SPLITA_EMAIL is set to arinze@splita.co

**Important:** Make sure `arinze@splita.co` is verified in your Resend dashboard!

## Next Steps

1. ✅ Backend server is configured
2. ✅ Database is ready
3. ✅ Email service is configured
4. ⏭️ Start the server: `cd server && npm start`
5. ⏭️ Update frontend API URL if needed
6. ⏭️ Test form submissions

## Troubleshooting

### Server won't start?
- Check if port 3001 is available
- Verify `.env` file exists in `server/` directory
- Run `npm install` in the server directory

### Database errors?
- Ensure `data/` directory is writable
- Check file permissions
- Try deleting `data/splita_submissions.db` and restarting

### Email not sending?
- Verify Resend API key is correct
- Check if `arinze@splita.co` is verified in Resend
- Check server console for error messages

## Production Deployment

For production, set environment variables on your hosting platform:

**Vercel/Railway/Render:**
- `RESEND_API_KEY=re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA`
- `SPLITA_EMAIL=arinze@splita.co`
- `PORT=3001` (or let platform assign)

**Important:** Never commit `.env` file to git! It's already in `.gitignore`.

