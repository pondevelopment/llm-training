# AI Coding Assistant System Prompt (Repository: llm-training)

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

Follow these instructions and the accompanying docs to keep new questions consistent, discoverable, and easy to maintain.




