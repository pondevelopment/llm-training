# Tutorials

This directory contains interactive tutorials built with modern web frameworks.

## Available Tutorials

| Tutorial | Path | Tech Stack | Live URL |
|----------|------|------------|----------|
| Agentic Search | `/tutorials/agentic-search/` | React + TypeScript + Vite + Tailwind + Framer Motion | [View](https://pondevelopment.github.io/llm-training/tutorials/agentic-search/dist/) |
| Multi-Agent Frameworks | `/tutorials/multi-agent-frameworks/` | React + TypeScript + Vite + Tailwind | [View](https://pondevelopment.github.io/llm-training/tutorials/multi-agent-frameworks/dist/) |
| Bayesian Bike Recommender | `/tutorials/bayesian-bike-recommender/` | React + Vite + Tailwind + bayesjs + Cytoscape | [View](https://pondevelopment.github.io/llm-training/tutorials/bayesian-bike-recommender/dist/) |
| LLM Fine-Tuning | `/tutorials/llm-fine-tuning/` | React + TypeScript + Vite + Tailwind + Framer Motion | [View](https://pondevelopment.github.io/llm-training/tutorials/llm-fine-tuning/dist/) |

---

## Agentic Search Tutorial

**Path**: `/tutorials/agentic-search/`  
**Tech Stack**: React + TypeScript + Vite + Tailwind CSS + Framer Motion  
**Build Output**: `/tutorials/agentic-search/dist/`

See how AI agents transform single queries into multi-step research workflows using tools, planning, and synthesis.

---

## Multi-Agent Frameworks Tutorial

**Path**: `/tutorials/multi-agent-frameworks/`  
**Tech Stack**: React + TypeScript + Vite + Tailwind CSS  
**Build Output**: `/tutorials/multi-agent-frameworks/dist/`

Learn how production multi-agent systems manage context: tiered state, processor pipelines, and scoped handoffs.

---

## LLM Fine-Tuning Tutorial

**Path**: `/tutorials/llm-fine-tuning/`  
**Tech Stack**: React + TypeScript + Vite + Tailwind CSS + Framer Motion  
**Build Output**: `/tutorials/llm-fine-tuning/dist/`

Master data-centric model customization: from LoRA adapters and small language models to catastrophic forgetting mitigation. Includes:
- LoRA Rank Simulator with VRAM impact visualization
- SLM (Small Language Model) cost-efficiency comparison
- Catastrophic Forgetting visualizer with mitigation strategies
- Multi-provider pricing calculator with real-world examples

---

## Bayesian Bike Recommender Tutorial

**Path**: `/tutorials/bayesian-bike-recommender/`  
**Tech Stack**: React + Vite + Tailwind CSS v4 + bayesjs + Cytoscape  
**Build Output**: `/tutorials/bayesian-bike-recommender/dist/`

Discover how Bayesian networks enhance LLM recommendations by combining probabilistic reasoning with conversational AI. Includes:
- Interactive "Wet Grass" problem demo for Bayesian intuition
- Full bike recommendation system with real-time belief propagation
- Side-by-side comparison of LLM-only vs Bayesian+LLM approaches

---

## Local Development

For any tutorial:

```bash
cd tutorials/<tutorial-name>
npm install
npm run dev
```

Default ports:
- `agentic-search`: http://localhost:5173
- `multi-agent-frameworks`: http://localhost:5173
- `bayesian-bike-recommender`: http://localhost:5174

### Building for Production

```bash
cd tutorials/<tutorial-name>
npm run build
```

Each tutorial outputs to `dist/` with a configured base path for GitHub Pages compatibility.

---

## Deployment

All tutorials are automatically built and deployed via GitHub Actions when changes are pushed to `main`. The workflow:

1. Checks out the repository
2. Installs Node.js 22
3. Builds each tutorial in sequence
4. Deploys everything to GitHub Pages

See `.github/workflows/deploy.yml` for details.

---

## Adding New Tutorials

1. Create a new directory under `tutorials/`
2. Set up your framework/build system (Vite recommended)
3. Configure base path for GitHub Pages: `/llm-training/tutorials/<name>/dist/`
4. Update `.github/workflows/deploy.yml` to build the new tutorial
5. Add a card to `tutorials/index.html`
6. Update this README

## Notes

- The main site is static HTML/CSS; tutorials are separate React sub-apps
- Each tutorial builds independently to its own subdirectory
- Tutorials should be self-contained (no shared runtime dependencies with main site)
