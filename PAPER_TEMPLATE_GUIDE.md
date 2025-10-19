# Paper Template Guide

This guide explains how to add or revise researc## Overview content## Interactive design guidelines
- **Roadmap bullets:** frame th## Interactive design guidelines

- **Use concrete examples for technical concepts:** When introducing complex mechanisms (e.g., test-time scaling, memory architectures), add a relatable analogy in a highlighted panel before the technical controls. Examples: "Think of it like: trying multiple approaches in parallel vs. reflecting and refining iteratively" or "When learning to book flights, successes teach you the steps, failures teach you what to avoid." This dramatically improves comprehension.
- **Explain metric relationships when showing multiple related metrics:** If your simulator displays two or more metrics that could be misinterpreted as inversely related, add explicit explanation text. Example: when showing both "compliance with invalid requests" (want low) and "compliance with valid requests" (want high), clarify that these measure different request types and explain what success looks like: "Low invalid + high valid = selective, safe behavior." This prevents confusion when partial mitigation shows moderate scores on both metrics.
- **Distinguish baseline "success" from mitigation success:** When baseline shows high scores on positive-seeming metrics (e.g., 100% helpfulness), clarify whether this is desirable or problematic. Use color coding: amber/warning for indiscriminate baseline behavior (complies with everything), green/success for selective mitigation behavior (distinguishes valid from invalid). Add explanatory text like "Baseline: Complies with ALL requests indiscriminately" vs "Mitigation: Maintains helpfulness while rejecting dangerous requests."
- Provide helpful defaults: choose dimension/corpus/k values that mirror the paper's baseline.
- Explain the **lexical reranker** checkbox directly under the control (e.g., "second-pass BM25 scorer to rescue misses").
- Show real-world scenario labels in the simulator (`Customer support`, `Product catalog`, `Legal discovery`, etc.). Each scenario should: next steps ("Audit how your retriever chunking aligns with LIMIT assumptions"), not generic advice.
- **Roadmap subsections:** if you need to expand on specific topics within the roadmap:
  - Use nested `panel panel-info` callouts with descriptive headings
  - Keep each subsection focused (2-4 paragraphs max)
  - Never use hardcoded colors (amber, cyan, etc.) - always use theme classes
  - Example structure:
    ```html
    <section class="panel panel-warning p-5 space-y-3">
      <h3 class="text-sm font-semibold text-heading">🔭 For your roadmap</h3>
      <p class="text-sm text-body">Opening context paragraph...</p>
      
      <!-- Optional nested callout -->
      <div class="panel panel-info p-4 space-y-2">
        <h4 class="text-sm font-semibold text-heading">Subsection title</h4>
        <p class="text-sm text-body">Detailed content...</p>
      </div>
      
      <ul class="list-disc ml-5 space-y-1 text-sm text-body">
        <li>Action item one</li>
        <li>Action item two</li>
      </ul>
    </section>
    ```
- **Encoding:** store as UTF-8 with `\n` endings so emoji and punctuation render correctly.## Structure and semantic HTML

- **Root wrapper:** Use `<section class="space-y-6" id="pXX-explorer">` (semantic HTML, not generic div)
- **NO inline styles:** Never use `<style>` blocks in interactive.html - use Tailwind utility classes with theme tokens
- **Panel class guidelines:**
  - Controls/inputs: `panel panel-info` or `panel panel-neutral`
  - Results/output: `panel panel-neutral` with nested `panel-neutral-soft` for metrics
  - Insights/warnings: `panel panel-warning` or `panel panel-success`
  - Use single panel classes only (e.g., `panel panel-info` ✅)
- **Consistent spacing:** Use `space-y-*` on containers, `gap-*` for grids/flex layouts
- **Min-height for dynamic content:** Use `min-h-[2.75rem]` directly in classes instead of custom CSS

### Content and functionality

- Provide helpful defaults: choose dimension/corpus/k values that mirror the paper's baseline.
- Explain the **lexical reranker** checkbox directly under the control (e.g., "second-pass BM25 scorer to rescue misses").
- Show real-world scenario labels in the simulator (`Customer support`, `Product catalog`, `Legal discovery`, etc.). Each scenario should:
  - Describe the workflow in 1–2 sentences (`scenario.description`).
  - Supply 8–10 query objects with `name`, `docs` (array of expected hits), and optional `hint` for follow-up guidance.
  - Let `updateScenarioUI()` adjust the slider bounds automatically (keep the API intact).
- Surface follow-up nudges when the simulated query misses (e.g., "Consider boosting term X or adding metadata filters").
- Keep the coverage gauge consistent (green ≥60%, amber 30–59%, red <30%).
- Comment constants inside `interactive.js` if you change boost factors or retention heuristics.

### Theme classes to use

- Text: `text-heading`, `text-body`, `text-muted`, `panel-muted`
- Backgrounds: `bg-card`, `bg-surface`, panel classes
- Borders: `border-divider`, `border-subtle`
- Focus states: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--accent-strong)]`

- **Paper header:** Title (h2), authors • venue (year), **"View paper" button positioned top-right** using `flex justify-between` layout, 2-3 sentence summary
- **Plain-language explainer:** Nested card (`panel panel-neutral-soft`) with 1-2 sentence analogy or everyday explanation for non-experts
- **Executive quick take:** 🧭 icon + uppercase header, 2–3 sentences for architects/PMs (practical ceiling + actionable signal), 3 bulleted key points with bold labels
- **Business relevance:** 💼 icon, 3–4 stakeholder bullets, nested "Derivative example" card (panel-neutral-soft) with concrete replication workflow
- **Callout boxes:** keep each under ~120 words. Unpack terminology or experimental levers
- **Evidence:** 🧪 icon, cite key theorem/experiment with precise phrases (e.g., "recall@2 saturates at 0.42 even with oracle embeddings")
- **Roadmap:** 🔭 icon, frame as next steps ("Audit how your retriever chunking aligns with LIMIT assumptions")
- **Icons used:** 🧭 Executive quick take, 💼 Business relevance, 🧪 Evidence, 🔭 Roadmap
- **Encoding:** store as UTF-8 with `\n` endings so emoji and punctuation render correctly.explainers while keeping the new "papers" section consistent. Use it together with `PAPER_CHECKLIST.md` each time you ship a paper.

## Repository layout

```
papers/
  manifest.json                 # Maps paper ids to ./papers/pXX folders
  p-template/                   # Copy to pXX/ when starting a paper
    overview.html
    interactive.html
    interactive.js
  p01/
    overview.html
    interactive.html
    interactive.js
```

Static share pages live under `p/XX.html`. Use `p/_template.html` as the starting point when creating a new one.

## Loader expectations

`js/paperLoader.js` fetches `papers/manifest.json` to discover paper assets. Prefer the directory form:

```json
{
  "1": {
    "title": "On the Theoretical Limitations of Embedding-Based Retrieval",
    "authors": ["Orion Weller", "Michael Boratko", "Iftekhar Naim", "Jinhyuk Lee"],
    "year": 2025,
    "venue": "arXiv cs.IR (2025)",
    "tags": ["retrieval", "theory", "embeddings"],
    "dir": "./papers/p01",
    "interactiveTitle": "Embedding capacity stress tester",
    "summary": "Shows that single-vector embeddings cannot realize all top-k subsets…",
    "relatedQuestions": [7, 36, 38]
  }
}
```

The loader automatically looks for `overview.html`, `interactive.html`, and `interactive.js` inside `dir`. Only fall back to explicit `overviewPath` or `interactive` overrides when you intentionally share assets across papers.

`relatedQuestions` powers the “Build concept intuition” links rendered in `js/app.js`, so always keep it in sync with the question catalog.

## Authoring workflow

1. **Copy the template:** duplicate `papers/p-template/` to `papers/pXX/` (two-digit id).
2. **Draft the overview (`overview.html`):** Follow this exact structure:
   - **Paper header** (`panel panel-info`): 
     - Container: `flex items-center justify-between gap-4` (no wrapping)
     - Left side: `flex-1 min-w-0` wrapper for title and authors (allows text truncation)
     - Right side: Button with `flex-shrink-0` to prevent wrapping
     - Title (h2), authors • venue (year)
     - Link button: `btn-soft` with `data-accent="foundations"` and ↗ icon, always positioned **top-right**
     - 2-3 sentence summary
     - Nested plain-language explainer card (`panel panel-neutral-soft`)
   - **Executive quick take** (`panel panel-neutral` with 🧭 icon): Icon + uppercase header, 2-3 sentence summary for architects/PMs, 3 bulleted key points
   - **Business relevance** (`panel panel-success` with 💼 icon): 3-4 stakeholder bullets, nested "Derivative example" card (`panel panel-neutral-soft`)
   - **Supporting callouts** (optional, `panel panel-info`): 2-column grid unpacking concepts (~80-120 words each)
   - **Key insight / Method / Implication** (`panel panel-neutral`): 3-column grid
   - **Evidence** (`panel panel-neutral` with 🧪 icon): Bulleted list with precise metrics
   - **Roadmap** (`panel panel-warning` with 🔭 icon): Actionable next steps
     - **Structure:** Simple bulleted list (3-5 items) with actionable next steps
     - **Nested callouts (if needed):** Use `panel panel-info` for subsections that need expansion
     - **Never use:** Hardcoded amber/cyan colors or inline styles
     - **Example:** See P01 for simple list format; P03 demonstrates nested callouts with proper theme classes
   - Use theme classes: `panel panel-[type]`, `text-heading`, `panel-muted`, `text-body`
3. **Build the interactive (`interactive.html` + `interactive.js`):**
   - Reuse the controls from the template and tailor the copy to the paper. The default layout expects:
     - Embedding design controls (dimension slider, corpus size, top-k requirement).
     - Design tweaks panel (vectors per document, lexical reranker toggle, token retention slider). Provide helper text for each control so users know what the knob represents.
     - Coverage outlook block showing single-vector vs multi-vector vs reranker coverage. Update wording to match the paper’s guarantees.
     - LIMIT-style simulator that samples realistic queries. Replace the placeholder scenarios with 8–10 queries per scenario, each naming the documents users expect to hit.
   - Export `interactiveScript` as a function (not an object) that paperLoader calls after HTML is inserted. See "Interactive script initialization pattern" in `AGENTS.md` for the correct timing pattern—never auto-initialize on DOMContentLoaded.
   - Keep DOM lookups defensive (check for null before accessing properties) and scope state locally. Call `window.MathJax?.typesetPromise` if the interactive injects new math.
   - When modelling coverage boosts, document your assumptions inline (comments or helper text) so future contributors understand the constants.
4. **Manifest + share page:**
   - Add the entry to `papers/manifest.json` including `summary`, `tags`, and `relatedQuestions`.
   - Update `p/XX.html` based on `p/_template.html` (title, description, share image).
5. **App wiring:**
   - Hard-refresh `index.html#paper-XX` to verify the manifest resolves, the landing card renders, and the related-question buttons work.
   - Confirm the new paper appears in `all.html#papers` if that view lists it.

## Overview content guidelines

- **Executive quick take:** 2–3 sentences aimed at architects/PMs; speak in plain language, highlight the practical ceiling, and include one actionable signal (e.g., "Track recall on adversarial tickets").
- **Business relevance:** place this block directly after the quick take, add 3–4 bullets tailored to operators, and include a nested "Derivative example" card that gives a concrete workflow teams can run.
- **Callout boxes:** keep each under ~120 words. Use them to unpack terminology or experimental levers so the interactive makes sense.
- **Evidence bullets:** cite the paper's key theorem, experiment, or data release. Include precise phrases (e.g., "recall@2 saturates at 0.42 even with oracle embeddings").
- **Roadmap bullets:** frame them as next steps ("Audit how your retriever chunking aligns with LIMIT assumptions"), not generic advice.
- **Encoding:** store as UTF-8 with `\n` endings so emoji and punctuation render correctly.

### Business impact papers (economics, field experiments, ROI studies)

When covering business/economics papers (e.g., GenAI productivity studies):

- **Plain-language explainer:** Use everyday analogies (grocery store, restaurant) to make experimental design accessible to non-technical readers.
- **Executive quick take:** Lead with ROI/business value first, then mechanism, then strategic implications. Use phrases like "what executives have been asking for" and cite concrete dollar values.
- **Business relevance bullets:** Segment by stakeholder role (C-suite/Investors, Product/Ops, Data Science, Strategy). Each bullet should speak directly to that role's decision-making needs.
- **Evidence section:** For field experiments, cite study scale (millions of users, months of data), experimental design (randomization method), and effect sizes with confidence bounds.
- **Interactive design:** Focus on "what-if" calculators that let users explore ROI under different scenarios (baseline strength, user segments, workflows). Make sliders intuitive—higher values should mean better outcomes unless there's a strong conceptual reason otherwise.

## Interactive design guidelines

- Provide helpful defaults: choose dimension/corpus/k values that mirror the paper's baseline.
- Explain the **lexical reranker** checkbox directly under the control (e.g., "second-pass BM25 scorer to rescue misses").
- Show real-world scenario labels in the simulator (`Customer support`, `Product catalog`, `Legal discovery`, etc.). Each scenario should:
  - Describe the workflow in 1–2 sentences (`scenario.description`).
  - Supply 8–10 query objects with `name`, `docs` (array of expected hits), and optional `hint` for follow-up guidance.
  - Let `updateScenarioUI()` adjust the slider bounds automatically (keep the API intact).
- Surface follow-up nudges when the simulated query misses (e.g., "Consider boosting term X or adding metadata filters").
- Keep the coverage gauge consistent (green ≥60%, amber 30–59%, red <30%).
- Comment constants inside `interactive.js` if you change boost factors or retention heuristics.
- **Out-of-distribution (OOD) behavior:** If your paper tests generalization to new domains/specialties, model this in the simulator with a domain selector. Apply appropriate penalties to prompt-based strategies (typically 10-20% effectiveness reduction on OOD) while maintaining strong performance for fine-tuned approaches if that's what the paper shows. Document assumptions in comments and update insights text to explain why OOD affects different strategies differently.
- **Dynamic description panels:** When dropdowns/selectors have many options, add brief inline descriptions in the `<option>` tags and include a dedicated description panel (e.g., `id="pXX-workflow-description"`) that updates when the selection changes. This provides context without cluttering the control itself. See Paper 40 for reference pattern.
- **Explaining heterogeneity:** When papers show differential effects across user segments, add an explanation panel (`panel panel-neutral-soft`) below the segment selector. Explain (1) why the effect varies (mechanism: friction levels, baseline capabilities), (2) what the multipliers mean practically, and (3) strategic implications for targeting. This prevents users from treating segment selection as arbitrary.

## Share pages (`p/XX.html`)

Share pages are critical for social media discoverability. They provide rich previews when links are shared in Telegram, WhatsApp, Slack, Twitter, LinkedIn, etc.

### Required meta tags

**Basic HTML:**
```html
<meta name="description" content="2-3 sentence summary with key findings and statistics">
```

**Open Graph (Facebook, LinkedIn, WhatsApp, Telegram):**
```html
<meta property="og:type" content="article">
<meta property="og:title" content="Paper XX: Concise Title – Key Stat">
<meta property="og:description" content="Rich description with context, findings, methods, and value proposition">
<meta property="og:url" content="https://pondevelopment.github.io/llm-training/p/XX.html">
<meta property="og:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
<meta property="og:site_name" content="LLM Learning Hub">
```

**Twitter Card:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Paper XX: Concise Title – Key Stat">
<meta name="twitter:description" content="Condensed description for Twitter's limits">
<meta name="twitter:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
```

**Optional but recommended:**
```html
<meta name="author" content="First Author, Second Author, ...">
```

### Content guidelines

- **Title (`og:title`):** Include paper number, short title, and headline statistic. Example: "Paper 40: GenAI Productivity Field Experiments – Sales +0-16.3%"
- **Description (`og:description`):** 2-4 sentences covering: study design (N users, timeframe, countries), key findings with numbers, mechanism/method, practical implications. Front-load the most impressive statistics.
- **Twitter description:** Shorter version (max 200 chars) that still conveys core value.
- **Page content:** Use semantic HTML with clear hierarchy. Highlight key statistics upfront using `<strong>` tags. Make CTA specific ("View interactive ROI calculator →" not "Open interactive explainer").
- **CTA link:** Always point to `../index.html#paper-XX` so users land at the full interactive explainer.

### Image assets

- **Use `og-image.png`:** Site-wide standard branded image for all social previews
- **Image specs:** 1200×630px recommended, <600KB for optimal cross-platform support
- **Absolute URLs required:** Always use full GitHub Pages URL: `https://pondevelopment.github.io/llm-training/og-image.png`
- **Consistency:** Custom paper-specific images are not currently used to maintain unified brand appearance

## Testing checklist (preview)

- Hard refresh `index.html#paper-XX`; verify no console errors.
- Check that the landing card shows title/summary/tags and related questions navigate correctly.
- Run each simulator scenario; ensure the query samples, hints, and coverage numbers make sense.
- Confirm MathJax renders any inline expressions after interactions.
- Open `p/XX.html` to ensure social metadata is correct.

Use `PAPER_CHECKLIST.md` to track completion of these steps for every new or updated paper.

> Use the neutral token classes from `css/theme.css` (such as `bg-card`, `bg-surface`, `text-heading`, `text-muted`, `border-divider`) for backgrounds and typography.
