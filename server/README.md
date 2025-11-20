# Splita Backend Server

Backend server for handling form submissions and storing them in a SQLite database.

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```env
RESEND_API_KEY=re_your_api_key_here
SPLITA_EMAIL=hello@splita.co
PORT=3001
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will:
- Create the database automatically in `../data/splita_submissions.db`
- Initialize all tables
- Start listening on port 3001

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /api/stats` - Get statistics (signups, vendors, cities)
- `POST /api/waitlist` - Submit waitlist form
- `POST /api/vendor` - Submit vendor form
- `POST /api/send-email` - Send email (called by frontend)

### Admin Endpoints

- `GET /api/admin/waitlist?limit=100&offset=0` - View all waitlist submissions
- `GET /api/admin/vendors?limit=100&offset=0` - View all vendor submissions
- `GET /api/admin/export` - Export all submissions as JSON

## Viewing Submissions

### Option 1: Using the View Script

```bash
node view-submissions.js
```

### Option 2: Using API

```bash
# View waitlist submissions
curl http://localhost:3001/api/admin/waitlist

# View vendor submissions
curl http://localhost:3001/api/admin/vendors

# Export all data
curl http://localhost:3001/api/admin/export > submissions.json
```

### Option 3: Using SQLite CLI

```bash
sqlite3 ../data/splita_submissions.db

# Then run SQL queries:
SELECT * FROM waitlist_submissions ORDER BY created_at DESC;
SELECT * FROM vendor_submissions ORDER BY created_at DESC;
```

## Database Schema

### waitlist_submissions
- `id` - Primary key
- `email` - User email (unique)
- `user_type` - Student, Friend Group, Vendor, Creator
- `vibe` - User preference (optional)
- `timestamp` - Submission timestamp
- `created_at` - Record creation time
- `updated_at` - Last update time

### vendor_submissions
- `id` - Primary key
- `email` - Business email (unique)
- `timestamp` - Submission timestamp
- `created_at` - Record creation time
- `updated_at` - Last update time

## Frontend Integration

Update `src/lib/api.ts` to point to your server:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

Or set in `.env`:
```
VITE_API_BASE_URL=http://localhost:3001
```

## Production Deployment

1. Set environment variables on your hosting platform
2. Deploy the server directory
3. Ensure the `data/` directory is writable
4. Update frontend API URL to production server

For production, consider:
- Using PostgreSQL instead of SQLite
- Adding authentication to admin endpoints
- Setting up automatic backups
- Adding rate limiting


