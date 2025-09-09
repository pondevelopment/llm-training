// Question 51: LLM Definition & Training Pipeline
// Created: 2025-09-09
// Educational Focus: Unify the end-to-end lifecycle: architecture concept, pre-training objective, adaptation, alignment, deployment.

const question = {
  title: "51. What is an LLM, and how are LLMs trained end-to-end?",
  answer: `<div class="space-y-4">
    <!-- Recommended Reading Cross-links -->
    <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
      <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
      <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-07">Question 7: What are embeddings?</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-12">Question 12: How do LLMs scale with parameters?</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-24">Question 24: What is parameter-efficient fine-tuning?</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-17">Question 17: RLHF & preference optimization</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-45">Question 45: Reducing bias & hallucinations</a></li>
      </ul>
      <p class="text-xs text-indigo-700 mt-2">Lifecycle drill-down: representation (embeddings), scaling laws, adaptation efficiency, alignment, risk mitigation.</p>
    </div>

    <!-- Core Definition -->
    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
      <h4 class="font-semibold text-blue-900 mb-2">🧠 What is a Large Language Model (LLM)?</h4>
      <p class="text-blue-800">An LLM is a transformer-based neural network with billions of parameters trained (self-supervised) to predict the next token given prior context. Through scale (data + parameters + compute) it internalizes statistical structure of language and can generalize across tasks via prompting or light adaptation.</p>
      <div class="math-display">$$\\begin{aligned}
        \\text{Objective:}\\quad & \\max_{\\theta} \\; \\mathbb{E}_{(x_1,\\dots,x_T)\\sim \\mathcal{D}} \\sum_{t=1}^{T} \\log p_{\\theta}(x_t \\mid x_{\\le t}) \\\\
        \\text{Tokenization:}\\quad & x_t = \\text{BPE}(\\text{text}) \\\\
        \\text{Context Window:}\\quad & (x_1, \\dots, x_T),\\; T \\leq L_{\\text{max}} \\\\
        \\text{Inference:}\\quad & x_{t+1} \\sim p_{\\theta}(\\cdot \\mid x_{\\leq t})
      \\end{aligned}$$</div>
    </div>
     
    <!-- Pipeline Stages Grid -->
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
        <h5 class="font-medium text-green-900">1. Pre-training</h5>
        <p class="text-sm text-green-700">Predict next token over massive diverse corpora (code, web, books). Self-supervised.</p>
        <code class="text-xs bg-green-100 px-1 rounded">Trillions tokens → general world & syntax priors</code>
      </div>
      <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
        <h5 class="font-medium text-purple-900">2. Adaptation</h5>
        <p class="text-sm text-purple-700">Domain / task specialization via SFT or PEFT (LoRA, adapters, QLoRA) on curated data.</p>
        <code class="text-xs bg-purple-100 px-1 rounded">"Base" → domain-tuned</code>
      </div>
      <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
        <h5 class="font-medium text-orange-900">3. Alignment</h5>
        <p class="text-sm text-orange-700">Human feedback stages: preference data → reward model → RLHF / DPO for helpfulness & safety.</p>
        <code class="text-xs bg-orange-100 px-1 rounded">SFT → RLHF / DPO</code>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-emerald-50 p-3 rounded border-l-4 border-emerald-400">
        <h5 class="font-medium text-emerald-900">4. Optimization</h5>
        <p class="text-sm text-emerald-700">Quantization, pruning, KV cache, speculative decoding to cut latency & cost.</p>
        <code class="text-xs bg-emerald-100 px-1 rounded">INT4 / sparsity / caching</code>
      </div>
      <div class="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
        <h5 class="font-medium text-amber-900">5. Guardrails</h5>
        <p class="text-sm text-amber-700">Safety filters, retrieval grounding, policy + red-teaming reduce harmful or hallucinated outputs.</p>
        <code class="text-xs bg-amber-100 px-1 rounded">RAG + filters</code>
      </div>
      <div class="bg-rose-50 p-3 rounded border-l-4 border-rose-400">
        <h5 class="font-medium text-rose-900">6. Monitoring</h5>
        <p class="text-sm text-rose-700">Usage, drift, bias, latency & cost metrics feed continuous evaluation loops.</p>
        <code class="text-xs bg-rose-100 px-1 rounded">Eval + telemetry</code>
      </div>
    </div>

    <!-- Why This Matters -->
    <div class="bg-yellow-50 p-4 rounded-lg">
      <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>• <strong>Holistic View:</strong> Consolidates disparate lifecycle stages into one mental model.</li>
        <li>• <strong>Cost Focus:</strong> Most compute in pre-training; adaptation & alignment multiply value.</li>
        <li>• <strong>Risk Control:</strong> Guardrails & monitoring mitigate drift, bias, hallucination.</li>
        <li>• <strong>Leverage:</strong> Efficient adapters & quantization let teams reuse frontier bases.</li>
      </ul>
    </div>
  </div>`,
  interactive: {
    title: "🔍 LLM Training Pipeline Explorer",
    html: `<div class="space-y-6">
      <style>
        /* Explicit styling so active tab always has visible contrast (fallback if class toggling fails) */
        .q51-rail .stage-btn[aria-selected="true"] {
          background:#4f46e5 !important; /* indigo-600 */
          color:#fff !important;
          border-color:#4f46e5 !important;
          box-shadow:0 0 0 1px #4338ca inset,0 1px 2px rgba(0,0,0,.08);
        }
        .q51-rail .stage-btn[aria-selected="true"]:hover { background:#4338ca !important; }
        .q51-rail .stage-btn { transition:background .15s,border-color .15s,color .15s; }
        /* Provide a subtle focus outline for accessibility */
        .q51-rail .stage-btn:focus-visible { outline:2px solid #6366f1; outline-offset:2px; }
      </style>
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between flex-wrap gap-3 mb-3">
          <label class="block text-sm font-medium text-gray-700">🧪 Lifecycle Flow</label>
          <div id="q51-step-label" class="text-[11px] font-mono px-2 py-0.5 rounded bg-white/70 border border-indigo-200 text-indigo-700"></div>
        </div>
        <!-- Segmented progress bar -->
        <div class="flex items-center gap-1 mb-3" id="q51-progress" aria-hidden="true">
          ${Array.from({length:6}).map(()=>'<span class="flex-1 h-1.5 rounded-full bg-indigo-100 progress-seg"></span>').join('')}
        </div>
        <!-- Horizontal ordered rail with arrows -->
        <div class="q51-rail flex flex-wrap items-center gap-1" role="tablist" aria-label="LLM training lifecycle">
          ${[
            ['pretrain','1. Pre-train','Massive self-supervised objective builds general priors'],
            ['adapt','2. Adapt','Supervised / PEFT specialization'],
            ['align','3. Align','Preference optimization (RLHF/DPO)'],
            ['opt','4. Optimize','Latency / cost efficiency improvements'],
            ['guard','5. Guard','Safety & grounding controls'],
            ['monitor','6. Monitor','Continuous evaluation & feedback']
          ].map(([key,label,tip],i,arr)=>{
            const arrow = i < arr.length-1 ? '<span class=\"text-[10px] text-indigo-400 mx-0.5 select-none\" aria-hidden=\"true\">➜</span>' : '';
            return `<button role=\"tab\" data-stage=\"${key}\" aria-selected=\"false\" title=\"${tip}\" class=\"q51-stage stage-btn px-2.5 py-1 rounded-md text-[11px] font-medium bg-white border border-indigo-200 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors\">${label}</button>${arrow}`;
          }).join('')}
        </div>
        <p class="text-[11px] text-indigo-700 mt-1">Ordered flow from pre-training → monitoring. Use ←/→ or 1–6 keys to navigate. Tooltips give quick intent.</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-medium text-gray-900">📈 Stage Profile</h4>
          <div id="q51-stage-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
        </div>
        <div id="q51-metrics" class="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs"></div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <h5 class="font-semibold text-gray-800 mb-2">🧠 Explanation</h5>
        <div id="q51-explain" class="text-xs text-gray-700 space-y-2"></div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h5 class="font-semibold text-green-900 mb-1">💡 Insight</h5>
        <div id="q51-insight" class="text-sm text-green-800" aria-live="polite"></div>
      </div>
    </div>`,
    script: () => {
      const buttons = Array.from(document.querySelectorAll('.q51-stage'));
      const metricsEl = document.getElementById('q51-metrics');
      const explainEl = document.getElementById('q51-explain');
      const indicatorEl = document.getElementById('q51-stage-indicator');
      const insightEl = document.getElementById('q51-insight');
      const progressSegs = Array.from(document.querySelectorAll('#q51-progress .progress-seg'));
      const stepLabel = document.getElementById('q51-step-label');
      if (!buttons.length || !metricsEl || !explainEl || !indicatorEl || !insightEl || !progressSegs.length) return;

      const ORDER = ['pretrain','adapt','align','opt','guard','monitor'];
  const STAGES = {
        pretrain: {
          name: 'Pre-training',
          metrics: { ComputeShare: 0.75, DataScale: 1.0, ParamUpdate: 1.0 },
          expl: [
    'Goal: teach the model the broad statistical patterns of language and code by predicting the next token. No human labels required — the data itself supplies the supervision.',
    'Mental model: like reading most of the public internet, books, code and articles, repeatedly, and learning which fragments follow which contexts.',
    '<ul class="list-disc ml-4 text-[11px] space-y-1"><li><strong>Input:</strong> Huge corpus → token sequences (after cleaning, dedup, filtering).</li><li><strong>Objective:</strong> Maximize log‑likelihood of correct next token.</li><li><strong>Signals:</strong> Loss trending down smoothly; validation loss plateau indicates diminishing returns.</li><li><strong>Key Levers:</strong> Data quality, curriculum ordering, model depth/width, optimizer & schedule.</li></ul>',
    '<div class="text-[11px] bg-white/70 rounded p-2 border border-indigo-100"><strong>Common pitfalls:</strong> Trash data (HTML boilerplate, duplicates) wastes compute; token distribution skew (too much code or one language) biases outputs; insufficient de-duplication inflates apparent performance.</div>',
    'If you only remember one thing: <em>better data beats blindly bigger data once you hit scale.</em>'
          ],
          insight: 'Most leverage: architecture + data quality + scale scheduling (curriculum / mixture).'
        },
        adapt: {
          name: 'Adaptation (SFT/PEFT)',
            metrics: { ComputeShare: 0.05, DataScale: 0.02, ParamUpdate: 0.1 },
          expl: [
    'Goal: steer the broad “generalist” into a domain (legal, medical, support) or task style (instruction following, reasoning).',
    'We feed input → desired output pairs (instructions + answers). The model learns stylistic + formatting conventions it didn’t fully internalize in raw pre-training.',
    '<ul class="list-disc ml-4 text-[11px] space-y-1"><li><strong>Approaches:</strong> Full fine-tune (expensive) vs PEFT (LoRA, adapters, QLoRA) touching only a small % of parameters.</li><li><strong>Why PEFT:</strong> Faster iteration, lower VRAM, safer rollback.</li><li><strong>Data:</strong> Smaller (thousands–hundreds of thousands examples) but curated & high signal.</li></ul>',
    '<div class="text-[11px] bg-white/70 rounded p-2 border border-purple-100"><strong>Common pitfalls:</strong> Overfitting to narrow templates; catastrophic forgetting of base knowledge if full fine-tuned too long; noisy synthetic pairs degrading style.</div>',
    'Key heuristic: stop when validation loss no longer meaningfully drops — over-training burns generality.'
          ],
          insight: 'High ROI: small curated datasets shift capability without retraining base.'
        },
        align: {
          name: 'Alignment (RLHF/DPO)',
          metrics: { ComputeShare: 0.1, DataScale: 0.005, ParamUpdate: 0.05 },
          expl: [
    'Goal: make outputs <em>useful, safe, honest</em> according to human preference rather than merely probable text.',
    'Two major tracks: (1) RLHF pipeline (collect ranked pairs → train reward model → optimize policy with PPO), (2) Direct Preference Optimization (DPO) skips explicit RL loop using a closed-form objective on chosen vs rejected responses.',
    '<ul class="list-disc ml-4 text-[11px] space-y-1"><li><strong>Data:</strong> Human (or high-quality synthetic) comparisons of model answers.</li><li><strong>Reward model risk:</strong> It can overfit to superficial patterns (“reward hacking”).</li><li><strong>DPO benefit:</strong> Simpler, more stable, fewer moving parts.</li><li><strong>Metrics:</strong> Win‑rate on held‑out preference sets, safety benchmark scores.</li></ul>',
    '<div class="text-[11px] bg-white/70 rounded p-2 border border-orange-100"><strong>Common pitfalls:</strong> Low-quality preference labels dilute alignment; reward over-optimization reduces diversity; ignoring safety edge cases (prompt injection, self-harm) leaves gaps.</div>',
    'Remember: Alignment tunes <em>behavior</em>, not core knowledge — it sculpts responses, not facts stored.'
          ],
          insight: 'Quality > quantity: cleaner preference data outperforms sheer volume.'
        },
        opt: {
          name: 'Inference Optimization',
          metrics: { LatencyCut: 0.6, MemorySave: 0.5, ThroughputBoost: 0.4 },
          expl: [
    'Goal: deliver answers faster and cheaper without unacceptable quality loss.',
    'Tactics layer: quantization (lower precision weights), pruning (remove redundant structure), caching (KV reuse for multi-turn), batching & speculative decoding (draft + verify).',
    '<ul class="list-disc ml-4 text-[11px] space-y-1"><li><strong>Latency levers:</strong> Shorter sequences, batching, speculative decoding.</li><li><strong>Cost levers:</strong> Quantization (INT8/4), server utilization, model size selection.</li><li><strong>Monitoring:</strong> Track tokens/sec, cache hit rate, quality drop vs baseline.</li></ul>',
    '<div class="text-[11px] bg-white/70 rounded p-2 border border-emerald-100"><strong>Common pitfalls:</strong> Over‑quantization introducing subtle reasoning regressions; ignoring tail latency; underutilized GPUs due to poor batching.</div>',
    'Rule of thumb: stack multiple 5–15% wins — they compound significantly.'
          ],
          insight: 'Stack small gains (KV cache + quant + batching) for compounding savings.'
        },
        guard: {
          name: 'Guardrails & Grounding',
          metrics: { FilterCoverage: 0.7, RAGBoost: 0.5, RiskReduction: 0.4 },
          expl: [
    'Goal: keep outputs factual, compliant, and low-risk.',
    'Two pillars: (1) <strong>Grounding</strong> via Retrieval-Augmented Generation (RAG) → attach authoritative snippets; (2) <strong>Filtering</strong> pre- & post-generation to block unsafe or policy-violating content.',
    '<ul class="list-disc ml-4 text-[11px] space-y-1"><li><strong>Inbound checks:</strong> Prompt classification (self-harm, PII, jailbreak attempts).</li><li><strong>Context injection:</strong> Retrieve top-k passages (vector / hybrid search) → augment prompt.</li><li><strong>Outbound checks:</strong> Toxicity, PII, hallucination heuristics (fact confidence).</li><li><strong>Red-teaming:</strong> Adversarial prompts to discover bypasses.</li></ul>',
    '<div class="text-[11px] bg-white/70 rounded p-2 border border-amber-100"><strong>Common pitfalls:</strong> Over-aggressive filters harming usability; stale retrieval index; not logging enough for forensic analysis.</div>',
    'Principle: Ground first, then align filtering thresholds to acceptable risk tolerance.'
          ],
          insight: 'Grounding + filtering synergy: lower hallucination and policy risk simultaneously.'
        },
        monitor: {
          name: 'Monitoring & Evaluation',
          metrics: { DriftWatch: 0.5, BiasScan: 0.4, FeedbackLoop: 0.6 },
          expl: [
    'Goal: ensure the system stays reliable as data, users, and prompts evolve.',
    'Think of this as the “nervous system” feeding signals back into adaptation & alignment phases.',
    '<ul class="list-disc ml-4 text-[11px] space-y-1"><li><strong>Operational metrics:</strong> Latency p95/p99, cost per 1K tokens, error rates.</li><li><strong>Quality metrics:</strong> Win‑rate vs baseline, factuality spot checks, hallucination flags.</li><li><strong>Safety metrics:</strong> Policy violation rate, prompt injection success rate.</li><li><strong>Drift detection:</strong> Shift in embedding distributions or topic mix.</li></ul>',
    '<div class="text-[11px] bg-white/70 rounded p-2 border border-rose-100"><strong>Common pitfalls:</strong> Only tracking averages (missing tail anomalies); no golden set for regression tests; ignoring user feedback signals.</div>',
    'Upgrade loop: Monitor → Analyze → Curate new data → Adapt / Re-align → Re-deploy.'
          ],
          insight: 'Instrumentation is an enabling feature, not an afterthought.'
        }
      };

      function pctBar(label, v) {
        const pct = Math.round(v * 100);
        return `<div class=\"space-y-1\"><div class=\"flex justify-between text-[10px] uppercase tracking-wide text-gray-500\"><span>${label}</span><span>${pct}%</span></div><div class=\"w-full h-2 bg-gray-200 rounded overflow-hidden\"><div class=\"h-2 bg-indigo-500\" style=\"width:${pct}%\"></div></div></div>`;
      }

      function select(stageKey) {
        const cfg = STAGES[stageKey];
        if (!cfg) return;
        const index = ORDER.indexOf(stageKey);
        buttons.forEach((b,i)=>{
          const active = b.dataset.stage === stageKey;
          b.setAttribute('aria-selected', active ? 'true' : 'false');
          b.setAttribute('tabindex', active ? '0' : '-1');
          b.classList.remove('bg-indigo-600','text-white','border-indigo-600','shadow','cursor-default','hover:bg-indigo-700');
          // Always ensure inactive can show light hover
          if(!b.classList.contains('hover:bg-indigo-50')) b.classList.add('hover:bg-indigo-50');
          if(active){
            b.classList.add('bg-indigo-600','text-white','border-indigo-600','shadow','cursor-default','hover:bg-indigo-700');
            // Remove the light hover that causes white-on-white contrast issue
            b.classList.remove('hover:bg-indigo-50');
          }
        });
        // Progress segments fill up to current
        progressSegs.forEach((seg,i)=>{
          seg.classList.remove('bg-indigo-600','bg-indigo-300');
          if(i < index) seg.classList.add('bg-indigo-600');
          else if(i === index) seg.classList.add('bg-indigo-300');
        });
        indicatorEl.textContent = `${index+1}. ${cfg.name}`;
        if(stepLabel) stepLabel.textContent = `Step ${index+1}/6`;
        metricsEl.innerHTML = Object.entries(cfg.metrics).map(([k,v])=>pctBar(k, v)).join('');
  explainEl.innerHTML = cfg.expl.map(p=> p.startsWith('<') ? p : `<p>${p}</p>`).join('');
        insightEl.textContent = cfg.insight;
        try { localStorage.setItem('q51-stage', stageKey); } catch(_) {}
        // No dynamic math in this component currently, but keep pattern consistent.
        setTimeout(()=>{ if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]); }, 25);
      }

      // Event listeners (mouse + keyboard)
      buttons.forEach(btn=> btn.addEventListener('click', ()=> select(btn.dataset.stage)) );
      document.addEventListener('keydown', e=>{
        if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
        const activeKey = buttons.find(b=>b.getAttribute('aria-selected')==='true')?.dataset.stage;
        if(!activeKey) return;
        const idx = ORDER.indexOf(activeKey);
        if(e.key==='ArrowRight'){ e.preventDefault(); select(ORDER[Math.min(idx+1, ORDER.length-1)]); }
        else if(e.key==='ArrowLeft'){ e.preventDefault(); select(ORDER[Math.max(idx-1,0)]); }
        else if(/^[1-6]$/.test(e.key)){ e.preventDefault(); select(ORDER[parseInt(e.key,10)-1]); }
      });
      // Initial selection (restore from storage)
      let initial = 'pretrain';
      try { const saved = localStorage.getItem('q51-stage'); if(saved && ORDER.includes(saved)) initial = saved; } catch(_) {}
      select(initial);
    }
  }
};

// CommonJS export for tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
