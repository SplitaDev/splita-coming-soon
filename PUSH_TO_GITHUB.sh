#!/bin/bash
# Script to push Splita project to GitHub

echo "🚀 Pushing Splita to GitHub..."
echo ""

# Check if remote exists
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote 'origin' already exists"
    git remote -v
    echo ""
    echo "Pushing to GitHub..."
    git push -u origin main
else
    echo "❌ No remote repository found"
    echo ""
    echo "Please create a GitHub repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: splita-coming-soon"
    echo "3. DO NOT initialize with README"
    echo "4. Click 'Create repository'"
    echo ""
    echo "Then run these commands:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/splita-coming-soon.git"
    echo "  git push -u origin main"
fi

