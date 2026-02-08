# Paper Template Guide

This guide explains how to add or revise research explainers while keeping the “papers” section consistent. Use it together with `PAPER_CHECKLIST.md` each time you ship a paper.

## Repository layout

```text
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
  - Be **business/workflow focused** (assume a practitioner audience). Prefer job-to-be-done names over academic task names.
    - Good: `Customer support agent`, `Sales enablement`, `HR screening`, `Healthcare summarizer`, `Fraud ops`.
    - Avoid: `SQuAD QA`, `GLUE task`, `Winograd`, or other benchmark-only labels (unless the paper is explicitly about that benchmark).
  - Describe the workflow in 1–2 sentences (`scenario.description`).
  - Supply 8–10 query objects with `name`, `docs` (array of expected hits), and optional `hint` for follow-up guidance.
  - Let `updateScenarioUI()` adjust the slider bounds automatically (keep the API intact).
- Surface follow-up nudges when the simulated query misses (e.g., "Consider boosting term X or adding metadata filters").
- Keep the coverage gauge consistent (green ≥60%, amber 30–59%, red <30%).
- Comment constants inside `interactive.js` if you change boost factors or retention heuristics.
- **Out-of-distribution (OOD) behavior:** If your paper tests generalization to new domains/specialties, model this in the simulator with a domain selector. Apply appropriate penalties to prompt-based strategies (typically 10-20% effectiveness reduction on OOD) while maintaining strong performance for fine-tuned approaches if that's what the paper shows. Document assumptions in comments and update insights text to explain why OOD affects different strategies differently.
- **Dynamic description panels:** When dropdowns/selectors have many options, add brief inline descriptions in the `<option>` tags and include a dedicated description panel (e.g., `id="pXX-workflow-description"`) that updates when the selection changes. This provides context without cluttering the control itself. See Paper 40 for reference pattern.
- **Conditional options:** If a selector’s available options change based on other controls (e.g., benchmarks only reported for certain model sizes), add a short helper note near the selector explaining why options appear/disappear. This prevents users from thinking the UI is broken.
- **Explaining heterogeneity:** When papers show differential effects across user segments, add an explanation panel (`panel panel-neutral-soft`) below the segment selector. Explain (1) why the effect varies (mechanism: friction levels, baseline capabilities), (2) what the multipliers mean practically, and (3) strategic implications for targeting. This prevents users from treating segment selection as arbitrary.

## Deep linking and anchor highlights

Papers can link to specific sections within themselves or other papers using anchor IDs. When users navigate to a section via anchor (e.g., `?paper=44#pareto-frontier-explainer`), the target element automatically receives a visual highlight animation.

### Using anchor links

**Internal links (within same paper):**

```html
<a href="#pareto-frontier-explainer" class="text-accent-strong underline decoration-dotted">
  Learn about Pareto frontiers
</a>
```

**External/shareable links (from anywhere):**

```html
<a href="index.html?paper=44#pareto-frontier-explainer">
  Read about cost-accuracy tradeoffs in Paper 44
</a>
```

### Creating linkable sections

Add an `id` attribute to any section you want to be directly linkable:

```html
<section class="panel panel-info p-5 space-y-3" id="pareto-frontier-explainer">
  <header class="flex items-center gap-2">
    <span aria-hidden="true" class="text-lg">🧮</span>
    <h3 class="text-sm font-semibold tracking-wide uppercase text-heading">
      Understanding Pareto Frontiers
    </h3>
  </header>
  <p class="text-sm text-body">Explanation content...</p>
</section>
```

### Highlight animation behavior

When a user navigates to an anchor:

1. **Background highlight**: The target element gets a subtle 2-second fade-out background highlight in accent color (15% opacity → transparent)
2. **Heading flash**: Any headings within the element (`h1-h4` or `header h2-h3`) flash in accent color for the first 40% of the animation
3. **Smooth scroll**: Page smoothly scrolls to position the target element at the top of viewport

The animations are defined in `css/theme.css` as reusable theme components:

- `.anchor-highlight` class automatically applied/removed by `scrollToAnchor()` in `app.js`
- No manual JavaScript required in individual papers
- Works consistently across all papers and questions

### Best practices

- **ID naming**: Use descriptive, lowercase-hyphenated IDs: `pareto-frontier-explainer`, `cost-analysis`, `evidence-section`
- **Link discovery**: Add anchor links in multiple places where users might need to reference the concept (executive summary, bullet lists, derivative examples)
- **Link styling**: Use `text-accent-strong underline decoration-dotted` for educational anchor links to distinguish them from external links
- **Accessibility**: Ensure anchor targets have clear headings so screen reader users benefit from the jump

## Share pages (`p/XX.html`)

Share pages are critical for social media discoverability. They provide rich previews when links are shared in Telegram, WhatsApp, Slack, Twitter, LinkedIn, etc.

### Canonical structure

All share pages follow a **simple, consistent template** with inline CSS for maximum portability and minimal dependencies.

**Full template (`p/_template.html`):**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Paper {{NUM}} • LLM Paper Explainers</title>
  <meta name="robots" content="noindex,follow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{{TITLE}}">
  <meta property="og:description" content="{{DESC}}">
  <meta property="og:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
  <meta property="og:site_name" content="LLM Learning Hub">
  <meta property="og:url" content="https://pondevelopment.github.io/llm-training/p/{{NUM}}.html">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{TITLE}}">
  <meta name="twitter:description" content="{{DESC}}">
  <meta name="twitter:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
  <link rel="icon" href="../favicon.ico">
  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;margin:0;padding:2rem;background:#f8fafc;color:#111827}
  .header{max-width:720px;margin:0 auto 2rem;text-align:center}
  .logo{font-size:16px;font-weight:600;color:#4f46e5;text-decoration:none;transition:color .2s}
  .logo:hover{color:#6366f1}
  .card{max-width:720px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
  .title{font-weight:700;font-size:20px;margin:0 0 8px}
  .desc{font-size:14px;color:#374151;margin:0 0 16px}
  .btn{display:inline-block;background:#4f46e5;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;transition:opacity .2s}
  .btn:hover{opacity:.9}
  .muted{font-size:12px;color:#6b7280;margin-top:12px}
  .footer{max-width:720px;margin:2rem auto 0;padding-top:2rem;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
  .footer a{color:#4f46e5;text-decoration:none}
  .footer a:hover{text-decoration:underline}
  </style>
</head>
<body>
  <header class="header">
    <a href="../index.html" class="logo">← LLM Learning Hub</a>
  </header>
  <main class="card">
    <h1 class="title">{{TITLE}}</h1>
    <p class="desc">{{DESC}}</p>
    <a class="btn" href="../index.html#paper-{{NUM}}">Open interactive explainer</a>
    <p class="muted">Direct link to the interactive summary of this paper.</p>
  </main>

  <footer class="footer">
    <div>
      <span>Last updated: <span id="build-timestamp">Loading...</span></span>
    </div>
    <div>
      <a href="https://github.com/pondevelopment/llm-training" target="_blank" rel="noopener">View on GitHub</a>
      <span> • </span>
      <span id="build-commit" style="font-family:monospace;font-size:10px"></span>
    </div>
  </footer>

  <script src="../js/build-info.js"></script>
  <script>
    (function() {
      if (window.BUILD_INFO && window.BUILD_INFO.timestamp !== 'BUILD_TIMESTAMP_PLACEHOLDER') {
        const timestampEl = document.getElementById('build-timestamp');
        const commitEl = document.getElementById('build-commit');
        if (timestampEl) {
          const timestamp = new Date(window.BUILD_INFO.timestamp);
          timestampEl.textContent = timestamp.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
          });
        }
        if (commitEl && window.BUILD_INFO.commit !== 'dev') {
          commitEl.textContent = window.BUILD_INFO.commit;
        }
      } else {
        const timestampEl = document.getElementById('build-timestamp');
        if (timestampEl) timestampEl.textContent = 'Development';
      }
    })();
  </script>
</body>
</html>
```

**Key components:**

1. **Header:** Logo link back to main site (`../index.html`)
2. **Main card:** Paper title, concise description, CTA button
3. **Footer:** Build timestamp (auto-populated from `build-info.js`) and GitHub link
4. **Inline CSS:** All styles self-contained for portability
5. **Build info script:** Displays deployment timestamp and commit hash

### Required meta tags

**Basic HTML:**

```html
<meta name="description" content="2-3 sentence summary with key findings and statistics">
```

**Open Graph (Facebook, LinkedIn, WhatsApp, Telegram):**

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Full Paper Title">
<meta property="og:description" content="Rich description with context and findings">
<meta property="og:url" content="https://pondevelopment.github.io/llm-training/p/XX.html">
<meta property="og:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
<meta property="og:site_name" content="LLM Learning Hub">
```

**Twitter Card:**

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Full Paper Title">
<meta name="twitter:description" content="Condensed description">
<meta name="twitter:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
```

### Content guidelines

- **Title:** Use full paper title from manifest.json
- **Description:** First sentence or ~200 chars from paper summary (from manifest.json)
- **CTA link:** Always points to `../index.html#paper-{{NUM}}` to land on interactive explainer
- **Footer text:** Standard across all papers for consistency
- **NO custom styling:** Use template as-is to maintain uniformity

### Image assets

- **Use `og-image.png`:** Site-wide standard branded image for all social previews
- **Image specs:** 1200×630px recommended, <600KB for optimal cross-platform support
- **Absolute URLs required:** Always use full GitHub Pages URL: `https://pondevelopment.github.io/llm-training/og-image.png`
- **Consistency:** Custom paper-specific images are not currently used to maintain unified brand appearance

### Generation automation

Use `scripts/fix-share-pages.py` to batch-generate all share pages from `papers/manifest.json`:

```bash
python3 scripts/fix-share-pages.py
```

This ensures:

- Consistent structure across all papers
- Correct OG image URLs (`og-image.png`)
- Proper back links (`../index.html#paper-N`)
- Footer with build info
- Unified inline CSS styling

## Testing checklist (preview)

- Hard refresh `index.html#paper-XX`; verify no console errors.
- Check that the landing card shows title/summary/tags and related questions navigate correctly.
- Run each simulator scenario; ensure the query samples, hints, and coverage numbers make sense.
- Confirm MathJax renders any inline expressions after interactions.
- Open `p/XX.html` to ensure social metadata is correct.
- **Automated E2E:** Run `npx playwright test --grep "Paper XX"` to verify both overview and interactive smoke tests pass. The tests auto-discover papers from the manifest — no test file edits needed.
- **Full regression:** Run `npm test` before shipping to ensure no other papers broke.

Use `PAPER_CHECKLIST.md` to track completion of these steps for every new or updated paper.

> Use the neutral token classes from `css/theme.css` (such as `bg-card`, `bg-surface`, `text-heading`, `text-muted`, `border-divider`) for backgrounds and typography.
