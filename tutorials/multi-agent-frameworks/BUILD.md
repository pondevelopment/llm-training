# Agentic Search Tutorial - Build Guide

## Quick Build (Recommended)

The easiest way to build is using the provided script:

```bash
cd /mnt/c/Users/zeger.knops/Documents/code/top-50-llm-questions/tutorials/agentic-search
./build.sh
```

This script:
- ✅ Switches to Node 22.15.0 automatically
- ✅ Kills any hanging Vite processes
- ✅ Cleans the dist folder
- ✅ Runs the build with correct base path
- ✅ Verifies success and shows file sizes

## Alternative Build Methods

### Using npm (if script doesn't work)

```bash
# Clean build
npm run build:clean -- --base='/tutorials/agentic-search/dist/'

# Regular build
npm run build -- --base='/tutorials/agentic-search/dist/'
```

### Manual build (if issues persist)

```bash
# 1. Switch Node version
source ~/.nvm/nvm.sh
nvm use 22.15.0

# 2. Kill any hanging processes
pkill -f vite || true

# 3. Clean and build
rm -rf dist
npx vite build --base='/tutorials/agentic-search/dist/'
```

## Troubleshooting

### Build hangs during "transforming"

**Cause:** WSL/Windows filesystem sync issues with Vite's file watcher

**Solutions:**
1. Use `./build.sh` which handles this automatically
2. Kill hanging processes: `pkill -f vite`
3. Try building with `--force` flag: `npx vite build --force --base='/tutorials/agentic-search/dist/'`

### Node version errors

**Error:** `Vite requires Node.js version 20.19+ or 22.12+`

**Solution:**
```bash
source ~/.nvm/nvm.sh
nvm use 22.15.0
```

### Dist folder not created

**Cause:** Build failed silently

**Solution:**
1. Check TypeScript errors: `npx tsc -b`
2. Look for import/dependency issues
3. Try clean build: `rm -rf dist node_modules && npm install && ./build.sh`

## Build Output

Successful build creates:
```
dist/
  index.html           (~580 bytes)
  vite.svg            (~1.5KB)
  assets/
    index-[hash].js   (~330KB)
    index-[hash].css  (~128KB)
```

## Preview URL

After building, preview at:
```
http://127.0.0.1:5501/tutorials/agentic-search/dist/index.html
```

(Assumes Live Server running on port 5501)

## Development Mode

For active development (no build needed):

```bash
npm run dev
```

Opens at `http://localhost:5173/`

**Note:** Dev mode doesn't use the GH Pages base path, so some routing may differ from production.

## CI/CD Considerations

For automated builds (GitHub Actions, etc.):

```yaml
- name: Build tutorial
  run: |
    cd tutorials/agentic-search
    npm ci
    npm run build -- --base='/tutorials/agentic-search/dist/'
```

No need for the shell script in CI - the hanging issue is specific to WSL/Windows.
