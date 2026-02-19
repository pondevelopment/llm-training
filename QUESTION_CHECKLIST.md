# Question Checklist

Use this checklist when creating or updating questions for the LLM Questions app.

## Before you start

- [ ] Review `QUESTION_TEMPLATE_GUIDE.md` for conventions and examples
- [ ] Decide the learning goal and 2–3 contrasting approaches you'll highlight
- [ ] Confirm whether you are migrating a legacy question or adding a brand new one

## File setup (new or migrated questions)

- [ ] Copy `questions/q-template/` to `questions/qXX/` (two-digit id) containing:
  - [ ] `answer.html`
  - [ ] `interactive.html`
  - [ ] `interactive.js` exporting `interactiveScript`
- [ ] Add or update the entry in `questions/manifest.json` (prefer `{ "XX": { "title": "...", "dir": "./questions/qXX", "interactiveTitle": "..." } }`)
- [ ] Update `/q/XX.html` (static share page) with complete social media meta tags:
  - [ ] Meta description explaining what the question covers and why it matters
  - [ ] Open Graph tags: `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`
  - [ ] Twitter Card tags: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
  - [ ] Use full GitHub Pages URL: `https://pondevelopment.github.io/llm-training/`
  - [ ] Use `llm_training.png` for `og:image` and `twitter:image`
  - [ ] Compelling description that explains concepts covered and practical value
  - [ ] Link points to `../index.html#question-XX`
- [ ] Ensure the question id exists in `availableQuestions` (and relevant learning paths) in `js/app.js`
- [ ] Add the question to `all.html` (titles map + path arrays) if it isn't already present

## Content development

### Title & basics

- [ ] Title is clear, specific, under ~80 characters, and follows the `XX. Question text?` pattern
- [ ] Related questions (“Recommended reading”) link to relevant ids
- [ ] Emojis are used sparingly to aid scannability (and are stored as UTF-8)

### Answer section (`answer.html`)

- [ ] Includes a core concept panel using semantic helpers (e.g., `panel panel-info`) describing the idea + analogy
- [ ] Comparison/approach panels (2–3) use semantic classes (e.g., `panel panel-success`, `panel panel-accent`) to highlight trade-offs
- [ ] “Why this matters” panel lists 3–4 concise bullets
- [ ] Optional extras (examples, callouts) use semantic HTML (`<code>`, `<ul>`, etc.)

### Interactive component (`interactive.html` + `interactive.js`)

- [ ] Use semantic containers (`panel…`, `chip…`, `view-toggle`) instead of raw Tailwind colour utilities
- [ ] Sane defaults show an informative initial state
- [ ] Controls carry helper text explaining what the user is tuning (sliders, radios, etc.)
- [ ] Visual feedback updates immediately on user input (indicator, results, legend, explanation)
- [ ] Script performs defensive DOM checks and avoids leaking globals
- [ ] `getCssVar` helper (if used) defined at **IIFE top scope**, not inside `init()`
- [ ] No raw Tailwind color utilities or hardcoded hex colors — use semantic theme classes and `getCssVar` for dynamic JS styling
- [ ] Any MathJax updates are re-typeset via `window.MathJax?.typesetPromise`

## Integration tasks

- [ ] Hard-refresh `index.html#question-XX` to ensure manifest loading works
- [ ] Verify the share page `q/XX.html`
- [ ] Check `all.html` search/filter lists the question and the Foundations/other path counts remain accurate
- [ ] Run E2E smoke test: `npx playwright test --grep "Question XX"` (both interactive and answer tests should pass)
- [ ] Update any relevant docs or cross-links referencing the question
- [ ] Add a Latest Site Update entry in `updates.html` summarising the new or revised question

## Quality gates

- [ ] No console errors while interacting with the question
- [ ] Layout holds on mobile (inspect via responsive mode or narrow window)
- [ ] Interactive logic handles edge inputs gracefully (min/max sliders, switching scenarios, etc.)
- [ ] Updated files are UTF-8 encoded so emoji and punctuation render correctly
- [ ] **`npm run lint` passes with zero errors AND zero warnings** — fix all `no-style-blocks`, `no-inline-color`, and `no-tailwind-color-utilities` issues before merging
- [ ] `npm test` passes (lint + full E2E suite); regression check confirms other questions still work

Tick each item before marking a question ready for review or publishing.
