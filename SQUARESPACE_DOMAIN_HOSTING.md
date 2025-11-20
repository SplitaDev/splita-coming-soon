# Hosting Splita on Squarespace Domain (Free Options)

## Important Note
**Squarespace does NOT allow you to host external applications** (like React/Vite apps) directly on their platform. However, you can use your Squarespace domain with free hosting services!

## Option 1: Vercel (Recommended - Free & Easy) ⭐

### Steps:
1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your Splita repository
   - Vercel will auto-detect Vite and deploy

3. **Connect Squarespace Domain:**
   - In Vercel dashboard, go to your project → Settings → Domains
   - Add your domain: `splita.co` (or whatever your Squarespace domain is)
   - Vercel will give you DNS records to add

4. **Update DNS in Squarespace:**
   - Go to Squarespace → Settings → Domains → DNS Settings
   - Add the DNS records Vercel provides:
     - Type: `A` record → Point to Vercel's IP
     - Type: `CNAME` record → Point to `cname.vercel-dns.com`
   - Wait 24-48 hours for DNS propagation

### Benefits:
- ✅ **100% Free** for personal projects
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN
- ✅ Auto-deploy on git push
- ✅ Custom domains included

---

## Option 2: Netlify (Also Free & Great)

### Steps:
1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Drag & drop your `dist` folder OR connect your repo
   - Netlify will auto-detect and deploy

3. **Connect Domain:**
   - In Netlify dashboard → Site settings → Domain management
   - Add custom domain: `splita.co`
   - Follow DNS instructions

4. **Update DNS in Squarespace:**
   - Add the DNS records Netlify provides

### Benefits:
- ✅ **100% Free** tier
- ✅ Automatic HTTPS
- ✅ Form handling (useful for your waitlist!)
- ✅ Serverless functions support

---

## Option 3: GitHub Pages (Free but Limited)

### Steps:
1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/splita-comingsoon"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Custom Domain:**
   - Create `CNAME` file in `public/` folder with your domain
   - Update DNS in Squarespace to point to GitHub Pages

### Limitations:
- ⚠️ No server-side features (your backend won't work)
- ⚠️ Only static sites
- ⚠️ You'll need separate hosting for your backend API

---

## Option 4: Render (Free Tier Available)

### Steps:
1. Go to [render.com](https://render.com)
2. Connect your GitHub repo
3. Choose "Static Site"
4. Point build command to: `npm run build`
5. Point publish directory to: `dist`
6. Add custom domain in Render dashboard
7. Update DNS in Squarespace

### Benefits:
- ✅ Free tier available
- ✅ Can also host your backend API (Node.js)
- ✅ Automatic SSL

---

## Backend API Hosting

Since you have a Node.js backend (`/server`), you'll need to host it separately:

### Free Options:
1. **Render** - Free tier for web services
2. **Railway** - Free tier with $5 credit
3. **Fly.io** - Free tier available
4. **Heroku** - Limited free tier (may require credit card)

### Recommended Setup:
- **Frontend:** Vercel or Netlify (free, fast, easy)
- **Backend:** Render or Railway (free tier, supports Node.js)

---

## DNS Configuration in Squarespace

Once you choose a hosting service, you'll need to update DNS:

1. **Go to Squarespace:**
   - Settings → Domains → DNS Settings

2. **Add Records:**
   - **A Record:** Point `@` to hosting service IP
   - **CNAME Record:** Point `www` to hosting service URL

3. **Wait:**
   - DNS changes take 24-48 hours to propagate

---

## Quick Start (Vercel - Recommended)

```bash
# 1. Build your app
npm run build

# 2. Install Vercel CLI (optional)
npm i -g vercel

# 3. Deploy
vercel

# 4. Follow prompts to connect domain
```

Then update DNS in Squarespace with the records Vercel provides.

---

## Cost Summary - Free Forever Options

| Service | Frontend | Backend | Custom Domain | Free Forever? | Notes |
|---------|----------|---------|---------------|---------------|-------|
| **Vercel** | ✅ Free | ❌ N/A | ✅ Free | ✅ **YES** | Free tier is permanent for personal/hobby projects |
| **Netlify** | ✅ Free | ❌ N/A | ✅ Free | ✅ **YES** | Free tier is permanent, generous limits |
| **GitHub Pages** | ✅ Free | ❌ N/A | ✅ Free | ✅ **YES** | Free forever for public repos |
| **Render** | ✅ Free | ✅ Free | ✅ Free | ⚠️ **Limited** | Free tier but may sleep after inactivity |
| **Railway** | ✅ Free | ✅ Free | ✅ Free | ❌ **NO** | $5 free credit, then pay-as-you-go |

## 🏆 Best Free Forever Options:

### 1. **Vercel** (Recommended) ⭐
- ✅ **100% Free Forever** for personal projects
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ No credit card required
- ✅ Never expires

### 2. **Netlify**
- ✅ **100% Free Forever**
- ✅ 100GB bandwidth/month
- ✅ Form handling included
- ✅ No credit card required
- ✅ Never expires

### 3. **GitHub Pages**
- ✅ **100% Free Forever** (public repos)
- ✅ 1GB storage
- ✅ 100GB bandwidth/month
- ✅ No credit card required
- ✅ Never expires

**For your Splita app, Vercel or Netlify are the best "free forever" options!** 🎉

---

## Need Help?

1. **Vercel Docs:** https://vercel.com/docs
2. **Netlify Docs:** https://docs.netlify.com
3. **Squarespace DNS:** https://support.squarespace.com/hc/en-us/articles/205812378

---

## Recommendation

### For Frontend (Free Forever):
**Use Vercel** - Free forever, no credit card, unlimited bandwidth, best performance

### For Backend (Free Forever Options):
1. **Render** - Free tier, but may sleep after 15 min inactivity (wakes on request)
2. **Fly.io** - Free tier with generous limits
3. **Railway** - $5 free credit, then pay-as-you-go (not truly free forever)

**Best Setup:**
- **Frontend:** Vercel (free forever) ✅
- **Backend:** Render (free tier, wakes on request) or Fly.io (free tier)

Both will work perfectly with your Squarespace domain and are free forever!

