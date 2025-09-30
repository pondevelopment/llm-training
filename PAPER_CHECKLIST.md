# Paper Checklist

U## Overview content

- [ ] **Paper header** (`panel panel-info`): Title (h2), authors • venue (year), link button with ↗ icon, 2-3 sentence summary
- [ ] **Plain-language explainer**: Nested card (`panel panel-neutral-soft`) with 1-2 sentence analogy making the core insight accessible to non-experts
- [ ] **Executive quick take** (`panel panel-neutral`): 🧭 icon + uppercase header, 2-3 sentences (practical ceiling + actionable signal), 3 bulleted key points
- [ ] **Business relevance** (`panel panel-success`): 💼 icon, 3–4 stakeholder bullets, nested "Derivative example" card (`panel-neutral-soft`)
- [ ] **Supporting callouts** (optional, `panel panel-info`): 2-column grid unpacking concepts (~80-120 words each)
- [ ] **Key insight / Method / Implication** (`panel panel-neutral`): 3-column grid with focused cards
- [ ] **Evidence** (`panel panel-neutral`): 🧪 icon, bulleted list citing ≥2 concrete results with precise metrics
- [ ] **Roadmap** (`panel panel-warning`): 🔭 icon, actionable next steps (not generic advice)
  - [ ] Uses `panel panel-warning` with theme classes only (never hardcoded amber/cyan colors)
  - [ ] Includes context paragraph introducing the roadmap items
  - [ ] Optional: Nested subsections use `panel panel-info` with `<h4>` headings and descriptive content
  - [ ] Closes with actionable bulleted list (3-5 items)
  - [ ] Never uses `panel-emphasis` or inline styles
- [ ] All sections use theme classes: `panel panel-[type]`, `text-heading`, `panel-muted`, `text-body`
- [ ] Icon consistency: 🧭 Executive quick take, 💼 Business relevance, 🧪 Evidence, 🔭 Roadmaphecklist whenever you add or update a paper explainer.

## Before you start

- [ ] Read `PAPER_TEMPLATE_GUIDE.md` for structure and interactive expectations
- [ ] Confirm the paper’s core claim, key evidence, and intended audience (architects/PMs vs researchers)
- [ ] Identify 2–3 related interview questions for cross-linking

## File setup

- [ ] Copy `papers/p-template/` to `papers/pXX/` (two-digit id)
  - [ ] `overview.html`
  - [ ] `interactive.html`
  - [ ] `interactive.js` exporting `interactiveScript`
- [ ] Add/Update entry in `papers/manifest.json` with `title`, `authors`, `year`, `venue`, `tags`, `summary`, `dir`, `interactiveTitle`, and `relatedQuestions`
- [ ] Create or update `p/XX.html` share page (title, description, OG image, link to `index.html#paper-XX`)
- [ ] Confirm `relatedQuestions` ids exist in `questions/manifest.json` and `availableQuestions`

## Overview content

- [ ] Executive quick take summarises the practical ceiling and governance signal
- [ ] Business relevance block follows the quick take, includes 3–4 stakeholder bullets, and nests a white “Derivative example” card with a runnable workflow
- [ ] Include “How top-k maps to retrieval results” callout
- [ ] Include “What counts as a document” callout (and doc chunking guidance)
- [ ] Populate `Key insight`, `Method`, `Implication` cards with concise copy
- [ ] Evidence list cites at least two concrete results (theorem, metric, dataset)
- [ ] Roadmap bullets give actionable next steps for practitioners

## Interactive component

- [ ] **Root wrapper:** `<section class="space-y-6" id="pXX-explorer">` (semantic HTML, not div)
- [ ] **NO inline styles:** No `<style>` blocks - use Tailwind utility classes only
- [ ] **NO panel-emphasis:** Use single panel classes only (no double borders)
- [ ] **Panel structure:**
  - [ ] Controls/inputs: `panel panel-info` or `panel panel-neutral`
  - [ ] Results/output: `panel panel-neutral` with nested `panel-neutral-soft` for metrics
  - [ ] Insights/warnings: `panel panel-warning` or `panel panel-success`
- [ ] **Min-height for dynamic content:** Use inline Tailwind classes like `min-h-[2.75rem]` instead of custom CSS
- [ ] Dimension / corpus / k sliders match paper defaults and include helper text
- [ ] Design tweaks: vectors-per-document slider, lexical reranker checkbox (with explanation), token retention slider
- [ ] Coverage outlook shows single-vector, multi-vector, and reranker metrics with colour-coded bar
- [ ] LIMIT-style simulator scenarios are realistic (≥8 queries) with names, expected docs, and optional hints
- [ ] Simulator summary explains observed vs expected recall and hints at mitigations
- [ ] All DOM lookups guarded; `interactiveScript` does not leak globals
- [ ] MathJax re-typeset if the interactive injects equations

## Integration tasks

- [ ] Hard refresh `index.html#paper-XX`; verify landing card, overview, interactive, and related-question buttons
- [ ] Run each simulator scenario; ensure coverage numbers, hints, and follow-up text make sense
- [ ] Confirm `all.html#papers` (and any curated lists) include the new paper title
- [ ] Open `p/XX.html` to verify metadata and CTA
- [ ] Update any documentation or release notes referencing the new paper
- [ ] Add a Latest Site Update entry in `updates.html` describing the new or revised paper

## Quality gates

- [ ] No console errors while interacting with the paper
- [ ] Layout holds on mobile widths (overview and interactive stack cleanly)
- [ ] Controls handle edge values (min/max sliders, toggling reranker, switching scenarios)
- [ ] Interactive remains responsive—no long-running loops or blocking recalculations
- [ ] Files saved as UTF-8 with `\n` line endings; emoji and punctuation render correctly

Tick every box before requesting review or publishing the paper explainer.
