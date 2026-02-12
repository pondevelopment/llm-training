```skill
---
name: interactive-debugging
description: Diagnose and fix broken interactive scripts in papers and questions. Use this when a paper or question interactive is not loading, shows a blank panel, throws console errors, or fails Playwright E2E tests with "pageerror" or "interactive script" failures.
---

# Interactive Script Debugging

## Goal

Quickly diagnose and fix broken `interactive.js` files in papers and questions. These scripts run in a unique loader environment with specific timing and scope constraints that cause non-obvious failures.

## When to use

- Playwright E2E tests fail with "pageerror" or "interactive script threw"
- A paper/question interactive panel is blank or shows no controls
- Browser console shows `ReferenceError`, `TypeError: Cannot read properties of null`, or similar
- After editing an interactive.js and the interactive stops working

## How the loader works (essential context)

Both `js/paperLoader.js` and `js/questionLoader.js` follow this sequence:

1. Fetch manifest JSON
2. **In parallel:** fetch HTML fragments + fetch `interactive.js` as text
3. **Evaluate** the JS via `new Function` (not `import`) — this runs immediately
4. **Insert** HTML fragments into the DOM
5. **Call** `interactiveScript()` — the exported function

**Key implication:** When the JS is evaluated (step 3), the HTML is NOT yet in the DOM (step 4). Any code that runs at evaluation time cannot find DOM elements.

## Common failure patterns

### 1. getCssVar (or any helper) defined inside `init()` — ReferenceError

**Symptom:** `ReferenceError: getCssVar is not defined` in `updateUI()` or `renderChart()`.

**Cause:** Helper defined inside `init()` but called from a sibling function at IIFE scope:

```javascript
// ❌ BROKEN
(function() {
  'use strict';

  function init() {
    const getCssVar = (name, fb) => { /* ... */ };  // scoped to init()!
    updateUI();
  }

  function updateUI() {
    const color = getCssVar('--tone-emerald-strong', '#10b981'); // ReferenceError!
  }
})();
```

**Fix:** Move `getCssVar` to IIFE top scope:

```javascript
// ✅ FIXED
(function() {
  'use strict';

  const getCssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };

  function init() { updateUI(); }
  function updateUI() {
    const color = getCssVar('--tone-emerald-strong', '#10b981'); // ✅ works
  }
})();
```

**Detection:** Search for `getCssVar` defined with `const` or `function` inside `init()`:
```bash
grep -n 'function init' papers/*/interactive.js | while read line; do
  file=$(echo "$line" | cut -d: -f1)
  grep -n 'getCssVar' "$file" | head -3
done
```

### 2. Auto-initialization — DOM elements are null

**Symptom:** `TypeError: Cannot read properties of null (reading 'addEventListener')` or similar.

**Cause:** Script runs setup code at module scope or on `DOMContentLoaded` instead of waiting for the loader to call `interactiveScript()`:

```javascript
// ❌ BROKEN — runs before HTML is inserted
(function() {
  'use strict';
  const slider = document.getElementById('my-slider'); // null!
  slider.addEventListener('input', updateUI);           // TypeError
})();
```

**Fix:** Export `interactiveScript()` and use `setTimeout(() => init(), 0)`:

```javascript
// ✅ FIXED — waits for loader to call after HTML insertion
(function() {
  'use strict';

  function init() {
    const slider = document.getElementById('my-slider');
    if (!slider) { console.warn('Elements not found'); return; }
    slider.addEventListener('input', updateUI);
    updateUI();
  }

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') window.interactiveScript = interactiveScript;
  if (typeof module !== 'undefined' && module.exports) module.exports = interactiveScript;
})();
```

### 3. SVG template literals — raw function calls instead of interpolation

**Symptom:** SVG renders with literal text `getCssVar(...)` as an attribute value, or throws a parse error.

**Cause:**
```javascript
// ❌ Raw function call — becomes literal string in SVG
`<line stroke=getCssVar('--color-border', '#e5e7eb') />`
```

**Fix:**
```javascript
// ✅ Interpolated and quoted
`<line stroke="${getCssVar('--color-border', '#e5e7eb')}" />`
```

### 4. MathJax not rendering after dynamic content injection

**Symptom:** LaTeX-like markup appears as raw text (e.g., `\(x^2\)` instead of rendered math).

**Cause:** MathJax already processed the page before new content was inserted.

**Fix:** Call typeset after inserting new math markup:
```javascript
const container = document.getElementById('my-result');
container.innerHTML = 'The value is \\(x^2 + y^2\\)';
window.MathJax?.typesetPromise([container]);
```

## Diagnosing failures from Playwright output

### Understanding test structure

Each paper/question has two tests:
1. **"loads overview/answer and interactive HTML"** — checks that HTML fragments load and appear
2. **"interactive script runs without error"** — checks that `interactiveScript()` executes without throwing

### Failure pattern A: Only interactive test fails

```
✗ Paper 35 › interactive script runs without error
```
**Meaning:** The HTML loaded fine, but the JS threw an error. The error was likely caught by a `try/catch` in the loader. Check the test output for the error message.

**Common causes:** getCssVar scope, missing DOM element, undefined variable.

### Failure pattern B: Both tests fail

```
✗ Paper 41 › loads overview and interactive HTML
✗ Paper 41 › interactive script runs without error
```
**Meaning:** The JS error was **uncaught** and triggered Playwright's `pageerror` listener, which fails ALL subsequent tests for that page. This typically happens when the error occurs in a `setTimeout` callback (which can't be caught by the loader's try/catch).

**Common causes:** `setTimeout(() => init(), 0)` where `init()` calls a function with a scope error — the error escapes the try/catch wrapper.

### Reading Playwright output

Playwright uses ANSI escape codes that can make terminal output appear empty. When inspecting output files:

```bash
# ❌ May show nothing due to escape codes
cat test-results.txt

# ✅ Shows raw content including escape codes
cat -v test-results.txt | grep -i "error\|fail\|timeout"

# ✅ Check file has content
wc -l test-results.txt
```

## Debugging workflow

1. **Run the specific test:**
   ```bash
   npx playwright test --grep "Paper 35"
   ```

2. **If it fails, check the error message** in the test output.

3. **Open the interactive.js** and look for:
   - `getCssVar` defined inside `init()` instead of IIFE scope
   - DOM access before `interactiveScript()` is called
   - SVG template literals without `${}`
   - Missing null checks on `getElementById` results

4. **Apply the fix** and re-run the test.

5. **Run the full suite** to ensure no regressions:
   ```bash
   npm test
   ```

## Prevention checklist

- [ ] `getCssVar` and all shared helpers at IIFE top scope
- [ ] `interactiveScript()` exported and uses `setTimeout(() => init(), 0)`
- [ ] Every `getElementById` result checked for `null` before use
- [ ] `interactiveScript.init` and `interactiveScript.updateUI` attached for testing
- [ ] `window.interactiveScript` and `module.exports` both set
- [ ] No auto-init on `DOMContentLoaded` or at IIFE scope
- [ ] SVG template literals use `"${getCssVar(...)}"` not bare `getCssVar(...)`
- [ ] MathJax re-typeset called after dynamic math injection

```
