# 🚀 Quick Deploy to Vercel - Follow These Steps

## Step 1: Login to Vercel

Run this command in your terminal:
```bash
vercel login
```

This will:
- Open your browser automatically
- OR show you a code to enter at vercel.com/device
- Complete the authentication

---

## Step 2: Deploy Your Project

Once logged in, run:
```bash
vercel
```

**Answer the prompts:**
- Set up and deploy? → **Y**
- Link to existing project? → **N** (new project)
- Project name? → Press Enter (uses `splita-coming-soon`)
- Directory? → Press Enter (uses `./`)
- Override settings? → **N** (we have vercel.json)

**Wait 2-3 minutes** for deployment!

---

## Step 3: Deploy to Production

After preview works, deploy to production:
```bash
vercel --prod
```

---

## ✅ You're Live!

Your site will be at:
- Preview: `https://splita-coming-soon-xxxxx.vercel.app`
- Production: `https://splita-coming-soon.vercel.app`

---

## Alternative: Use Vercel Dashboard

If CLI doesn't work, use the web dashboard:

1. Go to **https://vercel.com**
2. Sign up/Login with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your repository
5. Click **"Deploy"**

Vercel will auto-detect Vite and deploy automatically!

