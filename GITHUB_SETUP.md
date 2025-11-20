# 🚀 Add Project to GitHub - Step by Step

## ✅ Local Git Setup Complete!

Your project is now:
- ✅ Git initialized
- ✅ All files staged
- ✅ Initial commit created

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Easiest)

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository:**
   - Click the **"+"** icon (top right) → **"New repository"**
   - **Repository name:** `splita-coming-soon` (or your preferred name)
   - **Description:** "Splita - Group payments, simplified. Coming soon page."
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **"Create repository"**

3. **Copy the repository URL:**
   - GitHub will show you commands, copy the repository URL
   - It will look like: `https://github.com/yourusername/splita-coming-soon.git`

---

### Option B: Via GitHub CLI (If installed)

```bash
gh repo create splita-coming-soon --public --source=. --remote=origin --push
```

---

## Step 2: Connect Local Repository to GitHub

Run these commands in your terminal:

```bash
# Add GitHub as remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/splita-coming-soon.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Verify on GitHub

1. Go to your repository on GitHub
2. You should see all your files
3. Your code is now on GitHub! 🎉

---

## 🔐 Important: Environment Variables

**DO NOT commit sensitive files!** These are already in `.gitignore`:
- `.env` files
- `server/.env` files
- Database files
- API keys

**For deployment, you'll need to:**
1. Add environment variables in Vercel dashboard
2. Add environment variables in your backend hosting (Render/Fly.io)

---

## 📋 Quick Commands Reference

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## 🎯 Next Steps After GitHub Setup

1. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically!

2. **Deploy Backend:**
   - Deploy `/server` folder to Render/Fly.io
   - Update API URL in frontend

3. **Connect Domain:**
   - Add your Squarespace domain in Vercel
   - Update DNS records

---

## ✅ You're All Set!

Your Splita project is now ready for:
- ✅ Version control (Git)
- ✅ Collaboration (GitHub)
- ✅ Deployment (Vercel)
- ✅ CI/CD (automatic deployments)

---

## Need Help?

- **GitHub Docs:** https://docs.github.com
- **Git Basics:** https://git-scm.com/doc
- **Vercel + GitHub:** https://vercel.com/docs/concepts/git

