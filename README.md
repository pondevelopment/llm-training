# Top 50 LLM Interview Questions

[➡️ Open the latest version (GitHub Pages)](https://pondevelopment.github.io/llm-training/#question-1)


An interactive learning experience with hands-on examples for the most important Large Language Model (LLM) interview questions.

## 🎯 Overview

This project is a single‑page, static web app covering 50 essential LLM questions. Every question includes a clear explanation and most include interactive mini‑simulators. There’s also a searchable Glossary with deep links into the questions.

## � Features

- 50 curated questions with explanations and interactive widgets
- Searchable in‑app Glossary with “Learn more: Question N →” cross‑links
- Shareable deep links per question (Share button or press “S”)
- Keyboard navigation (← / →), and a top dropdown to jump anywhere
- Math rendering via MathJax (inline and display equations)
- Lightweight: pure HTML/JS/CSS; no build step needed; mobile-friendly

## 📚 Topics covered (selection)

- Tokenization, embeddings, attention and multi‑head attention
- Context window, KV cache, decoding (greedy, beam, top‑k/top‑p, temperature)
- LoRA/QLoRA and PEFT, RLHF and alignment
- MoE, RAG, few/zero‑shot prompting, CoT
- Math foundations: softmax, cross‑entropy, gradients, Jacobians, eigenvalues
- Deployment trade‑offs: latency, cost, safety, privacy, quantization, distillation

## 🛠️ Technologies

- HTML + Tailwind CSS (CDN)
- Vanilla JavaScript
- MathJax v3 (tex-svg)

## 📁 Project structure

```text
top-50-llm-questions/
├── index.html                 # App shell (header, viewer, glossary modal, footer)
├── js/
│   ├── app.js                # SPA navigation, deep links, caching, MathJax hooks
│   ├── questionLoader.js     # Safe dynamic loader for question modules
│   └── glossary.js           # Searchable glossary with in‑app navigation
├── questions/
│   ├── question-01.js … question-50.js   # Individual questions
│   └── question-template.js              # Template for new questions
├── QUESTION_TEMPLATE_GUIDE.md            # Authoring guidance
├── QUESTION_CHECKLIST.md                 # Review & test checklist
├── COPILOT_SYSTEM_PROMPT.md              # AI-assisted coding system prompt
├── LICENSE                               # MIT License
└── README.md
```

## 🎮 How to run

1) Download or clone the repo
2) Open `index.html` in a modern browser (no server needed)

Tips inside the app:

- Use the dropdown or ← / → to navigate
- Press “S” to copy a shareable deep link to the current question
- Click “Glossary” in the header to browse definitions and jump to questions


## 🔧 Development

### Adding a new question

1. Copy `questions/question-template.js` to a new file (e.g., `question-51.js`)
2. Export your question using CommonJS: `module.exports = question;`
3. Add the number to `availableQuestions` and the title to `questionTitles` in `js/app.js`
4. Follow `QUESTION_TEMPLATE_GUIDE.md` and verify with `QUESTION_CHECKLIST.md`

Question contract:

- question = { title, answer (HTML string), interactive?: { title, html, script() } }
- MathJax: escape backslashes and “<” inside JS strings (use `\\` and `&lt;`)


### Notable implementation details

- Custom loader executes question files in an isolated context and returns either a global `question` symbol or `module.exports`
- Adjacent questions are opportunistically preloaded to reduce perceived latency
- MathJax rendering is retried on transient errors; see `index.html` startup config

### AI-assisted coding prompt

See `COPILOT_SYSTEM_PROMPT.md` for repository-wide rules when using AI assistants.

- Commit/push only on explicit user request
- Assume a local test server at <http://127.0.0.1:5501> for smoke checks


## 📎 Attribution

Questions are based on the overview here:
Top 50 LinkedIn LLM interview questions (LinkedIn):
<https://www.linkedin.com/posts/hoang-van-hao_top-50-linkedin-llm-interview-questions-activity-7332959385280778240-lyU0/>

## 🤝 Contributing

Contributions are welcome. Please:

1) Fork the repo and create a feature branch
2) Follow the question contract and style conventions
3) Test thoroughly (try multiple browsers)
4) Open a PR with a concise description and screenshots/GIFs if UI changes


## 📝 License

This project is open source under the [MIT License](LICENSE).

## 🔄 Recent updates

- Added questions 46–50 with interactive explorers
- Added searchable Glossary with cross‑links to questions
- Improved deployment trade‑offs explorer (Q50) and math rendering resilience
- Footer attribution and MIT LICENSE added

—

Built for the LLM community.
