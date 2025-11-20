# Deploy Splita to Vercel - Step by Step Guide

## 🚀 Quick Deploy (5 minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

3. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your `Splita-ComingSoon` repository
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

5. **Environment Variables (Optional for now):**
   - You can add these later if needed
   - Frontend doesn't need env vars (backend handles API)

6. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your site will be live at `splita-coming-soon.vercel.app`

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd "/Users/arinzeokigbo/Desktop/Splita/VibeCode Cursor/Splita-ComingSoon"
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **splita-coming-soon** (or press Enter)
   - Directory? **./** (press Enter)
   - Override settings? **No** (press Enter)

5. **Production deploy:**
   ```bash
   vercel --prod
   ```

---

## 🔧 Configuration

### vercel.json
Already created! This file ensures:
- ✅ Proper SPA routing (all routes go to index.html)
- ✅ Asset caching for better performance
- ✅ Vite framework detection

### Build Settings
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x (auto)

---

## 🌐 Connect Your Squarespace Domain

### Step 1: Add Domain in Vercel
1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `splita.co` (or your domain)
4. Click **Add**

### Step 2: Get DNS Records
Vercel will show you DNS records to add:
- **A Record:** Point `@` to Vercel's IP
- **CNAME Record:** Point `www` to `cname.vercel-dns.com`

### Step 3: Update DNS in Squarespace
1. Go to Squarespace → **Settings** → **Domains** → **DNS Settings**
2. Add the DNS records Vercel provided
3. Wait 24-48 hours for DNS propagation

---

## 🔗 Backend API Configuration

Your frontend calls the backend API. You have two options:

### Option A: Deploy Backend Separately (Recommended)
Deploy your `/server` folder to:
- **Render** (free tier)
- **Fly.io** (free tier)
- **Railway** ($5 credit)

Then update `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend-url.onrender.com';
```

### Option B: Use Vercel Serverless Functions
More complex, but keeps everything in one place.

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at `your-project.vercel.app`
- [ ] All images and assets load correctly
- [ ] Forms submit successfully
- [ ] Social links work
- [ ] Mobile responsive
- [ ] Custom domain connected (if applicable)

---

## 🐛 Troubleshooting

### Issue: 404 on page refresh
**Solution:** Already handled by `vercel.json` rewrites

### Issue: Assets not loading
**Solution:** Check that `public/` folder assets are included in build

### Issue: API calls failing
**Solution:** Update `API_BASE_URL` in `src/lib/api.ts` to your backend URL

### Issue: Build fails
**Solution:** 
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally first

---

## 📊 Monitoring

After deployment:
- View analytics in Vercel dashboard
- Check deployment logs
- Monitor performance metrics

---

## 🎉 You're Live!

Your Splita site is now live on Vercel! 🚀

**Next Steps:**
1. Test all functionality
2. Connect your Squarespace domain
3. Deploy your backend API separately
4. Update API URL in frontend

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vite on Vercel:** https://vercel.com/guides/deploying-vite
- **Support:** Check Vercel dashboard for deployment logs

