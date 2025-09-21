# Paper Template Guide

This guide explains how to add or revise research paper explainers while keeping the new "papers" section consistent. Use it together with `PAPER_CHECKLIST.md` each time you ship a paper.

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
2. **Draft the overview (`overview.html`):**
   - Lead with an **Executive quick take** that summarises the practical ceiling or lesson for architects/decision-makers.
   - Immediately follow with a **Business relevance** block (emerald styling) that spells out 3–4 stakeholder impacts. Nest a white “Derivative example” card inside this block showing how a team could replicate the paper’s setup with their own data.
   - Layer supporting callouts that unpack the paper’s mechanics (e.g., “How top-k maps to retrieval results”, “Embedding-model sensitivities”). Name and scope them to the paper—keep each under ~120 words.
   - Keep the trio of cards (`Key insight`, `Method`, `Implication`) focused and scannable.
   - Provide an **Evidence** list citing the main theoretical/empirical results.
   - End with **Forward-looking / roadmap** bullets that tell practitioners what to monitor next.
   - Use Tailwind classes already present in the repo. Stick to semantic HTML (`<ul>`, `<li>`, `<code>`) for structure.
3. **Build the interactive (`interactive.html` + `interactive.js`):**
   - Reuse the controls from the template and tailor the copy to the paper. The default layout expects:
     - Embedding design controls (dimension slider, corpus size, top-k requirement).
     - Design tweaks panel (vectors per document, lexical reranker toggle, token retention slider). Provide helper text for each control so users know what the knob represents.
     - Coverage outlook block showing single-vector vs multi-vector vs reranker coverage. Update wording to match the paper’s guarantees.
     - LIMIT-style simulator that samples realistic queries. Replace the placeholder scenarios with 8–10 queries per scenario, each naming the documents users expect to hit.
   - Export `interactiveScript` (CommonJS + browser global). Keep DOM lookups defensive and scope state locally. Call `window.MathJax?.typesetPromise` if the interactive injects new math.
   - When modelling coverage boosts, document your assumptions inline (comments or helper text) so future contributors understand the constants.
4. **Manifest + share page:**
   - Add the entry to `papers/manifest.json` including `summary`, `tags`, and `relatedQuestions`.
   - Update `p/XX.html` based on `p/_template.html` (title, description, share image).
5. **App wiring:**
   - Hard-refresh `index.html#paper-XX` to verify the manifest resolves, the landing card renders, and the related-question buttons work.
   - Confirm the new paper appears in `all.html#papers` if that view lists it.

## Overview content guidelines

- **Executive quick take:** 2–3 sentences aimed at architects/PMs; speak in plain language, highlight the practical ceiling, and include one actionable signal (e.g., “Track recall on adversarial tickets”).
- **Business relevance:** place this block directly after the quick take, add 3–4 bullets tailored to operators, and include a nested “Derivative example” card that gives a concrete workflow teams can run.
- **Callout boxes:** keep each under ~120 words. Use them to unpack terminology or experimental levers so the interactive makes sense.
- **Evidence bullets:** cite the paper’s key theorem, experiment, or data release. Include precise phrases (e.g., “recall@2 saturates at 0.42 even with oracle embeddings”).
- **Roadmap bullets:** frame them as next steps (“Audit how your retriever chunking aligns with LIMIT assumptions”), not generic advice.
- **Encoding:** store as UTF-8 with `\n` endings so emoji and punctuation render correctly.

## Interactive design guidelines

- Provide helpful defaults: choose dimension/corpus/k values that mirror the paper’s baseline.
- Explain the **lexical reranker** checkbox directly under the control (e.g., “second-pass BM25 scorer to rescue misses”).
- Show real-world scenario labels in the simulator (`Customer support`, `Product catalog`, `Legal discovery`, etc.). Each scenario should:
  - Describe the workflow in 1–2 sentences (`scenario.description`).
  - Supply 8–10 query objects with `name`, `docs` (array of expected hits), and optional `hint` for follow-up guidance.
  - Let `updateScenarioUI()` adjust the slider bounds automatically (keep the API intact).
- Surface follow-up nudges when the simulated query misses (e.g., “Consider boosting term X or adding metadata filters”).
- Keep the coverage gauge consistent (green ≥60%, amber 30–59%, red <30%).
- Comment constants inside `interactive.js` if you change boost factors or retention heuristics.

## Share pages (`p/XX.html`)

- Title format: `Paper XX • LLM Paper Explainers`.
- Description: plain sentence summarising the quick take.
- `og:image`: use the hosted OG image for the series or a paper-specific asset.
- CTA link should point to `../index.html#paper-XX`.

## Testing checklist (preview)

- Hard refresh `index.html#paper-XX`; verify no console errors.
- Check that the landing card shows title/summary/tags and related questions navigate correctly.
- Run each simulator scenario; ensure the query samples, hints, and coverage numbers make sense.
- Confirm MathJax renders any inline expressions after interactions.
- Open `p/XX.html` to ensure social metadata is correct.

Use `PAPER_CHECKLIST.md` to track completion of these steps for every new or updated paper.

> Use the neutral token classes from `css/theme.css` (such as `bg-card`, `bg-surface`, `text-heading`, `text-muted`, `border-divider`) for backgrounds and typography.
