# Testing Guide - Agentic Search Tutorial

## Quick Start

### Option 1: Test the Static Site (Tutorials Landing Page)
1. Open `tutorials/index.html` in a browser
2. Or serve from root: `python -m http.server 8000` (or `http-server`)
3. Navigate to `http://localhost:8000/tutorials/`
4. Click "Agentic Search" card to launch tutorial

### Option 2: Test the React Dev Server (Live Reload)
1. Navigate to tutorial directory:
   ```bash
   cd tutorials/agentic-search
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Open browser to `http://localhost:5173`
   - Hot reload enabled
   - React DevTools work
   - Fast iteration

### Option 3: Test the Production Build
1. Build the tutorial:
   ```bash
   cd tutorials/agentic-search
   npm run build
   ```

2. Preview production build:
   ```bash
   npm run preview
   ```

3. Or serve from root after build:
   ```bash
   cd ../..
   python -m http.server 8000
   ```
   Navigate to `http://localhost:8000/tutorials/agentic-search/dist/`

## Access Points

### Main Site
- Homepage: `index.html` → "🤖 Interactive Tutorials" button
- Direct: `tutorials/index.html` → Tutorials landing page
- Direct: `tutorials/agentic-search/` → Tutorial (after build)

### Development
- Dev server: `http://localhost:5173` (React hot reload)
- Preview: `http://localhost:4173` (production build preview)

## Current Status (Phase 0)

The tutorial shows:
- ✅ Header with theme toggle
- ✅ Welcome section
- ✅ Phase 0 complete message
- ✅ Preview cards for 5 upcoming sections
- ✅ Light/dark mode working
- ✅ Integrated with existing theme system

## Testing Phase 1 (When Ready)

Once Phase 1 (Intro section) is built:

1. **Visual Check:**
   - Side-by-side comparison renders correctly
   - Traditional search animation plays
   - Agentic search animation plays
   - Play/Pause/Reset buttons work

2. **Interaction Check:**
   - Click play → animations start
   - Click pause → animations pause
   - Click reset → animations restart
   - Toggle between views works

3. **Accessibility Check:**
   - Tab through all controls
   - Enter/Space activates buttons
   - Respects `prefers-reduced-motion`

4. **Responsive Check:**
   - Test on mobile (stacks vertically)
   - Test on tablet (side-by-side)
   - Test on desktop (full width)

## Common Issues

### "Cannot find module" errors
- Run `npm install` in `tutorials/agentic-search/`

### Theme not loading
- Check `src/styles/theme.css` exists
- Check import in `App.tsx`

### Base path issues on GH Pages
- Verify `base: '/llm-training/tutorials/agentic-search/'` in `vite.config.ts`
- Test with `npm run preview` (simulates production)

### Hot reload not working
- Check dev server is running (`npm run dev`)
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

## File Paths Reference

```
/                                    # Root (serve from here for full site)
├── index.html                       # Main homepage (has tutorial link)
├── tutorials/
│   ├── index.html                   # Tutorials landing page
│   └── agentic-search/
│       ├── index.html               # Vite entry point
│       ├── dist/                    # Built files (after npm run build)
│       └── src/
│           ├── App.tsx              # Main tutorial app
│           ├── components/
│           ├── data/
│           └── styles/
```

## Next Steps

After testing Phase 0:
1. Proceed with Phase 1 (Intro section)
2. Build `IntroSection.tsx` component
3. Create `SearchComparison.tsx` with animations
4. Test animations with play/pause/reset
5. Iterate until smooth and intuitive
