---
applyTo: "papers/manifest.json,papers/p*/**,js/paperLoader.js,all.html,updates.html"
---

# Paper authoring instructions

These instructions apply when adding or updating a paper explainer.

## Fast path (make new papers quickly)

When creating a brand new paper `XX`, follow this order to minimize rework:

1. Copy `papers/p-template/` → `papers/pXX/`.
2. Edit `papers/pXX/overview.html` first (it sets the narrative + key claims).
3. Fill `papers/pXX/interactive.html` and `papers/pXX/interactive.js` next.
4. Add the entry to `papers/manifest.json` using `dir: "./papers/pXX"`.
5. Create/update the share page `p/XX.html` from `p/_template.html`.
6. Update `all.html` (if papers are listed there) and add a short item in `updates.html`.
7. Run `npm run lint` and smoke-check the new paper in the browser.

Efficiency tip:

- Do a single search/replace pass for `pXX-` ids (e.g., `p44-...`) to keep element IDs unique and avoid collisions.

## Source of truth

- Follow `PAPER_TEMPLATE_GUIDE.md` and `PAPER_CHECKLIST.md` exactly.
- Keep diffs minimal; do not refactor unrelated files.

## Branching workflow (required)

When adding a new paper (or making significant updates to an existing paper):

- Do the work on a dedicated branch (do not commit directly to `main`).
- Use a clear name like `paper-XX-short-topic`.

## Paper “contract” (required files)

For paper **XX** (two-digit folder name `pXX`):

- `papers/pXX/overview.html` — HTML fragment (no `<html>` wrapper)
- `papers/pXX/interactive.html` — HTML fragment (no `<style>` blocks; no inline styles)
- `papers/pXX/interactive.js` — exports `interactiveScript` (see Runtime section)
- `papers/manifest.json` — entry for id `XX` (prefer `dir: "./papers/pXX"`)
- `p/XX.html` — share/unfurl page (full HTML doc; follow `.github/instructions/share-pages.instructions.md` and start from `p/_template.html`)

Encoding:

- Keep files UTF-8 with `\n` line endings so emoji/punctuation render correctly.

## Reuse existing best examples

- Use Paper 7 as the visual/layout reference for spacing and header consistency.
- Prefer copying patterns from an existing similar paper over inventing new UI.

## Manifest requirements

- Prefer the `dir` form; loader derives these paths automatically:
  - `${dir}/overview.html`
  - `${dir}/interactive.html`
  - `${dir}/interactive.js`
- Populate paper metadata used by the UI:
  - `title`, `authors` (array), `year`, `venue`, `tags` (array), `summary`
  - `interactiveTitle`
  - `relatedQuestions` (array) — verify these question ids exist

Note:

- `relatedQuestions` powers the “Build concept intuition” links in the app; keep it in sync with the question catalog.

## Runtime & loader constraints (critical)

`js/paperLoader.js` loads the interactive script by fetching text and evaluating via `new Function(...)`, then calls the exported function after injecting HTML.

Therefore:

- Do **not** auto-run interactive logic at script load time.
- Do **not** use `DOMContentLoaded` as your init trigger.
- Do export a function named `interactiveScript`.
- Do schedule init with `setTimeout(() => init(), 0)`.
- Do defensive DOM lookups (`getElementById` can be `null`).

Recommended pattern:

- IIFE + `'use strict'`
- `init()` + `updateUI()`
- `function interactiveScript(){ setTimeout(() => init(), 0); }`
- `window.interactiveScript = interactiveScript;` and `module.exports = interactiveScript;`

Debugging tip:

- If an interactive doesn’t work, check for missing/incorrect IDs first (most failures are null DOM lookups due to ID mismatches).

MathJax:

- If you inject new math markup, call `window.MathJax?.typesetPromise()` on the container you updated.

## Overview structure (keep consistent)

In `overview.html`, keep the exact section structure from `papers/p-template/overview.html`:

- Header panel (`panel panel-info`): title, authors • venue (year), “View paper” button top-right, 2–3 sentence summary, plus a nested “Plain-language explainer” card.
- Executive quick take (`panel panel-neutral`, 🧭): 2–3 sentences + 3 bullets.
- Business relevance (`panel panel-success`, 💼): stakeholder bullets + nested “Derivative example”.
- Optional supporting callouts (`panel panel-info`) in a 2-col grid.
- Key insight / Method / Implication 3-col grid.
- Evidence (`panel panel-neutral`, 🧪): cite concrete results with precise numbers.
- Roadmap (`panel panel-warning`, 🔭): actionable next steps (no generic advice).

Header layout details (don’t drift):

- Header container uses `flex items-center justify-between gap-4` (no wrapping).
- Left wrapper uses `flex-1 min-w-0`.
- “View paper” link uses `btn-soft` + `data-accent="foundations"` and `flex-shrink-0`.

## Interactive UX rules

- Use semantic theme helpers (`panel …`, `chip …`, `view-toggle`).
- No raw Tailwind color utilities and no hard-coded colors.- If custom CSS is needed for paper-specific selectors (`.pXX-*`), add it to `css/questions.css` (not `css/theme.css`).- Sane defaults: the first render should teach something.
- Don’t add no-op controls; if a factor is non-significant, mention it in text instead.
- If multiple metrics could be misread as inversely coupled, explicitly explain the relationship in UI copy.

Interactive structure & styling (from the template):

- Root wrapper must be `<section class="space-y-6" id="pXX-explorer">`.
- No `<style>` blocks in `interactive.html`, and no inline `style="..."`.
- Panel usage:
  - Controls: `panel panel-info` or `panel panel-neutral`
  - Results: `panel panel-neutral` + nested `panel panel-neutral-soft` blocks
  - Insights: `panel panel-warning` or `panel panel-success`
- Use Tailwind spacing conventions (`space-y-*`, `gap-*`) and Tailwind min-heights (e.g. `min-h-[2.75rem]`) instead of custom CSS.

Simulator expectations (when applicable):

- Use realistic scenario labels (e.g., Customer support / Product catalog / Legal discovery).
- Keep scenarios **business/workflow focused** (assume a practitioner audience). Prefer job-to-be-done names over benchmark-only labels.
- Each scenario should include ~8–10 query objects with expected hits (and optional `hint` copy for misses).
- If you change boost factors / heuristics, document assumptions inline (short comment or helper text).
- Keep coverage gauge thresholds consistent: green ≥60%, amber 30–59%, red <30%.

## Stats & correctness (non-negotiable)

- Verify exact numbers from the source paper’s tables/figures (not abstracts).
- Compute percentages yourself from the raw counts.
- Cross-check which models/systems were actually evaluated vs only mentioned.

Practical workflow:

- Extract exact metrics from the paper’s tables/figures, then write the overview text.
- Don’t rely on abstracts for numbers.

## Fast, local PDF number extraction (recommended)

When you have a paper PDF in the repo (or in `tmp/`), use the built-in helper to extract searchable text locally:

- Extract: `python .github/skills/pdf-reading/extract_pdf_text.py path/to/paper.pdf`
- Output defaults to: `tmp/<paper>.txt`

Then search the `.txt` for `Table`, `Figure`, metric names, and raw counts like `31/50`. Prefer raw counts and compute percentages yourself.

Notes:

- This uses `pypdf` if available, otherwise `pdftotext` if installed; it does not do network fetches.
- Keep derived artifacts in `tmp/`.

## Share page (`p/XX.html`) rules

- Follow `.github/instructions/share-pages.instructions.md`.

## Verification before finishing

- Run `npm run lint`.
- Hard refresh after manifest changes.
- Smoke-check:
  - `index.html` → navigate to `#paper-XX`
  - verify overview renders and interactive runs (no console errors)
  - verify related-question links work
  - open `p/XX.html` and confirm metadata/CTA
  - confirm the paper appears in `all.html` (papers list) if applicable
  - add/update a short entry in `updates.html` describing the new/revised paper
  - optional: side-by-side compare with Paper 7 for spacing/header consistency

Suggested validation order (fastest feedback first):

1. `npm run lint:repo` (catches missing/incorrect manifest/share references)
2. `npm run lint:html` (catches inline styles/raw colors in fragments)
3. `npm run lint:css` (catches theme violations)
