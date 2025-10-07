# Quick Build Commands

## ⚡ Fast Build (Use This!)

```bash
cd /mnt/c/Users/zeger.knops/Documents/code/top-50-llm-questions/tutorials/agentic-search
./build.sh
```

## 🔧 If Build Hangs

Press `Ctrl+C` and run:

```bash
pkill -f vite
./build.sh
```

## 📋 Build Checklist

After making changes:

1. **Edit source files** in `src/`
2. **Run build**: `./build.sh`
3. **Wait ~50 seconds** for completion
4. **Check success**: Look for "✅ Build successful!"
5. **Preview**: Open http://127.0.0.1:5501/tutorials/agentic-search/dist/index.html
6. **Commit**: `git add . && git commit -m "Your message"`
7. **Push**: `git push origin agentic-search`

## 🚨 Common Issues

### "Node version error"
```bash
source ~/.nvm/nvm.sh && nvm use 22.15.0
```

### "Build hangs at transforming"
```bash
pkill -f vite
rm -rf dist
./build.sh
```

### "Permission denied: ./build.sh"
```bash
chmod +x ./build.sh
```

## 💡 Pro Tips

- **Don't wait for build output** - It takes ~50 seconds, grab coffee ☕
- **Use `pkill -f vite`** liberally - It's safe, kills hanging processes
- **Check timestamps** - `ls -lh dist/` shows if new build created
- **Hard refresh browser** - `Ctrl+Shift+R` to clear cache after rebuild
