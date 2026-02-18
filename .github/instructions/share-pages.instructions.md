---
applyTo: "p/*.html,q/*.html,p/_template.html,q/_template.html,css/share.css"
---

# Share page (unfurl) instructions

These instructions apply when creating or editing share/unfurl pages under `p/` and `q/`.

## What share pages are

- Share pages (`p/XX.html`, `q/XX.html`) are **standalone HTML documents** used for social previews (Open Graph + Twitter cards) and a simple CTA into the SPA.
- They are **not** the same as the in-app fragments in `papers/pXX/*` or `questions/qXX/*`.

## Start from the templates

- For papers: copy and adapt `p/_template.html`.
- For questions: copy and adapt `q/_template.html`.
- Keep diffs minimal when editing existing share pages; don’t mass-rewrite older pages unless explicitly requested.

## Required metadata (keep correct)

Update these fields to match the paper/question:

- `<title>`
- `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

Rules:

- Use absolute GitHub Pages URLs (e.g., `https://pondevelopment.github.io/llm-training/...`).
- **Image selection:** If the paper has an infographic (`papers/pXX/infographic.png`), use it as `og:image` and `twitter:image`: `https://pondevelopment.github.io/llm-training/papers/pXX/infographic.png`. Otherwise, use the site-wide preview image: `https://pondevelopment.github.io/llm-training/og-image.png`.
- Descriptions should be 1–3 concise sentences and reflect what users learn.

## CTA / deep link

- Question pages should link to `../index.html#question-N`.
- Paper pages should link to `../index.html#paper-N`.

## Styling rules (share pages only)

- Share pages may include inline `<style>` when the template does (paper template currently does).
- Prefer using the template styling as-is; do not introduce new colors, fonts, or layout patterns.
- For question share pages, prefer `../css/theme.css` + `../css/share.css` (as in `q/_template.html`) rather than adding new inline CSS.

## Common pitfalls

- Don’t use relative `og:url` or relative `og:image`—many platforms require absolute URLs.
- Ensure the favicon path stays `../favicon.ico`.
- If the template includes `robots` meta, keep it consistent.

## Quick verification

- Open the share page directly (`p/XX.html` or `q/XX.html`) and confirm:
  - Correct title + description
  - CTA points to the correct `index.html` anchor
  - No console errors
