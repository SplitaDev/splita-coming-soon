# Database Setup for Form Submissions

This guide will help you set up a database to store all form submissions (waitlist and vendor applications).

## Quick Start

### 1. Install Dependencies

```bash
npm install sqlite better-sqlite3
```

Or if you prefer the async version:

```bash
npm install sqlite sqlite3
```

### 2. Create Server Directory Structure

```
server/
  ├── index.js          # Express server
  ├── database.js       # Database functions
  ├── email.js          # Email service
  └── .env              # Environment variables
data/
  └── splita_submissions.db  # SQLite database (auto-created)
```

### 3. Set Up Environment Variables

Create `server/.env`:

```env
RESEND_API_KEY=re_your_api_key_here
SPLITA_EMAIL=hello@splita.co
PORT=3001
```

### 4. Start the Server

```bash
node server/index.js
```

The database will be automatically created in `data/splita_submissions.db` on first run.

## Database Schema

### Waitlist Submissions Table

```sql
CREATE TABLE waitlist_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL,
  vibe TEXT,
  timestamp TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Vendor Submissions Table

```sql
CREATE TABLE vendor_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  timestamp TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Public Endpoints

- `POST /api/waitlist` - Submit waitlist form
- `POST /api/vendor` - Submit vendor form
- `POST /api/send-email` - Send email (called by frontend)
- `GET /api/stats` - Get statistics

### Admin Endpoints

- `GET /api/admin/waitlist?limit=100&offset=0` - View all waitlist submissions
- `GET /api/admin/vendors?limit=100&offset=0` - View all vendor submissions
- `GET /api/admin/export` - Export all submissions as JSON

## Viewing Submissions

### Option 1: Using API Endpoints

```bash
# Get all waitlist submissions
curl http://localhost:3001/api/admin/waitlist

# Get all vendor submissions
curl http://localhost:3001/api/admin/vendors

# Export all data
curl http://localhost:3001/api/admin/export > submissions.json
```

### Option 2: Using SQLite CLI

```bash
# Open database
sqlite3 data/splita_submissions.db

# View waitlist submissions
SELECT * FROM waitlist_submissions ORDER BY created_at DESC;

# View vendor submissions
SELECT * FROM vendor_submissions ORDER BY created_at DESC;

# Get statistics
SELECT COUNT(*) as total_waitlist FROM waitlist_submissions;
SELECT COUNT(*) as total_vendors FROM vendor_submissions;
```

### Option 3: Using a Database GUI

Use tools like:
- **DB Browser for SQLite** (free, cross-platform)
- **TablePlus** (macOS, Windows, Linux)
- **DBeaver** (free, cross-platform)

Open the database file: `data/splita_submissions.db`

## Production Deployment

### Option 1: SQLite (Simple)

SQLite works great for small to medium applications. Just deploy the `data/` folder with your server.

### Option 2: PostgreSQL (Recommended for Production)

For production, consider using PostgreSQL:

1. Update `server/database.js` to use PostgreSQL instead of SQLite
2. Use a service like:
   - **Supabase** (free tier available)
   - **Railway** (PostgreSQL addon)
   - **Render** (PostgreSQL addon)
   - **AWS RDS** (for larger scale)

### Option 3: Supabase (Easiest)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema in Supabase SQL Editor
4. Update connection string in `.env`

## Backup Strategy

### Automatic Backups

Create a backup script:

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
cp data/splita_submissions.db "backups/splita_submissions_$DATE.db"
```

### Export to JSON

```bash
curl http://localhost:3001/api/admin/export > "backups/submissions_$(date +%Y%m%d).json"
```

## Security Notes

1. **Admin endpoints should be protected** in production
2. Add authentication middleware for `/api/admin/*` routes
3. Use environment variables for sensitive data
4. Enable CORS only for your frontend domain
5. Rate limit form submissions to prevent spam

## Next Steps

1. Install dependencies: `npm install sqlite sqlite3`
2. Create `server/.env` with your Resend API key
3. Start server: `node server/index.js`
4. Update frontend API URL if needed in `src/lib/api.ts`

The database will automatically create tables on first run!


