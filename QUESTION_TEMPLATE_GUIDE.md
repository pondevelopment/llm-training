# Question Template Guide

This guide explains how to create new questions and keep them consistent with the app’s conventions. Follow it alongside the checklist whenever you add or revise a question.

## Repository layout

```
questions/
  question-57.js              # Lightweight shim (CommonJS export)
  q57/                        # Question assets live in their own folder
    answer.html               # Main static content
    interactive.html          # Interactive markup
    interactive.js            # Interactive behaviour (exports a function)
manifest.json                 # Maps question ids to their asset folders
```

Static share pages still live under `/q/N.html`. Use `q/_template.html` as a reference when adding new ones.

## Loader expectations

The client fetches `/questions/manifest.json` to discover question assets. Each entry can either

- reference a `dir` (preferred): the loader automatically looks for `answer.html`, `interactive.html`, and `interactive.js` inside that folder; or
- provide explicit `answerPath`, `interactive.htmlPath`, and `interactive.scriptPath` overrides.

Every question keeps a small `questions/question-XX.js` shim so existing tooling (and older links) continue to work. The shim should export a helpful placeholder and a clear title, but the real content comes from the manifest entry.

## Authoring workflow

1. **Create the folder:** `questions/qXX/` (two-digit id).
2. **Answer content (`answer.html`):** plain HTML fragment, no `<html>` wrapper. Stick to the established visual pattern: recommended reading box → core concept (blue) → comparison cards → “Why this matters”. Emoji are encouraged for scannability but keep them purposeful.
3. **Interactive markup (`interactive.html`):** HTML fragment for inputs, sliders, radios, results, etc. Include short helper text beneath controls when the intent may not be obvious.
4. **Interactive behaviour (`interactive.js`):** export a function `interactiveScript` (CommonJS + browser global). Use defensive DOM lookups and keep state local. If the script needs to re-typeset MathJax, call `window.MathJax?.typesetPromise` on the relevant node.
5. **Manifest entry:** add the new question to `questions/manifest.json`. The preferred form is:
   ```json
   {
     "57": {
       "title": "57. …?",
       "dir": "./questions/q57",
       "interactiveTitle": "…"
     }
   }
   ```
   You may still use the legacy `answerPath` / `interactive` object when necessary (e.g., sharing assets between questions), but keep it consistent.
6. **Shim update:** keep `questions/question-57.js` as a short placeholder that exports the title and a small hint that content loads dynamically.
7. **Share page:** add or update `/q/57.html` so the static unfurl links match the new title and description.

## Content structure tips

- Headings: `h4` for section titles, `h5` for cards, `p` for descriptive text.
- Use Tailwind utility classes already present in the code base (`bg-indigo-50`, `border-l-4`, etc.).
- Keep paragraphs concise (2–3 sentences) and lean on lists for quick scanning.
- Prefer semantic HTML (`<ul>`, `<li>`, `<code>`) over custom spans.

## Interactive design guidelines

- Provide sensible defaults so first render is informative.
- Surface helper text directly under controls (e.g., slider explanations).
- Use accessible labels/`aria-` attributes when the default markup isn’t enough.
- Write modular code: derive derived values in small helper functions to stay readable.
- When adding asynchronous behaviour, guard against duplicate requests and race conditions.

## Emoji and encoding

All project files are stored as UTF-8 with `
` line endings. When copying template snippets, make sure your editor retains UTF-8 so emoji (🎯, 🧠, etc.) render correctly rather than as fallback characters.

## Testing checklist

- Load `index.html#question-XX` with a hard refresh to verify the manifest entry resolves correctly.
- Test the share page `q/XX.html`.
- Ensure the question appears in `all.html` (update the titles map and any curated path arrays).
- Verify slider/radio states persist visually and reset when scenarios change.
- Check the console for errors while interacting with inputs.

## Maintaining older questions

Not every existing question has been migrated yet. When you touch a legacy `questions/question-XX.js`, consider moving it to the folder/manifest pattern described above. Keep the diff focused—migrate one question per change so reviews stay manageable.
