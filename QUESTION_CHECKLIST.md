# Question Checklist

Use this checklist when creating or updating questions for the LLM Questions app.

## Before you start
- [ ] Review `QUESTION_TEMPLATE_GUIDE.md` for conventions and examples
- [ ] Copy an existing question file (e.g., `/questions/question-01.js`) as a starting point
- [ ] Identify the key concept and the 2–3 approaches you’ll compare
- [ ] Confirm CommonJS export is required (the loader does not support ESM)

## File setup
- [ ] Name file `questions/question-XX.js` (two digits where applicable)
- [ ] Replace all `qX-` prefixes with your question number (e.g., `q12-`)
- [ ] Remove placeholders and update the comment header (topic + date)
- [ ] Define a file-scoped `const question = { title, answer, interactive }`
- [ ] Optional: add `if (typeof module !== 'undefined') { module.exports = question; }`

## Content development

### Title & basics
- [ ] Clear, specific title under ~80 chars
- [ ] Starts with the number: `X. ` and ends with `?` if appropriate

### Answer section
- [ ] Blue “what is it” box with a clear definition and analogy
- [ ] 2–3 comparison/option cards (consistent color scheme)
- [ ] “Why this matters” section with 3–4 bullets
- [ ] Practical mini examples (use `<code>` where helpful)
- [ ] Use tasteful emojis (🔤 🎯 📝) where they improve scannability
- [ ] Optional: top “Recommended reading” box linking to related questions

### Interactive component
- [ ] `interactive.title`, `interactive.html`, and `interactive.script()` implemented
- [ ] Inputs have sensible defaults; selection cards are descriptive
- [ ] Visual feedback (hover/selected) and concise explanations per option
- [ ] If trade-offs are involved, consider an impact meter or pros/cons

## JavaScript implementation
- [ ] Defensive DOM lookups; no null dereferences
- [ ] No globals leaked; keep state local to `script()`
- [ ] Update explanations dynamically on input/selection
- [ ] Add short tooltips where non-obvious

## MathJax (if applicable)
- [ ] Use `\(...\)` for inline math and `$$...$$` for display math
- [ ] In JS strings, escape backslashes: `\\frac{\\partial f}{\\partial x}`
- [ ] Space around `<` or `>` inside inline math to avoid HTML parsing issues
- [ ] Stick to standard LaTeX (no custom macros); verify render in the app
- [ ] For long single-line formulas in small containers, add `overflow-x-auto whitespace-nowrap` to the container to prevent clipping

## Integration
- [ ] Ensure the question number is included in `availableQuestions` in `js/app.js`
- [ ] Deep link works: `index.html#question-XX`
- [ ] Appears in the dropdown and prev/next navigation functions

## Share and unfurls (new)
- [ ] Create/update static share page: `/q/XX.html`
	- [ ] `og:title` and `twitter:title` match your question title
	- [ ] `og:description` summarizes the interactive angle
	- [ ] `og:image` follows the `...QXX.png` convention
	- [ ] “Open in app” points to `../index.html#question-XX`
- [ ] In the app, press `S` to copy and verify the share link to `/q/XX.html`

## Testing

### Functionality
- [ ] Loads without console errors
- [ ] All inputs and radios work and update results immediately
- [ ] Examples (if provided) cycle correctly; indicators update
- [ ] MathJax renders with no errors or fallback retries

### Content quality
- [ ] Explanations are accurate and concise; examples are realistic
- [ ] Color coding and typography match the established pattern
- [ ] Tooltips and labels are clear and helpful

### User experience
- [ ] Defaults provide immediate insight; interactions feel responsive
- [ ] Works on mobile (spacing, wrapping, touch targets)

### Integration check
- [ ] Title appears correctly; progress indicator updates
- [ ] Deep link navigation returns to the same question
- [ ] Share link unfurls (Slack/LinkedIn/Teams) with the right meta

## File locations
- [ ] Question file at `/questions/question-XX.js`
- [ ] App entry is `index.html` (not `index-new.html`)
- [ ] Share page at `/q/XX.html` exists and opens in-app correctly

## Pre-submission review
- [ ] Code follows patterns; no dead/commented-out blocks left behind
- [ ] Educational value is clear; interactivity adds understanding
- [ ] Performance is acceptable (renders quickly)

## Quick references

IDs (replace `X`):
- `qX-input`, `qX-output`, `qX-explanation`, `qX-example-btn`
- `qX-option`/`name="qX-option"` for radio groups, `qX-indicator`, `qX-legend`

Useful utility classes:
- Containers: `space-y-4`, `space-y-6`, `grid md:grid-cols-3 gap-4`
- Backgrounds: `bg-blue-50`, `bg-white`, `from-blue-50 to-indigo-50`
- Borders: `border border-gray-200 rounded-lg`, `border-l-4 border-blue-400`
- Text: `text-sm font-medium text-gray-700`, `font-semibold text-blue-900`
- Interactive: `hover:bg-gray-50 transition-colors cursor-pointer`

