# 🚀 Deploy to Vercel - Quick Start

## ✅ Pre-Deployment Checklist
- [x] Build tested successfully
- [x] vercel.json created
- [x] Vercel CLI installed
- [ ] Vercel account/login
- [ ] Deploy!

---

## Step 1: Login to Vercel

Run this command in your terminal:
```bash
vercel login
```

This will:
- Open your browser
- Ask you to sign in with GitHub/Email
- Authorize Vercel CLI

---

## Step 2: Deploy to Vercel

From the project root, run:
```bash
vercel
```

**Follow the prompts:**
1. **Set up and deploy?** → Type `Y` and press Enter
2. **Which scope?** → Select your account (usually just press Enter)
3. **Link to existing project?** → Type `N` (for new project)
4. **What's your project's name?** → Press Enter (uses folder name) or type `splita`
5. **In which directory is your code located?** → Press Enter (uses `./`)
6. **Want to override the settings?** → Type `N` (we already have vercel.json)

**Wait 2-3 minutes** for deployment to complete!

---

## Step 3: Deploy to Production

After the preview deployment works, deploy to production:
```bash
vercel --prod
```

This will:
- Deploy to production
- Give you a production URL like `splita.vercel.app`
- Enable custom domains

---

## Step 4: Get Your Live URL

After deployment, Vercel will show you:
- **Preview URL:** `https://splita-coming-soon-xxxxx.vercel.app`
- **Production URL:** `https://splita-coming-soon.vercel.app`

**Your site is now live! 🎉**

---

## Step 5: Connect Your Squarespace Domain (Optional)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain: `splita.co`
6. Follow DNS instructions
7. Update DNS in Squarespace

---

## 🔧 Important Notes

### Backend API
Your frontend calls `https://api.splita.co` for the backend API.

**You need to deploy your backend separately:**
- The `/server` folder needs to be deployed to Render/Fly.io/Railway
- Then update `VITE_API_BASE_URL` in Vercel environment variables

### Environment Variables (If Needed)
If you need to set environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_BASE_URL=https://your-backend-url.com`

---

## 🐛 Troubleshooting

### Build Fails?
- Check build logs in Vercel dashboard
- Run `npm run build` locally to test
- Ensure all dependencies are in `package.json`

### 404 Errors?
- Already handled by `vercel.json` rewrites
- Should work automatically

### Assets Not Loading?
- Check that files in `public/` are included
- Verify paths in code are correct

---

## ✅ You're Done!

Your Splita site is now live on Vercel! 🚀

**Next Steps:**
1. Test all functionality
2. Deploy backend API separately
3. Connect custom domain
4. Share your site!

