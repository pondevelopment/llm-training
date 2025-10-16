# AI Coding Assistant## Quality gates (run before you're done)

- Build: ensure the static site loads without console errors (hard refresh when testing manifest updates).
- Lint/Type: match existing patterns; avoid new globals and unused vars.
- Tests: if you change public behaviour, add/adjust minimal tests (or a quick runner) where applicable.
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
- Tests: if you change public behaviour, add/adjust minimal tests (or a quick runner) where applicable.
- Smoke: verify the specific question/page impacted renders and interacts as intended (including `all.html` and the share page).

## Coding guidelines

- Consistency over novelty: follow existing patterns, naming, and structure (per-question folders, manifest entries, UTF-8 files).
- Prefer the shared semantic helpers (`panel…`, `chip…`, `view-toggle`) for theming; avoid raw Tailwind colour utilities.
- Minimal dependencies: prefer standard APIs; if adding a dep, justify and pin versions.
- Error handling: defensive DOM lookups; fail soft with clear messages in UI.
- Accessibility: keyboard reachable, sufficient contrast, clear labels and helper text.
- Performance: avoid unnecessary reflows, heavy loops in hot paths, and oversized assets.

## Question workflow reminders

- Each question lives in `questions/qXX/` with `answer.html`, `interactive.html`, and `interactive.js`.
- Update `questions/manifest.json` and the `questions/qXX/` asset folder together (answer, interactive HTML, interactive JS).
- Ensure `all.html` lists the question and any curated learning paths include the id.
- Share pages remain under `/q/XX.html` and must match the latest title/description.

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

## Implementation reminders

- When touching the manifest or loader, hard-refresh or clear caches so new assets load correctly.
- Keep `interactive.js` exports pure functions and avoid polluting `window` unless explicitly required.
- Ensure all files remain UTF-8 encoded with `\n` line endings so emoji and punctuation render correctly.
- Park temporary downloads or scratch exports under `tmp/` (gitignored) and delete them before you ship changes.
- **CSS variables in JavaScript-injected inline styles:** Avoid `var(--color-name)` in `style=""` attributes generated by JS—they don't reliably resolve across browsers. Use direct hex/RGB/HSL values instead (e.g., `#6366f1` not `var(--color-accent-strong)`). For static HTML, CSS variables work fine in stylesheet rules.
- **Slider UX principle:** Design sliders so that sliding RIGHT (toward 100%) improves the outcome users care about. Frame as "gap" or "improvement potential" rather than "capability" when modeling inverse relationships. Example: "Baseline gap (room for improvement)" where 100% = huge benefit opportunity, not "Baseline capability" where 100% = no benefit opportunity. Users expect rightward motion to be positive.

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




