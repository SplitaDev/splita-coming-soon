# How to Push to GitHub

Your changes are committed locally, but you need to authenticate to push to GitHub.

## Quick Setup (Choose One Method)

### Method 1: Personal Access Token (Easiest)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "Splita Project"
   - Select scope: **`repo`** (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   - When prompted for **Username**: Enter your GitHub username
   - When prompted for **Password**: Paste the token (not your GitHub password)

### Method 2: Install GitHub CLI (Recommended for future)

1. **Install GitHub CLI:**
   ```bash
   brew install gh
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   ```
   - Follow the prompts to authenticate

3. **Push:**
   ```bash
   git push -u origin main
   ```

### Method 3: Switch to SSH

If you have SSH keys set up with GitHub:

```bash
git remote set-url origin git@github.com:SplitaDev/splita-coming-soon.git
git push -u origin main
```

## Current Status

✅ **Committed locally**: All changes are committed  
✅ **Remote configured**: `https://github.com/SplitaDev/splita-coming-soon.git`  
⏳ **Waiting for**: Authentication to push

## After Pushing

Once you successfully push, you can:
- View your code at: https://github.com/SplitaDev/splita-coming-soon
- Set up GitHub Actions for CI/CD
- Collaborate with others
- Deploy from GitHub

## Troubleshooting

**"fatal: could not read Username"**
- You need to authenticate (use one of the methods above)

**"Permission denied"**
- Make sure your token has `repo` permissions
- Or verify your SSH key is added to GitHub

**"Repository not found"**
- Make sure the repository exists at: https://github.com/SplitaDev/splita-coming-soon
- Verify you have push access to the repository

