# Local Testing Guide for Agentic Search Tutorial

## Problem
The Vite dev server requires Node.js 20.19+ but you have 20.2.0.

## Solutions

### Option 1: Use Vite Preview (RECOMMENDED)
After building, use the preview server which works with your Node version:

```bash
cd tutorials/agentic-search
npm run build
npm run preview
```

Then access: `http://localhost:4173/llm-training/tutorials/agentic-search/`

### Option 2: Use Your Static Server (Current Setup)
Build with local base path and access through your static server:

```bash
cd tutorials/agentic-search
npx vite build --base='/tutorials/agentic-search/dist/'
```

Then access: `http://127.0.0.1:5501/tutorials/agentic-search/dist/index.html`

### Option 3: Use Local Dev Build (Simplest)
Build for local development without base path:

```bash
cd tutorials/agentic-search
npx vite build --base='./'
```

Then copy `dist/index.html` contents to any local server path.

### Option 4: Upgrade Node.js (Best Long-term)
Upgrade Node.js to 20.19+ or 22.12+ to use `npm run dev` for hot reloading.

## Current Status
✅ Production build completed in `tutorials/agentic-search/dist/`
✅ Files are ready to be served

## Quick Test
Try this URL now:
**`http://127.0.0.1:5501/tutorials/agentic-search/dist/index.html`**
