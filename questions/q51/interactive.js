const interactiveScript = () => {
  const buttons = Array.from(document.querySelectorAll('.q51-stage'));
  const metricsEl = document.getElementById('q51-metrics');
  const explainEl = document.getElementById('q51-explain');
  const indicatorEl = document.getElementById('q51-stage-indicator');
  const insightEl = document.getElementById('q51-insight');
  const progressSegs = Array.from(document.querySelectorAll('#q51-progress .q51-progress-seg'));
  const nextButton = document.getElementById('q51-next-stage');
  const stepLabel = document.getElementById('q51-step-label');
  if (!buttons.length || !metricsEl || !explainEl || !indicatorEl || !insightEl || !progressSegs.length || !nextButton) return;

  const STORAGE_KEY = 'q51-stage-v2';
  const LEGACY_KEY = 'q51-stage';
  const ORDER = ['pretrain', 'adapt', 'align', 'opt', 'guard', 'monitor'];
  const STAGES = {
    pretrain: {
      name: 'Pre-training',
      metrics: { ComputeShare: 0.75, DataScale: 1.0, ParamUpdate: 1.0 },
      expl: [
        `Goal: teach the model the broad statistical patterns of language and code by predicting the next token. No human labels required&mdash;the data itself supplies the supervision.`,
        `Mental model: like reading most of the public internet, books, code, and articles on repeat, learning which fragments follow each context.`,
        `<ul><li><strong>Input:</strong> Huge corpus &rarr; token sequences after cleaning, deduplication, and filtering.</li><li><strong>Objective:</strong> Maximize log-likelihood of the next token.</li><li><strong>Signals:</strong> Loss trending down; validation loss plateau signals diminishing returns.</li><li><strong>Key levers:</strong> Data quality, curriculum ordering, model depth/width, optimizer, schedule.</li></ul>`,
        `<div class="q51-callout" data-tone="indigo"><strong>Common pitfalls</strong> Junk HTML, duplicates, or skewed domains waste compute and bias outputs; weak deduping inflates apparent performance.</div>`,
        `Remember: better data beats blindly bigger data once you hit scale.`
      ],
      insight: 'Most leverage: architecture, data quality, and curriculum scheduling compound gains.'
    },
    adapt: {
      name: 'Adaptation (SFT/PEFT)',
      metrics: { ComputeShare: 0.05, DataScale: 0.02, ParamUpdate: 0.1 },
      expl: [
        `Goal: steer the generalist toward a domain (legal, medical, support) or interaction style with supervised fine-tuning.`,
        `We pair prompts with desired outputs so the model learns formatting, tone, and structure that base training missed.`,
        `<ul><li><strong>Approaches:</strong> Full fine-tune (expensive) versus PEFT options like LoRA, adapters, QLoRA.</li><li><strong>Why PEFT:</strong> Faster iteration, lower VRAM, safer rollback.</li><li><strong>Data:</strong> Smaller but curated and high signal.</li></ul>`,
        `<div class="q51-callout" data-tone="purple"><strong>Common pitfalls</strong> Overfitting to narrow templates, catastrophic forgetting during prolonged full fine-tunes, and noisy synthetic pairs degrading style.</div>`,
        `Heuristic: stop when validation loss plateaus&mdash;over-training erodes generality.`
      ],
      insight: 'High ROI: small curated datasets shift capability without retraining the base.'
    },
    align: {
      name: 'Alignment (RLHF/DPO)',
      metrics: { ComputeShare: 0.1, DataScale: 0.005, ParamUpdate: 0.05 },
      expl: [
        `Goal: make outputs useful, safe, and honest according to human preference rather than merely probable text.`,
        `Two tracks dominate: RLHF (collect ranked pairs &rarr; train reward model &rarr; PPO fine-tuning) and DPO (closed-form objective on chosen vs rejected responses).`,
        `<ul><li><strong>Data:</strong> Human or high-quality synthetic comparisons of model answers.</li><li><strong>Reward model risk:</strong> Susceptible to reward hacking and overfitting to artifacts.</li><li><strong>DPO benefit:</strong> Simpler, more stable pipeline with fewer moving parts.</li><li><strong>Metrics:</strong> Win rate on held-out preference sets plus safety benchmarks.</li></ul>`,
        `<div class="q51-callout" data-tone="amber"><strong>Common pitfalls</strong> Low-quality preference labels, reward hacking, and ignoring safety edge cases (prompt injection, self-harm) leave dangerous gaps.</div>`,
        `Alignment sculpts behaviour, not the base knowledge stored during pre-training.`
      ],
      insight: 'Quality beats quantity: cleaner preference data outruns sheer volume.'
    },
    opt: {
      name: 'Inference optimization',
      metrics: { LatencyCut: 0.6, MemorySave: 0.5, ThroughputBoost: 0.4 },
      expl: [
        `Goal: deliver answers faster and cheaper without unacceptable quality loss.`,
        `Tactics stack: quantization, pruning, KV-cache reuse for multi-turn, batching, and speculative decoding.`,
        `<ul><li><strong>Latency levers:</strong> Shorter sequences, dynamic batching, speculative decoding.</li><li><strong>Cost levers:</strong> Quantization (INT8/INT4), right-sized models, high accelerator utilization.</li><li><strong>Monitoring:</strong> Track tokens per second, cache hit rate, and quality deltas versus baseline.</li></ul>`,
        `<div class="q51-callout" data-tone="emerald"><strong>Common pitfalls</strong> Over-quantization that hurts reasoning, ignoring tail latency, or underutilised accelerators due to poor scheduling.</div>`,
        `Rule of thumb: layer multiple 5&ndash;15% wins&mdash;they compound quickly.`
      ],
      insight: 'Stack small wins (KV cache + quantization + batching) for compounding savings.'
    },
    guard: {
      name: 'Guardrails & grounding',
      metrics: { FilterCoverage: 0.7, RAGBoost: 0.5, RiskReduction: 0.4 },
      expl: [
        `Goal: keep outputs factual, compliant, and low risk.`,
        `Two pillars: grounding via retrieval-augmented generation plus filtering before and after generation to enforce policy.`,
        `<ul><li><strong>Inbound checks:</strong> Prompt classification for self-harm, PII, jailbreak attempts.</li><li><strong>Context injection:</strong> Retrieve top-k passages (vector or hybrid search) to augment the prompt.</li><li><strong>Outbound checks:</strong> Toxicity, PII, and hallucination heuristics on responses.</li><li><strong>Red-teaming:</strong> Adversarial prompts to expose bypasses.</li></ul>`,
        `<div class="q51-callout" data-tone="amber"><strong>Common pitfalls</strong> Over-aggressive filters harm usefulness, stale retrieval indices drift, and thin logging hinders audits.</div>`,
        `Principle: ground first, then align filtering thresholds to acceptable risk tolerance.`
      ],
      insight: 'Grounding plus filtering lowers hallucinations and policy risk simultaneously.'
    },
    monitor: {
      name: 'Monitoring & evaluation',
      metrics: { DriftWatch: 0.5, BiasScan: 0.4, FeedbackLoop: 0.6 },
      expl: [
        `Goal: ensure the system stays reliable as data, users, and prompts evolve.`,
        `Think of monitoring as the nervous system feeding signals back into adaptation and alignment phases.`,
        `<ul><li><strong>Operational metrics:</strong> Latency p95/p99, cost per 1K tokens, error rates.</li><li><strong>Quality metrics:</strong> Win rate versus baseline, factuality spot checks, hallucination flags.</li><li><strong>Safety metrics:</strong> Policy violations, prompt injection success, abuse reports.</li><li><strong>Drift detection:</strong> Shifts in embedding distributions or topic mix.</li></ul>`,
        `<div class="q51-callout" data-tone="rose"><strong>Common pitfalls</strong> Averages hide tail failures, missing regression suites, and ignoring user feedback loops.</div>`,
        `Upgrade loop: monitor &rarr; analyse &rarr; curate new data &rarr; adapt or re-align &rarr; redeploy.`
      ],
      insight: 'Instrumentation is an enabling feature, not an afterthought.'
    }
  };

  const pctBar = (label, value) => {
    const pct = Math.round(value * 100);
    return `<div class="q51-metric"><div class="q51-metric-label"><span>${label}</span><span>${pct}%</span></div><div class="q51-meter" role="presentation"><div class="q51-meter-fill" style="width:${pct}%"></div></div></div>`;
  };

  const select = stageKey => {
    const cfg = STAGES[stageKey];
    if (!cfg) return;
    const index = ORDER.indexOf(stageKey);

    buttons.forEach(btn => {
      const active = btn.dataset.stage === stageKey;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });

    progressSegs.forEach((seg, idx) => {
      seg.classList.toggle('is-complete', idx < index);
      seg.classList.toggle('is-active', idx === index);
    });

    indicatorEl.textContent = `${index + 1}. ${cfg.name}`;
    if (stepLabel) stepLabel.textContent = `Step ${index + 1} of ${ORDER.length}`;
    metricsEl.innerHTML = Object.entries(cfg.metrics).map(([label, value]) => pctBar(label, value)).join('');
    explainEl.innerHTML = cfg.expl.map(block => {
      const normalized = block.trim();
      return normalized.startsWith('<') ? normalized : `<p>${normalized}</p>`;
    }).join('');
    insightEl.textContent = cfg.insight;
    const nextIndex = (index + 1) % ORDER.length;
    const nextKey = ORDER[nextIndex];
    const nextName = STAGES[nextKey].name;
    const isLast = index === ORDER.length - 1;
    nextButton.dataset.target = nextKey;
    nextButton.textContent = isLast ? `Restart: ${nextName}` : `Next: ${nextName}`;
    nextButton.setAttribute('aria-label', isLast ? `Restart lifecycle at ${nextName}` : `Go to next stage ${nextName}`);

    try {
      localStorage.setItem(STORAGE_KEY, stageKey);
    } catch (_) {}

    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([explainEl]).catch(() => {});
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => select(btn.dataset.stage));
  });

  nextButton.addEventListener('click', () => {
    const target = nextButton.dataset.target;
    if (target) select(target);
  });

  document.addEventListener('keydown', event => {
    const tag = document.activeElement?.tagName;
    if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

    const activeKey = buttons.find(btn => btn.getAttribute('aria-selected') === 'true')?.dataset.stage;
    if (!activeKey) return;

    const currentIndex = ORDER.indexOf(activeKey);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      select(ORDER[Math.min(currentIndex + 1, ORDER.length - 1)]);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      select(ORDER[Math.max(currentIndex - 1, 0)]);
    } else if (/^[1-6]$/.test(event.key)) {
      event.preventDefault();
      const next = ORDER[parseInt(event.key, 10) - 1];
      if (next) select(next);
    }
  });

  let initial = 'pretrain';
  try {
    localStorage.removeItem(LEGACY_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ORDER.includes(saved)) initial = saved;
  } catch (_) {}

  select(initial);
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question51Interactive = interactiveScript;
}
