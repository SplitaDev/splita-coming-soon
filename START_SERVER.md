# 🚀 How to Start the Server

## Quick Start

### 1. Start the Backend Server

Open a terminal and run:

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

### 2. Start the Frontend (in a NEW terminal)

```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## Troubleshooting

### Server Won't Start?

1. **Check if port 3001 is already in use:**
   ```bash
   lsof -ti:3001
   ```
   If it returns a number, kill that process:
   ```bash
   kill -9 $(lsof -ti:3001)
   ```

2. **Check if .env file exists:**
   ```bash
   cd server
   ls -la .env
   ```
   If it doesn't exist, create it with:
   ```bash
   cat > .env << 'EOF'
   RESEND_API_KEY=re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA
   SPLITA_EMAIL=arinze@splita.co
   PORT=3001
   EOF
   ```

3. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

### Connection Refused Error?

This means the server isn't running. Make sure:

1. ✅ You're in the `server` directory
2. ✅ Dependencies are installed (`npm install`)
3. ✅ `.env` file exists
4. ✅ Run `npm start` or `npm run dev`

### Frontend Can't Connect to Backend?

1. **Check backend is running:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","database":"connected",...}`

2. **Update frontend .env:**
   Create or update `.env` in the root directory:
   ```bash
   VITE_API_BASE_URL=http://localhost:3001
   ```

3. **Restart frontend** after updating .env

## Running Both Servers

You need **TWO terminals**:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open your browser to the frontend URL (usually `http://localhost:5173`)

