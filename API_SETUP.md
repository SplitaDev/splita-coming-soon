# API Setup Guide

This coming soon page is now configured to connect to your backend database for real-time stats.

## Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

If not set, it defaults to `https://api.splita.co`

## Required API Endpoints

Your backend needs to implement these endpoints:

### 1. GET `/api/stats`

Returns current statistics from the database.

**Response:**
```json
{
  "signups": 3424,
  "waitlist": 23,
  "cities": 1
}
```

**Example Implementation (Node.js/Express):**
```javascript
app.get('/api/stats', async (req, res) => {
  try {
    const signups = await db.count('users', { where: { type: 'early_access' } });
    const waitlist = await db.count('waitlist');
    const cities = await db.distinct('users', 'city').length;
    
    res.json({
      signups,
      waitlist,
      cities
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
```

### 2. POST `/api/waitlist`

Adds a user to the waitlist.

**Request Body:**
```json
{
  "email": "user@example.com",
  "userType": "Student",
  "vibe": "Night Mode" // optional
}
```

**Response:**
```json
{
  "success": true
}
```

**Example Implementation:**
```javascript
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email, userType, vibe } = req.body;
    
    await db.insert('waitlist', {
      email,
      userType,
      vibe,
      createdAt: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to waitlist' });
  }
});
```

### 3. POST `/api/vendor`

Adds a vendor to the vendor interest list.

**Request Body:**
```json
{
  "email": "business@example.com"
}
```

**Response:**
```json
{
  "success": true
}
```

## Database Schema Suggestions

### Waitlist Table
```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_type VARCHAR(50),
  vibe VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Users Table (for signups count)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50), -- 'early_access', 'beta', etc.
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## CORS Configuration

Make sure your API allows requests from your frontend domain:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

## Testing

1. Start your backend server
2. Set `VITE_API_BASE_URL` in `.env` to point to your API
3. Restart the frontend dev server
4. The stats should now load from your database

## Fallback Behavior

If the API is unavailable, the app will:
- Show fallback values (3424 signups, 23 waitlist, 1 city)
- Still allow form submissions (they'll be queued locally)
- Log errors to console for debugging

