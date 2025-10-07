#!/bin/bash

# Agentic Search Tutorial - Build Script
# Handles common build issues with WSL/Windows filesystem

set -e  # Exit on error

echo "🚀 Starting build process..."

# 1. Ensure we're using the right Node version
echo "📦 Checking Node version..."
source ~/.nvm/nvm.sh
nvm use 22.15.0

# 2. Kill any hanging vite processes
echo "🧹 Cleaning up any hanging processes..."
pkill -f vite || true
sleep 2

# 3. Clear any stale dist folder
echo "🗑️  Removing old dist folder..."
rm -rf dist

# 4. Run the build
echo "🔨 Building..."
npm run build -- --base='/tutorials/agentic-search/dist/'

# 5. Verify build succeeded
if [ -f "dist/index.html" ]; then
    echo "✅ Build successful!"
    echo "📊 Build artifacts:"
    ls -lh dist/
    echo ""
    echo "📦 Asset sizes:"
    du -h dist/assets/* | sort -h
    echo ""
    echo "🌐 Preview at: http://127.0.0.1:5501/tutorials/agentic-search/dist/index.html"
else
    echo "❌ Build failed - dist/index.html not found"
    exit 1
fi
