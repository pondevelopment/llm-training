# Copilot instructions (llm-training)

This repo is a static, single-page learning site (HTML/JS/CSS) that loads question/paper assets dynamically via manifests.

## Always follow the repo source-of-truth docs

Before creating or editing content, consult:

- `QUESTION_TEMPLATE_GUIDE.md`
- `QUESTION_CHECKLIST.md`
- `PAPER_TEMPLATE_GUIDE.md`
- `PAPER_CHECKLIST.md`
- `AGENTS.md`

If anything here conflicts with those docs, follow the docs.

## Core constraints (don’t break these)

- Keep diffs minimal and consistent with existing patterns.
- Don’t add secrets, tokens, or private data.
- Don’t introduce new dependencies unless explicitly asked.
- Avoid unsolicited network fetches.
- Preserve UTF-8 + `\n` line endings (emoji and punctuation must render correctly).

## Design system rules

- Prefer the shared semantic helpers for theming:
  - Panels: `panel panel-info|panel-neutral|panel-success|panel-warning|panel-neutral-soft`
  - Chips: `chip chip-*`
  - Toggles: `view-toggle`
- Avoid raw Tailwind color utilities (e.g. `bg-indigo-50`, `border-blue-200`) and hard-coded colors.
- In interactive HTML fragments: no `<style>` blocks and no inline styles.
- In JavaScript-generated inline styles: avoid CSS variables like `style="color: var(--...)"` (not reliable cross-browser). Use theme classes instead; if truly unavoidable, use literal values.

## Repository structure and “contracts”

### Questions

- Each question lives in `questions/qXX/` with:
  - `answer.html` (HTML fragment)
  - `interactive.html` (HTML fragment)
  - `interactive.js` (exports `interactiveScript`)
- Manifest entry required in `questions/manifest.json`, prefer:
  - `{ "XX": { "title": "…", "dir": "./questions/qXX", "interactiveTitle": "…" } }`
- Share page required in `q/XX.html` (static unfurl page). Keep meta tags up-to-date.
- App wiring:
  - Ensure the id exists in `availableQuestions` (and learning paths) in `js/app.js`.
  - Ensure `all.html` and `updates.html` remain consistent with the catalog.

### Papers

- Each paper lives in `papers/pXX/` with:
  - `overview.html` (HTML fragment)
  - `interactive.html` (HTML fragment)
  - `interactive.js` (exports `interactiveScript`)
- Manifest entry required in `papers/manifest.json`, prefer `dir` form.
- Share page required in `p/XX.html`.

### Tutorials

Tutorials are standalone React/Vite sub-apps under `tutorials/<name>/`. Unlike questions/papers (HTML fragments), tutorials are full SPAs with their own build systems.

Structure:
- `tutorials/<name>/` — source code (React + TypeScript + Tailwind)
- `tutorials/<name>/dist/` — built output (committed for GitHub Pages)
- `tutorials/index.html` — index page linking all tutorials
- `tutorials/README.md` — documentation for all tutorials

Key patterns:
- **Section-based navigation**: Use hash routing (`#methods`, `#pricing`, etc.) for deep-linkable sections
- **Landing page**: Overview with clickable section cards, each showing icon, title, and brief description
- **Intro panels**: Each section starts with a `Panel variant="info"` explaining what the section covers before diving into jargon
- **Completion view**: Dedicated `#completion` route with summary of learnings, next steps, and links to other tutorials
- **Interactive simulators**: Sliders, calculators, and visualizations with sensible defaults that teach on initial render
- **Real-world examples**: Clickable cards that load values into calculators; use cost tiers (`$`/`$$`/`$$$`) instead of exact prices on tiles
- **Provider/option cards**: Include pros/cons lists and "Best for" summaries

Build constraints:
- Configure Vite base path: `/llm-training/tutorials/<name>/dist/`
- Import main site theme: `import '../../../css/theme.css'`
- Add tutorial-specific styles in `src/styles/tutorial.css`
- Use shared components: `Panel`, `Chip` from `./components/shared/`

Adding a new tutorial:
1. Create `tutorials/<name>/` with Vite + React + TypeScript setup
2. Configure `vite.config.ts` with correct base path
3. Update `.github/workflows/deploy.yml` to build the tutorial
4. Add card to `tutorials/index.html`
5. Add entry to `tutorials/README.md` table and description section

## Loader/runtime constraints (VERY IMPORTANT)

Both loaders (`js/questionLoader.js`, `js/paperLoader.js`) work like this:

1. Fetch `questions/manifest.json` or `papers/manifest.json`.
2. Fetch HTML fragments (`answer.html` / `overview.html`, `interactive.html`).
3. Fetch `interactive.js` as text and `eval` it via `new Function`.
4. Insert HTML into the DOM.
5. Only then call `interactiveScript()`.

Because of that:

- **Do not auto-initialize interactives** on `DOMContentLoaded` or immediately at module load.
- **Do export a function** named `interactiveScript` and let the loader call it.
- **Do defensive DOM lookups**: every `getElementById` can return `null` on first call; fail soft.

Recommended pattern inside each `interactive.js`:

- Wrap in an IIFE and `'use strict'`.
- Implement `init()` and `updateUI()` helpers.
- Export a top-level `interactiveScript()` function that schedules `init()` after the loader inserts HTML:
  - `setTimeout(() => init(), 0)`
- Attach helpers for debugging/testing:
  - `interactiveScript.init = init; interactiveScript.updateUI = updateUI;`
- Make it available in both environments:
  - `window.interactiveScript = interactiveScript;`
  - `module.exports = interactiveScript;`

MathJax:

- If the interactive injects new math markup, call `window.MathJax?.typesetPromise()` on the relevant container.

## Content + UX guidelines

- Provide sensible defaults so the initial render teaches something.
- Put helper text directly under controls.
- Keep controls meaningful: if a variable was tested but is not significant, **don’t** add a no-op slider; mention it in text instead.
- When displaying statistical results, prefer plain-language strength labels over p-value star notation.
- For multi-metric displays, explain relationships explicitly so users don’t assume inverse coupling.
- Follow the “slider UX” and “metric ordering” principles in `AGENTS.md`.

## Verification (run before finishing)

- **Full check:** run `npm test` (lint + Playwright E2E for all papers and questions).
- **Single item:** `npx playwright test --grep "Paper 07"` or `npx playwright test --grep "Question 12"`.
- Smoke:
  - Load `index.html` and navigate to the updated question/paper.
  - Hard refresh after manifest/asset changes.
  - Check browser console for errors.
  - Verify share pages (`q/XX.html`, `p/XX.html`).
  - Verify the directory-manifest-assets are in sync.
- **CI:** `.github/workflows/ci.yml` runs lint + E2E on every push/PR to `main`.

## What NOT to do

- Don’t add extra pages/modals/features unless requested.
- Don’t refactor unrelated files.
- Don’t hard-code new colors or typography.
- Don’t rely on auto-init scripts; loaders control timing.
