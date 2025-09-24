# Question Template Guide

This guide explains how to create new questions and keep them consistent with the app's conventions. Follow it alongside the checklist whenever you add or revise a question.

## Repository layout

```
questions/
  manifest.json                 # Maps question ids to their asset folders
  q-template/                   # Copy to qXX/ when starting a new question
    answer.html
    interactive.html
    interactive.js
  q57/
    answer.html
    interactive.html
    interactive.js
```

Static share pages still live under `/q/N.html`. Use `q/_template.html` as a reference when adding new ones.

## Loader expectations

The client fetches `/questions/manifest.json` to discover question assets. Each entry should point to a `dir` (preferred) or explicit paths:

```json
{
  "57": {
    "title": "57. …?",
    "dir": "./questions/q57",
    "interactiveTitle": "…"
  }
}
```

`dir` tells the loader to grab `answer.html`, `interactive.html`, and `interactive.js` from that folder. Only fall back to explicit `answerPath`/`interactive` overrides when you need to share assets across questions.

## Authoring workflow

1. **Copy the template folder:** duplicate `questions/q-template/` to `questions/qXX/` (two-digit id).
2. **Answer content (`answer.html`):** plain HTML fragment, no `<html>` wrapper. Follow the visual pattern—recommended reading panel ? core concept panel ? comparison panels ? “Why this matters”. Emojis are encouraged when they improve scannability.
3. **Interactive markup (`interactive.html`):** use the semantic helpers (`panel …`, `chip …`, `view-toggle`) for inputs and outputs. Keep helper text beneath controls when intent isn't obvious.
4. **Interactive behaviour (`interactive.js`):** export a function named `interactiveScript` (CommonJS + browser global). Use defensive DOM lookups and keep state local. If the script needs to re-typeset MathJax, call `window.MathJax?.typesetPromise` on the relevant node.
5. **Manifest entry:** add/update the question in `questions/manifest.json` using the `dir` form. Include `interactiveTitle` so the app can show a friendly label in the sidebar.
6. **Share page:** update `/q/XX.html` so static unfurl links match the new title/description.
7. **App wiring:** make sure `availableQuestions` in `js/app.js` contains the id. Update curated learning paths if needed.

## Content structure tips

- Headings: `h4` for section titles, `h5` for cards, `p` for descriptive text.
- Use the shared semantic helpers (`panel panel-info`, `panel panel-success panel-emphasis`, `chip chip-info`) rather than raw Tailwind colour utilities such as `bg-indigo-50` or `border-blue-200`.
- Keep paragraphs concise (2–3 sentences) and lean on lists for quick scanning.
- Prefer semantic HTML (`<ul>`, `<li>`, `<code>`) over custom spans.

## Interactive design guidelines

- Provide sensible defaults so the first render is informative.
- Surface helper text directly under controls (sliders, radios, toggles).
- Use accessible labels/`aria-` attributes when the default markup isn't enough.
- Write modular code: factor complex calculations into helpers to stay readable.
- When adding asynchronous behaviour, guard against duplicate requests and race conditions.
- Keep styling token-driven: rely on semantic helpers or CSS variables instead of inline colours, and only wire up theme-change hooks when a design truly cannot be expressed in CSS.

## Emoji and encoding

All project files are stored as UTF-8 with `\n` line endings. When copying template snippets, make sure your editor retains UTF-8 so emoji (??, ??, etc.) render correctly rather than as fallback characters.

## Testing checklist

- Load `index.html#question-XX` with a hard refresh to verify the manifest entry resolves correctly.
- Test the share page `q/XX.html`.
- Ensure the question appears in `all.html` (update the titles map and any curated path arrays).
- Verify slider/radio states persist visually and reset when scenarios change.
- Check the console for errors while interacting with inputs.

## Maintaining older questions

Legacy `questions/question-XX.js` modules have been retired. If you discover one, migrate it to the folder/manifest pattern above and remove the JS shim.

> Neutral surfaces and typography should use the shared tokens in `css/theme.css` (e.g., `bg-card`, `bg-surface`, `text-heading`, `text-muted`, `border-divider`).
