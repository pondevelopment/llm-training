# Question Checklist

Use this checklist when creating or updating questions for the LLM Questions app.

## Before you start

- [ ] Review `QUESTION_TEMPLATE_GUIDE.md` for conventions and examples
- [ ] Decide the learning goal and 2–3 contrasting approaches you’ll highlight
- [ ] Confirm whether you are migrating a legacy question or adding a brand new one

## File setup (new or migrated questions)

- [ ] Copy `questions/q-template/` to `questions/qXX/` (two-digit id) containing:
  - [ ] `answer.html`
  - [ ] `interactive.html`
  - [ ] `interactive.js` exporting `interactiveScript`
- [ ] Add or update the entry in `questions/manifest.json` (prefer `{ "XX": { "title": "...", "dir": "./questions/qXX", "interactiveTitle": "..." } }`)
- [ ] Update `/q/XX.html` (static share page) with the new title/description/links
- [ ] Ensure the question id exists in `availableQuestions` (and relevant learning paths) in `js/app.js`
- [ ] Add the question to `all.html` (titles map + path arrays) if it isn’t already present

## Content development

### Title & basics

- [ ] Title is clear, specific, under ~80 characters, and follows the `XX. Question text?` pattern
- [ ] Related questions (“Recommended reading”) link to relevant ids
- [ ] Emojis are used sparingly to aid scannability (and are stored as UTF-8)

### Answer section (`answer.html`)

- [ ] Includes core concept box (blue) describing the idea + analogy
- [ ] Comparison/approach cards (2–3) highlight trade-offs
- [ ] “Why this matters” section lists 3–4 concise bullets
- [ ] Optional extras (examples, callouts) use semantic HTML (`<code>`, `<ul>`, etc.)

### Interactive component (`interactive.html` + `interactive.js`)

- [ ] Sane defaults show an informative initial state
- [ ] Controls carry helper text explaining what the user is tuning (sliders, radios, etc.)
- [ ] Visual feedback updates immediately on user input (indicator, results, legend, explanation)
- [ ] Script performs defensive DOM checks and avoids leaking globals
- [ ] Any MathJax updates are re-typeset via `window.MathJax?.typesetPromise`

## Integration tasks

- [ ] Hard-refresh `index.html#question-XX` to ensure manifest loading works
- [ ] Verify the share page `q/XX.html`
- [ ] Check `all.html` search/filter lists the question and the Foundations/other path counts remain accurate
- [ ] Update any relevant docs or cross-links referencing the question

## Quality gates

- [ ] No console errors while interacting with the question
- [ ] Layout holds on mobile (inspect via responsive mode or narrow window)
- [ ] Interactive logic handles edge inputs gracefully (min/max sliders, switching scenarios, etc.)
- [ ] Updated files are UTF-8 encoded so emoji and punctuation render correctly

Tick each item before marking a question ready for review or publishing.
