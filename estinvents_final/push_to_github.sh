#!/bin/bash
set -e

USERNAME="samybkr92"
REPO="estinvents"
REMOTE="https://github.com/$USERNAME/$REPO.git"

echo ""
echo "🚀 Pushing ESTINVENTS to GitHub..."
echo "→ $REMOTE"
echo ""

git init
git checkout -b main 2>/dev/null || git checkout main
git add .
git commit -m "🎉 Initial commit — ESTINVENTS full-stack platform

- React 18 + Vite frontend with dark/light mode
- Express.js + MongoDB backend
- ESTIN-only auth (x_familyname@estin.dz)
- Events, News, Professor attendance
- Full admin panel"

git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"
git push -u origin main

echo ""
echo "✅ Done! Live at: https://github.com/$USERNAME/$REPO"
echo ""
echo "📋 Next steps:"
echo "   cd backend  → cp .env.example .env → npm install → npm run seed → npm run dev"
echo "   cd frontend → npm install → npm run dev"
