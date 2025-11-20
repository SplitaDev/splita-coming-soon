# Push to GitHub - Quick Fix

## The Problem

Git can't authenticate with GitHub. You need to provide credentials.

## Solution 1: GitHub CLI (Easiest) ⭐

```bash
# Authenticate
gh auth login

# Follow prompts:
# - GitHub.com
# - HTTPS
# - Authenticate in browser
# - Grant permissions

# Then push
git push -u origin main
```

## Solution 2: Personal Access Token

1. **Create a token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: "Splita Project"
   - Select scope: **`repo`** (full control)
   - Click "Generate token"
   - **Copy the token immediately!**

2. **Push with token:**
   ```bash
   git push -u origin main
   ```
   - **Username**: `SplitaDev`
   - **Password**: Paste your token (not your GitHub password)

## Solution 3: SSH (If you have SSH keys)

```bash
# Switch to SSH
git remote set-url origin git@github.com:SplitaDev/splita-coming-soon.git

# Push
git push -u origin main
```

## Verify After Push

Go to: https://github.com/SplitaDev/splita-coming-soon

You should see all your files!

## Troubleshooting

**"fatal: could not read Username"**
- You need to authenticate (use one of the solutions above)

**"Permission denied"**
- Check your token has `repo` permissions
- Or verify SSH key is added to GitHub

**"Repository not found"**
- Verify the repo exists at: https://github.com/SplitaDev/splita-coming-soon
- Check you have push access

