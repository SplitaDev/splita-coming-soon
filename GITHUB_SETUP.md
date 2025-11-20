# Add Project to New GitHub Repository

## Quick Setup

### Step 1: Create New Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `splita-coming-soon` (or your choice)
3. Description: "Splita coming soon page"
4. Choose **Public** or **Private**
5. **IMPORTANT**: Do NOT check "Add a README file"
6. Do NOT add .gitignore or license
7. Click **"Create repository"**

### Step 2: Connect and Push

After creating the repo, GitHub will show you commands. Use these:

```bash
# Remove old remote (if any)
git remote remove origin

# Add your new repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Ensure you're on main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details.

### Step 3: Verify

Go to your repository on GitHub - you should see all your files!

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh repo create splita-coming-soon --public --source=. --remote=origin --push
```

This creates the repo and pushes in one command!

## Troubleshooting

**"remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**"Authentication failed"**
- You need to authenticate with GitHub
- Use a Personal Access Token (see GITHUB_PUSH_GUIDE.md)
- Or use GitHub CLI: `gh auth login`

## After Pushing

Once your code is on GitHub, you can:
- Deploy to Render (see DEPLOY.md)
- Set up CI/CD
- Collaborate with others
- Track changes

