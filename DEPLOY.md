# Easy Free Deployment Guide

## Option 1: Render (Recommended - Easiest)

Render offers free hosting for both frontend and backend. **100% free forever** for your use case.

### Step 1: Push to GitHub

```bash
# If not already on GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend

1. Go to: https://render.com
2. Sign up (free)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `splita-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

6. Add Environment Variables:
   ```
   RESEND_API_KEY=your_resend_key
   RESEND_WAITLIST_AUDIENCE_ID=your_waitlist_id
   RESEND_VENDOR_AUDIENCE_ID=your_vendor_id
   PORT=10000
   NODE_ENV=production
   ```

7. Click **"Create Web Service"**

8. Copy your backend URL (e.g., `https://splita-backend.onrender.com`)

### Step 3: Deploy Frontend

1. In Render, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `splita-frontend`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: **Free**

4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://splita-backend.onrender.com
   ```

5. Click **"Create Static Site"**

### Done! 🎉

Your app will be live at: `https://splita-frontend.onrender.com`

---

## Option 2: Railway (Alternative)

Railway also offers free tier with $5 credit monthly.

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects and deploys both services
6. Add environment variables in the dashboard

---

## Option 3: Vercel (Frontend) + Render (Backend)

Deploy frontend to Vercel (easiest) and backend to Render.

### Frontend on Vercel:

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel auto-detects Vite - just click **"Deploy"**
6. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

### Backend on Render:

Follow Step 2 from Option 1 above.

---

## Quick Comparison

| Platform | Frontend | Backend | Free Tier | Easiest |
|----------|----------|---------|-----------|---------|
| **Render** | ✅ | ✅ | ✅ Forever | ⭐⭐⭐⭐⭐ |
| **Railway** | ✅ | ✅ | ✅ $5/month | ⭐⭐⭐⭐ |
| **Vercel + Render** | ✅ | ✅ | ✅ Forever | ⭐⭐⭐ |

**Recommendation: Use Render for both** - it's the easiest and completely free!

---

## After Deployment

1. Update your frontend's `VITE_API_BASE_URL` to point to your backend URL
2. Set environment variables in your hosting dashboard
3. Test your deployment

Your app will be live! 🚀

