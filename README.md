# LLM Interview Questions

[🡡️ Open the latest version (GitHub Pages)](https://pondevelopment.github.io/llm-training/)


An interactive learning experience with hands-on examples for the most important Large Language Model (LLM) interview questions.

## 🏯 Overview

This project is a single-page, static web app covering an expanding set of essential LLM questions. Every question includes a clear explanation and most include interactive mini-simulators. There's also a searchable Glossary with deep links into the questions.

## 🎯 Features

- Curated questions with explanations and interactive widgets (continuously growing)
- Searchable in-app Glossary with "Learn more: Question N →" cross-links
- Shareable deep links per question (Share button or press "S")
- Keyboard navigation (← / →), and a top dropdown to jump anywhere
- Math rendering via MathJax (inline and display equations)
- Lightweight: pure HTML/JS/CSS; no build step needed; mobile-friendly

## 📡 Topics covered (selection)

- Tokenization, embeddings, attention and multi-head attention
- Context window, KV cache, decoding (greedy, beam, top-k/top-p, temperature)
- LoRA/QLoRA and PEFT, RLHF and alignment
- MoE, RAG, few/zero-shot prompting, CoT
- Math foundations: softmax, cross-entropy, gradients, Jacobians, eigenvalues
- Deployment trade-offs: latency, cost, safety, privacy, quantization, distillation

## 🛰️ Technologies

- HTML + Tailwind CSS (CDN)
- Vanilla JavaScript
- MathJax v3 (tex-svg)

## 📁 Project structure

\`\`\`text
top-50-llm-questions/
|-- index.html                 # App shell (header, viewer, glossary modal, footer)
|-- js/
|   |-- app.js                # SPA navigation, deep links, caching, MathJax hooks
|   |-- questionLoader.js     # Manifest-driven loader for question assets
|   \-- glossary.js           # Searchable glossary with in-app navigation
|-- questions/
|   |-- manifest.json         # Maps ids to ./questions/qXX folders
|   |-- q01/ ... q57/         # Question assets (answer/interactive files)
|   \-- q-template/           # Copy to qXX/ when authoring a new question
|-- papers/
|   |-- manifest.json         # Maps paper ids to ./papers/pXX folders
|   |-- p-template/           # Copy to pXX/ when authoring a new paper
|   \-- p01/                  # Paper assets (overview/interactive files)
|-- QUESTION_TEMPLATE_GUIDE.md            # Question authoring guidance
|-- QUESTION_CHECKLIST.md                 # Question review & test checklist
|-- PAPER_TEMPLATE_GUIDE.md               # Paper authoring guidance
|-- PAPER_CHECKLIST.md                    # Paper review & test checklist
|-- COPILOT_SYSTEM_PROMPT.md              # AI-assisted coding system prompt
|-- LICENSE                               # MIT License
\-- README.md
\`\`\`

## 🏮 How to run

1) Download or clone the repo
2) Open \`index.html\` in a modern browser (no server needed)

Tips inside the app:

- Use the dropdown or ← / → to navigate
- Press "S" to copy a shareable deep link to the current question
- Click "Glossary" in the header to browse definitions and jump to questions


## 🏧 Development

### Tooling

Install the lint tooling once:

\`\`\`
npm install
\`\`\`

Run the repo checks before shipping:

- \`npm run lint:html\` — catches Tailwind colour utilities or inline colours in HTML fragments.
- \`npm run lint:css\` — blocks raw colour literals outside the shared theme overrides.
- \`npm run lint:repo\` — validates manifest links and interactive scaffolding.

### Adding a new question

1. Copy \`questions/q-template/\` to \`questions/qXX/\` (two-digit id).
2. Customize \`answer.html\`, \`interactive.html\`, and \`interactive.js\` (ensure it exports \`interactiveScript\`).
3. Add the id to \`questions/manifest.json\` with a \`dir\` entry and update \`interactiveTitle\`.
4. Verify \`availableQuestions\` (and learning paths) in \`js/app.js\`, update \`/q/XX.html\`, then follow \`QUESTION_TEMPLATE_GUIDE.md\` and \`QUESTION_CHECKLIST.md\`.

Question assets:
- \`answer.html\`: HTML fragment rendered inside the viewer
- \`interactive.html\`: markup for controls/results
- \`interactive.js\`: exports \`interactiveScript\` (CommonJS + browser global)
- MathJax: call \`window.MathJax?.typesetPromise\` after injecting new math markup

### Adding a new paper explainer

1. Copy \`papers/p-template/\` to \`papers/pXX/\` (two-digit id).
2. Populate \`overview.html\` (executive quick take, callouts, evidence, roadmap) and \`interactive.html\`/\`interactive.js\` (embedding controls, coverage outlook, LIMIT-style simulator).
3. Add the entry to \`papers/manifest.json\` with \`dir\`, author metadata, \`summary\`, and \`relatedQuestions\`; update \`p/XX.html\` based on \`p/_template.html\`.
4. Hard-refresh \`index.html#paper-XX\` to verify the landing card, interactive, and related-question links. Follow \`PAPER_TEMPLATE_GUIDE.md\` and \`PAPER_CHECKLIST.md\` for detailed steps.

Paper assets:
- \`overview.html\`: HTML fragment rendered inside the paper viewer
- \`interactive.html\`: markup for the stress tester controls/results
- \`interactive.js\`: exports \`interactiveScript\` (CommonJS + browser global)
- Scenario data: define realistic queries, expected documents, and hints inside the simulator configuration


### Notable implementation details

- Custom loader reads \`questions/manifest.json\` and fetches HTML/JS assets per question directory
- Adjacent questions are opportunistically preloaded to reduce perceived latency
- MathJax rendering is retried on transient errors; see \`index.html\` startup config

### AI-assisted coding prompt

See \`COPILOT_SYSTEM_PROMPT.md\` for repository-wide rules when using AI assistants.

- Commit/push only on explicit user request
- Assume a local test server at <http://127.0.0.1:5501> for smoke checks


## 📽 Attribution

Questions are based on the overview here:
Top 50 LinkedIn LLM interview questions (LinkedIn):
<https://www.linkedin.com/posts/hoang-van-hao_top-50-linkedin-llm-interview-questions-activity-7332959385280778240-lyU0/>

## 🏤 Contributing

Contributions are welcome. Please:

1) Fork the repo and create a feature branch
2) Follow the question contract and style conventions
3) Test thoroughly (try multiple browsers)
4) Open a PR with a concise description and screenshots/GIFs if UI changes


## 📔 License

This project is open source under the [MIT License](LICENSE).

## 🏾 Recent updates

- Added question 51 (end-to-end LLM lifecycle) and interactive pipeline explorer
- Added questions 46-50 with interactive explorers
- Added searchable Glossary with cross-links to questions
- Improved deployment trade-offs explorer (Q50) and math rendering resilience
- Footer attribution and MIT LICENSE added

---

Built for the LLM community.
