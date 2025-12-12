# Multi-Agent Frameworks Interactive Tutorial

An interactive tutorial teaching production-grade multi-agent framework patterns: context engineering, tiered state, processor pipelines, and scoped handoffs.

## Live demo

**URL:** [https://pondevelopment.github.io/llm-training/tutorials/multi-agent-frameworks/dist/](https://pondevelopment.github.io/llm-training/tutorials/multi-agent-frameworks/dist/)

## What you’ll learn

- Why giant prompts don’t scale (cost, latency, signal degradation)
- Context as a compiled view (storage vs presentation)
- Tiered context design (working context, session, memory, artifacts)
- Processor pipelines (observable, testable transformations)
- Scoped multi-agent handoffs (avoid context explosion)

## Local development

```bash
cd tutorials/multi-agent-frameworks
npm install
npm run dev
```

## Build

```bash
cd tutorials/multi-agent-frameworks
./build.sh
```

## Source

Primary inspiration:

- [Architecting efficient context-aware multi-agent framework for production](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)
