# Tutorials

This directory contains interactive tutorials built with modern web frameworks.

## Agentic Search Tutorial

**Path**: `/tutorials/agentic-search/`  
**Tech Stack**: React + TypeScript + Vite + Tailwind CSS + Framer Motion  
**Build Output**: `/tutorials/agentic-search/dist/`

### Local Development

```bash
cd tutorials/agentic-search
npm install
npm run dev
```

Access at: `http://localhost:5173`

### Building for Production

```bash
cd tutorials/agentic-search
./build.sh
```

Or manually:
```bash
npm run build
```

The build outputs to `dist/` with a configured base path of `/tutorials/agentic-search/dist/` for GitHub Pages compatibility.

### Deployment



The tutorial is automatically built and deployed via GitHub Actions when changes are pushed to `main`. The workflow:

1. Checks out the repository
2. Installs Node.js 22
3. Builds the Agentic Search tutorial
4. Deploys everything to GitHub Pages

**Live URL**: `https://pondevelopment.github.io/llm-training/tutorials/agentic-search/dist/`

### Structure

- `src/` - React components, data, and styling
- `dist/` - Build output (gitignored, generated on deploy)
- `build.sh` - Local build script with process cleanup
- `BUILD.md` - Detailed build documentation
- `QUICK_BUILD.md` - Quick reference for common build tasks

### Adding New Tutorials

1. Create a new directory under `tutorials/`
2. Set up your framework/build system
3. Configure base path for GitHub Pages
4. Update `.github/workflows/deploy.yml` to build the new tutorial
5. Add documentation here

## Notes

- All tutorials use the shared theme system from `/css/theme.css`
- The main site is static HTML/CSS, tutorials are separate sub-apps
- Each tutorial builds independently and is deployed to its own subdirectory
