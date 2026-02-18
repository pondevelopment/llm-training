# AI Coding Assistant## Quality gates (run before you're done)

- Build: ensure the static site loads without console errors (hard refresh when testing manifest updates).
- Lint/Type: match existing patterns; avoid new globals and unused vars.
- Tests: run `npm test` (lint + Playwright E2E). To test a single item: `npx playwright test --grep "Paper 07"` or `npx playwright test --grep "Question 12"`.
- Smoke: verify the specific question/page impacted renders and interacts as intended (including `all.html` and the share page).
- Visual check: Use `open_simple_browser` to compare converted pages side-by-side with reference pages (e.g., compare Paper 8 vs Paper 7 headers, spacing, padding) to ensure structural consistency.m Prompt (Repository: llm-training)

Purpose: Provide consistent, high-signal instructions for AI-assisted coding in this repository. Use this as the system-level pre-prompt when generating, editing, or reviewing code and docs.

## Required references

- Question Template Guide: [QUESTION_TEMPLATE_GUIDE.md](./QUESTION_TEMPLATE_GUIDE.md)
- Question Checklist: [QUESTION_CHECKLIST.md](./QUESTION_CHECKLIST.md)
- Paper Template Guide: [PAPER_TEMPLATE_GUIDE.md](./PAPER_TEMPLATE_GUIDE.md)
- Paper Checklist: [PAPER_CHECKLIST.md](./PAPER_CHECKLIST.md)

Always consult these when creating or updating any question or paper. They are the source of truth for structure, styling, MathJax, interactivity, and the per-asset directory/manifest layout.

## Operating principles

- Be decisive: proceed with 1–2 reasonable assumptions if details are missing; state them briefly.
- Keep changes minimal: small, focused diffs that preserve existing style and public APIs unless change is requested.
- Teach-by-default: when making non-trivial edits, add short inline comments where helpful (avoid noise).
- Be concise: avoid filler; keep explanations skimmable and action-oriented.
- Respect security and policy: never add secrets; don’t exfiltrate or fetch network resources unless requested.

## Quality gates (run before you’re done)

- Build: ensure the static site loads without console errors (hard refresh when testing manifest updates).
- Lint/Type: match existing patterns; avoid new globals and unused vars.
- Tests: run `npm test` (lint + Playwright E2E). To test a single item: `npx playwright test --grep "Paper 07"` or `npx playwright test --grep "Question 12"`.
- Smoke: verify the specific question/page impacted renders and interacts as intended (including `all.html` and the share page).

## Coding guidelines

- Consistency over novelty: follow existing patterns, naming, and structure (per-question folders, manifest entries, UTF-8 files).
- Prefer the shared semantic helpers (`panel…`, `chip…`, `view-toggle`) for theming; avoid raw Tailwind colour utilities.
- Minimal dependencies: prefer standard APIs; if adding a dep, justify and pin versions.
- Error handling: defensive DOM lookups; fail soft with clear messages in UI.
- Accessibility: keyboard reachable, sufficient contrast, clear labels and helper text.
- Performance: avoid unnecessary reflows, heavy loops in hot paths, and oversized assets.
- **Statistics accuracy:** Always verify exact numbers from source papers (tables/figures), not abstracts. Calculate percentages yourself from raw counts. Use grep/search in PDFs to find precise values like "100% (50/50)" or "62% (31/50)". Note: workspace search tools may ignore `tmp/` by default; when verifying numbers from extracted text/PDFs, open the `tmp/` file directly or enable searching ignored files.
- **Model/system lists:** Cross-check which models/systems were actually tested vs. mentioned in other contexts. Don't assume—verify in methodology sections.
- **Statistical presentation - plain language over technical notation:** When displaying statistical results (regression coefficients, p-values, effect sizes, significance levels):
  - Replace technical notation with plain language: `*** p<0.001` → "Very strong", `** p<0.01` → "Strong", `n.s./p>0.05` → "Not significant"
  - Add brief explanations in footers: "β (beta) shows how much each factor affects the outcome" instead of just "*** p<0.001, ** p<0.01"
  - Use color coding for clarity: green (positive significant), red (negative significant), blue (moderate), gray (non-significant)
  - Use monospace fonts (`font-mono`) for numeric coefficients but regular text for strength labels
  - Structure as `<div class="text-right"><span class="font-mono">β=0.267</span><span class="text-xs text-success ml-2">Very strong</span></div>`
- **Non-significant variables in interactives:** If a study tested a variable but found it wasn't a significant predictor, don't include it as an interactive control. Sliders/inputs that don't affect outcomes confuse users. Mention in overview text that the variable was tested but not significant rather than including a non-functional control.

## Question workflow reminders

- Each question lives in `questions/qXX/` with `answer.html`, `interactive.html`, and `interactive.js`.
- Update `questions/manifest.json` and the `questions/qXX/` asset folder together (answer, interactive HTML, interactive JS).
- Ensure `all.html` lists the question and any curated learning paths include the id.
- Share pages remain under `/q/XX.html` and must match the latest title/description.

## Tutorial workflow reminders

Tutorials are standalone React/Vite SPAs under `tutorials/<name>/`. They differ from questions/papers which are HTML fragments loaded by a shared loader.

### Structure

- `tutorials/<name>/src/` — React source code
- `tutorials/<name>/dist/` — built output (committed for GitHub Pages)
- `tutorials/<name>/src/components/` — section components (e.g., `MethodsSection.tsx`, `PricingSection.tsx`)
- `tutorials/<name>/src/data/` — data files for simulators and calculators

### Key UX patterns established

- **Intro panels**: Each section starts with a `Panel variant="info"` that explains what the section covers in plain language before diving into technical content. This helps users understand context without getting overwhelmed.
- **Completion view**: Use a dedicated `#completion` route (e.g., `CompletionSection.tsx`) instead of looping back to landing. Include: what you learned (4 boxes summarizing sections), next steps (practical actions), related tutorials (links), and action buttons.
- **Real-world examples with cost tiers**: On example cards, use `$`/`$$`/`$$$` indicators instead of exact dollar amounts. Exact prices go in calculators that the cards load when clicked. Add legend explaining tiers (e.g., `$ = under $20 · $$ = $20–$500 · $$$ = $500+`).
- **Clickable examples that load calculators**: Make example cards clickable with visual feedback (ring highlight, "✓ Loaded" badge). Set multiple related state values (e.g., update BOTH token calculator AND hourly calculator) to give complete picture.
- **Provider cards with pros/cons**: When comparing options (providers, methods, tools), include pros array, cons array, and "Best for" summary. Display top 3 pros and top 2 cons to keep cards scannable.
- **Section navigation**: Show prev/next buttons at bottom of each section. Hide for landing and completion views. Use hash-based routing for deep-linkable sections.

### Adding a new tutorial

1. Create `tutorials/<name>/` with Vite + React + TypeScript setup
2. Configure `vite.config.ts` with base path: `/llm-training/tutorials/<name>/dist/`
3. Import main site theme: `import '../../../css/theme.css'`
4. Create shared components (`Panel.tsx`, `Chip.tsx`) or copy from existing tutorial
5. Add routes for landing, each section, and completion views
6. Build with `npm run build` and commit `dist/` folder
7. Update `.github/workflows/deploy.yml` build step
8. Add card to `tutorials/index.html`
9. Add entry to `tutorials/README.md` table and description section

## Commit & PR conventions

- Only commit and push when the user explicitly requests it and after local testing passes.
- Before committing, run Quality gates (Build/Lint/Tests/Smoke) and fix blockers.
- Commit messages: imperative mood, succinct summary, optional bullet details.
  - Example: "Q16: Replace free text with controlled dropdown; tidy explanation; Unicode-aware split"

## Ask vs. assume

- Ask a clarifying question only when truly blocked.
- Otherwise: proceed with clearly stated assumptions and continue to a working end-to-end change.

## Secrets & data

- Never commit credentials, tokens, or private keys.
- Use placeholders and document required env vars separately.

## Tooling & environment

- Static site served locally (e.g., simple HTTP server). Avoid environment-specific commands unless verified.
- No unsolicited network calls. Prefer local actions first.
- Assume a live test server is running at <http://127.0.0.1:5501> for smoke checks unless stated otherwise.

## Test infrastructure

The repo has end-to-end tests powered by [Playwright](https://playwright.dev/).

- **Location:** `tests/e2e/` — papers in `papers/paper-smoke.spec.ts`, questions in `questions/question-smoke.spec.ts`.
- **Page Object Models:** `fixtures/paper-page.ts` and `fixtures/question-page.ts` encapsulate selectors and actions.
- **Run locally:** `npm test` (lint + E2E) or `npx playwright test` (E2E only). The Playwright `webServer` config auto-starts Vite on port 5501.
- **Run a single item:** `npx playwright test --grep "Paper 07"` or `npx playwright test --grep "Question 12"`.
- **UI mode:** `npm run test:e2e:ui` opens Playwright's interactive runner.
- **CI:** `.github/workflows/ci.yml` runs lint + E2E on every push/PR to `main` using bundled Chromium. HTML reports are uploaded as artifacts.
- **Config:** `playwright.config.ts` at repo root; CI-aware (conditional `channel`, `workers`, `reporter`, `retries`).

When adding a new paper or question, the smoke tests auto-discover it from the manifest — no test file edits needed.

## Implementation reminders

- When touching the manifest or loader, hard-refresh or clear caches so new assets load correctly.
- Keep `interactive.js` exports pure functions and avoid polluting `window` unless explicitly required.
- Ensure all files remain UTF-8 encoded with `\n` line endings so emoji and punctuation render correctly.
- Park temporary downloads or scratch exports under `tmp/` (gitignored) and delete them before you ship changes.
- **Infographic handling:** If a paper has an infographic (`papers/pXX/infographic.png`), embed it as a collapsible `<details>` section in `overview.html` between the header and executive quick take. Always use `loading="lazy"` and `decoding="async"` on the `<img>`, wrap in `<a target="_blank">` for full-size viewing, and keep it collapsed by default to avoid loading multi-MB images eagerly. See `PAPER_TEMPLATE_GUIDE.md § Infographic assets` for the full HTML pattern. Additionally, use the infographic as the `og:image` and `twitter:image` in the share page (`p/XX.html`) instead of the generic `og-image.png`.
- **CSS variables in JavaScript-injected inline styles:** Avoid `var(--color-name)` in `style=""` attributes generated by JS—they don't reliably resolve across browsers. Use the `getCssVar` helper (see below) or direct hex/RGB/HSL fallback values (e.g., `#6366f1` not `var(--color-accent-strong)`). For static HTML, CSS variables work fine in stylesheet rules.
- **`getCssVar` helper for theme-aware JS colors:** When JavaScript needs to set colors dynamically (e.g., bar fills, SVG strokes, conditional styling), use the shared `getCssVar` helper with a hardcoded fallback:
  ```javascript
  const getCssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };
  // Usage: element.style.color = getCssVar('--tone-emerald-strong', '#10b981');
  ```
  **Critical:** Define `getCssVar` at **IIFE top scope** (after `'use strict'`), never inside `init()`. Functions like `updateUI()`, `renderChart()`, etc. run outside `init()` and need access. Defining it inside `init()` causes `ReferenceError` in sibling functions.
- **SVG template literals with getCssVar:** When building SVG strings in template literals, always wrap `getCssVar()` calls in `${}` interpolation **and** quote the attribute value: ``stroke="${getCssVar('--color-border', '#e5e7eb')}"`` not ``stroke=getCssVar('--color-border', '#e5e7eb')``.
- **Slider UX principle:** Design sliders so that sliding RIGHT (toward 100%) improves the outcome users care about. Frame as "gap" or "improvement potential" rather than "capability" when modeling inverse relationships. Example: "Baseline gap (room for improvement)" where 100% = huge benefit opportunity, not "Baseline capability" where 100% = no benefit opportunity. Users expect rightward motion to be positive.
- **Metric ordering principle:** When displaying multiple outcome metrics, order them best-to-worst (top-to-bottom or left-to-right). Put positive outcomes (green, "higher is better") first, neutral outcomes (amber) middle, negative outcomes (red, "lower is better") last. This creates correct visual hierarchy and positive feedback as users improve configurations.
- **Baseline vs mitigation distinction:** When baseline shows high scores on seemingly positive metrics (e.g., 100% compliance), clarify if this is indiscriminate behavior (bad) vs selective behavior (good). Use color coding: amber/warning for problematic baseline patterns, green/success for desired mitigation outcomes. Update entire DOM elements with status messages, not just inner tags, to prevent hardcoded text from persisting.
- **Explaining metric relationships:** When showing two related but independent metrics (e.g., "compliance with invalid" + "compliance with valid"), users may assume inverse relationship. Add explicit explanatory text: "Success means: Low [metric A] + high [metric B] = [desired outcome]." This prevents misinterpretation when partial solutions show moderate scores on both.
- **Interactive comparison/trade-off displays:** When showing cost vs. performance trade-offs or similar comparisons: Use 4-box layouts showing baseline metric, comparison metric, difference, and impact (e.g., cost/accuracy/savings/accuracy-gain). Make difference calculations intuitive: `selected - comparison` so positive = more expensive/better. Use dynamic labels that change based on context ("Monthly savings" vs "Monthly cost increase" vs "Cost difference"). Color code consistently: green for better outcomes, red for worse, neutral for same. Show both absolute differences ($ amounts, percentage points) and relative percentages. Place most important metric (usually the trade-off comparison) in rightmost position for emphasis.
- **Table vs. chart visualization choice:** When data variance is low or points overlap heavily, prefer sorted tables over scatter plots—easier to scan, compare, and select. Sort tables by the primary decision variable (e.g., cost low→high to show frontier progression). Add visual badges/chips for key attributes (e.g., "Frontier" for Pareto-optimal items). Make rows clickable with clear selection indicators (icon ▶ + border + background). Add column header hints like "Model (click to select)" for discoverability. Use subtle arrows (▸/▶) to indicate clickability without cluttering.
- **Data disclaimers for simulators:** When interactive components use approximated/illustrative data derived from paper patterns rather than exact published values, add small muted disclaimer near introduction: "Note: Model performance numbers in this simulator are illustrative, derived from [source] patterns and figures. Actual performance varies by task. Use [tool/method] to benchmark your specific workload." Keeps users informed while maintaining pedagogical value of simulator.

### Interactive script initialization pattern

Papers and questions with interactive JavaScript must follow this pattern to avoid timing issues where scripts execute before the DOM is ready:

**DO NOT auto-initialize scripts immediately:**

```javascript
// ❌ WRONG - script executes before HTML is in DOM
(function() {
  'use strict';
  
  function init() {
    const element = document.getElementById('my-control'); // null!
    element.addEventListener('input', updateUI); // TypeError
  }
  
  // Auto-init immediately - TOO EARLY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

**DO export a function that paperLoader/questionLoader calls:**

```javascript
// ✅ CORRECT - script waits for paperLoader to call it after HTML inserted
(function() {
  'use strict';

  // ✅ Shared helpers at IIFE scope — accessible to ALL functions
  const getCssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };
  
  function init() {
    const element = document.getElementById('my-control');
    if (!element) {
      console.warn('Interactive elements not yet in DOM, skipping');
      return; // Defensive check
    }
    element.addEventListener('input', updateUI);
    updateUI(); // Initial render
  }
  
  function updateUI() {
    // Check element exists before reading value
    const controlEl = document.getElementById('my-control');
    if (!controlEl) return;
    
    const value = parseInt(controlEl.value);
    // ... calculations and DOM updates
  }
  
  // Export function to be called by paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0); // Wait a tick for DOM
  }
  
  // Attach helper functions for testing
  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;
  
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
```

**Why this matters:** paperLoader loads scripts via `Promise.all` at the same time as HTML, evaluating them immediately. The HTML is inserted into the DOM after scripts load. If scripts auto-initialize, they'll try to access DOM elements that don't exist yet. The loader calls `paper.interactive.script()` after inserting HTML, so scripts must export a function and wait for that call.

**Defensive coding:** Always check if elements exist before accessing properties. Use `getElementById` and check for `null`, then return early if not found. This prevents "Cannot read properties of null" errors during initialization.

## Documentation maintenance

After completing work, review whether the patterns, decisions, or solutions introduced should be documented:

### When to update AGENTS.md

- You discovered a new best practice or workflow improvement
- You solved a problem that took significant effort to resolve
- You made architectural decisions that should guide future work
- You identified common pitfalls or anti-patterns to avoid
- You established new conventions for naming, structure, or organization

### When to update template guides (PAPER_TEMPLATE_GUIDE.md, QUESTION_TEMPLATE_GUIDE.md)

- You added new UI patterns or components that should be reused
- You changed the structure or sections of papers/questions
- You introduced new semantic classes or theme tokens
- You updated the interactive component expectations or APIs
- You added new quality checks or validation requirements

### When to update checklists (PAPER_CHECKLIST.md, QUESTION_CHECKLIST.md)

- You added steps to your workflow that should be mandatory
- You discovered validation steps that catch common errors
- You added new file types or integration points
- You identified visual consistency checks that matter

### Review triggers

Explicitly consider updating docs after:

- Creating your first instance of a new asset type (paper, question, tutorial)
- Refactoring patterns across multiple files
- Resolving ambiguous or underspecified requirements
- Receiving feedback that reveals documentation gaps
- Introducing tools, scripts, or automation

### Self-check before completing

Before marking work complete, ask:

1. "Would future contributors benefit from knowing how I approached this?"
2. "Did I diverge from existing guidelines? Should the guidelines change or should I realign?"
3. "What took me longest to figure out? Should that be documented?"
4. "Are there decisions here that I'd want to remember if I return in 6 months?"

Keep documentation living and accurate—stale guidelines are worse than missing ones.

Follow these instructions and the accompanying docs to keep new questions consistent, discoverable, and easy to maintain.




