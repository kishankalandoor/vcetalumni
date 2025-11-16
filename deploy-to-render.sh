#!/bin/bash

# 🚀 Quick Render Deployment Script

echo "📋 VCET Alumni Hub - Render Deployment Helper"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Create .gitignore if not exists
if [ ! -f .gitignore ]; then
    echo "🔧 Creating .gitignore..."
    cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
uploads/profiles/*
!uploads/profiles/.gitkeep
uploads/posts/*
!uploads/posts/.gitkeep
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log
.vscode/
.idea/
database-export.sql
EOF
    echo "✅ .gitignore created"
fi

# Add all files
echo ""
echo "📦 Adding files to Git..."
git add .

# Commit
echo ""
echo "💾 Committing changes..."
git commit -m "Prepare for Render deployment" || echo "⚠️  No changes to commit"

echo ""
echo "=============================================="
echo "✅ READY FOR DEPLOYMENT!"
echo "=============================================="
echo ""
echo "📝 NEXT STEPS:"
echo ""
echo "1. Create a GitHub repository"
echo "   → Go to: https://github.com/new"
echo ""
echo "2. Push your code:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Follow RENDER_DEPLOYMENT.md guide"
echo "   → Open: RENDER_DEPLOYMENT.md"
echo ""
echo "4. Deploy on Render:"
echo "   → Go to: https://dashboard.render.com"
echo "   → Click 'New +' → 'Web Service'"
echo "   → Connect your GitHub repo"
echo ""
echo "📄 Environment variables template: .env.render"
echo "📖 Full guide: RENDER_DEPLOYMENT.md"
echo ""
