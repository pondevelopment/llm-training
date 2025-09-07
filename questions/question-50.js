// Question 50: What challenges do LLMs face in deployment?
// Created: 2025-08-14
// Educational Focus: Identify key deployment challenges (cost, latency, bias/safety, interpretability, privacy) and explore trade-offs via infra/technique choices.

const question = {
    title: "50. What challenges do LLMs face in deployment?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-47" class="text-indigo-700 underline hover:text-indigo-900">Question 47: Context & perplexity</a></li>
                <li><a href="#question-48" class="text-indigo-700 underline hover:text-indigo-900">Question 48: Hyperparameters</a></li>
                <li><a href="#question-49" class="text-indigo-700 underline hover:text-indigo-900">Question 49: Defining LLM scale & capability</a></li>
                <li><a href="#question-18" class="text-indigo-700 underline hover:text-indigo-900">Question 18: Overfitting & mitigation</a></li>
            </ul>
        </div>
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core Challenges</h4>
            <p class="text-blue-800 mb-2">Deploying LLMs in production is not just about model quality. Teams must balance <b>cost</b>, <b>latency</b>, <b>fairness & safety</b>, <b>interpretability</b>, and <b>privacy</b> while meeting product goals.</p>
            <ul class="list-disc pl-5 text-blue-900 text-sm space-y-1">
                <li><b>Resource intensity:</b> High computational demands (serving GPUs, memory, scaling).</li>
                <li><b>Bias & safety:</b> Risk of perpetuating training data biases or unsafe outputs.</li>
                <li><b>Interpretability:</b> Complex models are hard to explain and audit.</li>
                <li><b>Privacy & compliance:</b> Potential data security concerns and regulations.</li>
            </ul>
        </div>

        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Performance</h5>
                <ul class="text-sm text-green-800 list-disc pl-5 space-y-1">
                    <li>Latency targets (SLA) and throughput</li>
                    <li>Quantization, batching, KV-caching</li>
                </ul>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Safety & Quality</h5>
                <ul class="text-sm text-purple-800 list-disc pl-5 space-y-1">
                    <li>Instruction tuning, RLHF, guardrails</li>
                    <li>Evaluation & red-teaming</li>
                </ul>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Privacy & Compliance</h5>
                <ul class="text-sm text-orange-800 list-disc pl-5 space-y-1">
                    <li>Pseudonymization, on-prem/edge options</li>
                    <li>Auditability and data retention</li>
                </ul>
            </div>
        </div>

        <!-- Why It Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Production readiness:</strong> Meeting SLAs without exploding costs.</li>
                <li>• <strong>Trust & safety:</strong> Reducing bias and harmful outputs.</li>
                <li>• <strong>Governance:</strong> Satisfying privacy, security, and audit requirements.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🚀 Deployment challenges explorer",
    html: `<div class="space-y-4">
            <!-- Controls -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid md:grid-cols-4 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Primary priority</label>
                        <select id="q50-priority" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option selected>Latency</option>
                            <option>Cost</option>
                            <option>Privacy</option>
                            <option>Safety</option>
                            <option>Quality</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Infrastructure</label>
                        <select id="q50-infra" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option selected>Cloud GPU</option>
                            <option>Cloud CPU</option>
                            <option>On-Prem GPU</option>
                            <option>Edge Device</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                        <select id="q50-align" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>None</option>
                            <option selected>Instruction-tuned</option>
                            <option>RLHF</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Data sensitivity</label>
                        <select id="q50-data" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>Low</option>
                            <option selected>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </div>
                <div class="grid md:grid-cols-4 gap-3 mt-3">
                    <label class="flex items-center gap-2 text-sm"><input id="q50-quant4" type="checkbox" class="h-4 w-4" checked> <span>Quantization (4-bit)</span></label>
                    <label class="flex items-center gap-2 text-sm"><input id="q50-distill" type="checkbox" class="h-4 w-4"> <span>Distillation</span></label>
                    <label class="flex items-center gap-2 text-sm"><input id="q50-cache" type="checkbox" class="h-4 w-4" checked> <span>KV cache</span></label>
                    <label class="flex items-center gap-2 text-sm"><input id="q50-rag" type="checkbox" class="h-4 w-4"> <span>RAG (guarded)</span></label>
                </div>
            </div>

            <!-- Impact & Guidance -->
            <div class="bg-white p-3 rounded-lg border">
                <div class="grid md:grid-cols-3 gap-4 items-start">
                    <div>
                        <div class="text-sm font-medium text-gray-700 mb-1">Deployment readiness</div>
                        <div id="q50-impact" class="text-xs">
                            <span id="q50-impact-badge" class="inline-block px-2 py-0.5 rounded border" role="status" aria-live="polite"></span>
                            <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                <div id="q50-meter" class="h-full rounded" style="width:0%"></div>
                            </div>
                            <div id="q50-breakdown" class="mt-2 text-xs text-gray-600" aria-live="polite"></div>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">Heuristic: balances latency, cost, safety, interpretability, and privacy.</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-green-700 mb-1">Strengths</div>
                        <ul id="q50-pros" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-red-700 mb-1">Risks</div>
                        <ul id="q50-cons" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                </div>
                <!-- Phase 2 additions: dimension bars, next-step guidance, micro diff -->
                <div class="mt-4 space-y-3">
                    <div class="grid md:grid-cols-5 gap-2" id="q50-bars" aria-label="Dimension performance bars"></div>
                    <div id="q50-next" class="text-xs text-indigo-700 min-h-[16px]" aria-live="polite"></div>
                    <div id="q50-diff" class="text-xs text-gray-600 h-4" aria-live="polite"></div>
                </div>
            </div>

            <!-- Phase 3: Scenarios & Comparison -->
            <div class="bg-white p-3 rounded-lg border space-y-4">
                <div class="flex flex-wrap gap-2 text-xs items-center">
                    <span class="text-gray-600">Presets:</span>
                    <button class="q50-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="lowcost">Low-cost</button>
                    <button class="q50-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="balanced">Balanced</button>
                    <button class="q50-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="privacy">Privacy-first</button>
                    <button class="q50-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="safety">High-safety</button>
                </div>
                <div class="grid md:grid-cols-3 gap-4 text-xs">
                    <div class="space-y-2">
                        <h4 class="font-medium text-gray-700 flex items-center gap-2">A/B Compare <span class="text-xs text-gray-400">capture</span></h4>
                        <div class="flex flex-wrap gap-2">
                            <button id="q50-capA" class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300">Capture A</button>
                            <button id="q50-capB" class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300" disabled>Capture B</button>
                            <button id="q50-capClear" class="px-2 py-0.5 rounded border" disabled>Clear</button>
                        </div>
                        <div id="q50-ab-status" class="h-4 text-indigo-600"></div>
                        <div id="q50-ab-diff" class="text-gray-700 text-xs leading-snug"></div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-gray-700">Config Export</h4>
                        <button id="q50-export" class="px-2 py-0.5 rounded border bg-green-50 hover:bg-green-100 text-green-700">Copy JSON</button>
                        <div id="q50-export-status" class="h-4 text-green-600 text-xs"></div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-gray-700">Notes</h4>
                        <div class="text-gray-600" id="q50-ab-note"></div>
                    </div>
                </div>
            </div>

            <!-- Phase 4: Advanced Readiness Insights -->
            <div class="bg-white p-3 rounded-lg border space-y-4">
                <h4 class="font-medium text-gray-800 text-sm">Advanced Readiness Insights</h4>
                <div class="grid md:grid-cols-3 gap-4 text-xs">
                    <div class="space-y-2">
                        <div class="font-medium text-gray-700">Readiness Ladder</div>
                        <div id="q50-tier" class="text-gray-800"></div>
                        <div id="q50-next-tier" class="text-gray-600"></div>
                    </div>
                    <div class="space-y-2 relative">
                        <div class="font-medium text-gray-700">Capability Radar</div>
                        <canvas id="q50-radar" width="140" height="140" class="border rounded bg-white" aria-hidden="true"></canvas>
                        <div id="q50-radar-alt" class="sr-only" aria-live="polite"></div>
                    </div>
                    <div class="space-y-2">
                        <div class="font-medium text-gray-700">Risk Clusters</div>
                        <div id="q50-risks" class="flex flex-wrap gap-1"></div>
                        <div class="font-medium text-gray-700 mt-2">Intervention Planner</div>
                        <div id="q50-interventions" class="space-y-1"></div>
                    </div>
                </div>
            </div>

            <!-- Output -->
            <div id="q50-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900" aria-live="polite"></div>
        </div>`,
        script: () => {
            const pr = document.getElementById('q50-priority');
            const infra = document.getElementById('q50-infra');
            const align = document.getElementById('q50-align');
            const data = document.getElementById('q50-data');
            const quant4 = document.getElementById('q50-quant4');
            const distill = document.getElementById('q50-distill');
            const cache = document.getElementById('q50-cache');
            const rag = document.getElementById('q50-rag');
            const badgeEl = document.getElementById('q50-impact-badge');
            const meterEl = document.getElementById('q50-meter');
            const prosEl = document.getElementById('q50-pros');
            const consEl = document.getElementById('q50-cons');
            const expl = document.getElementById('q50-expl');
            const breakdownEl = document.getElementById('q50-breakdown');
            // Phase 2 elements
            const barsEl = document.getElementById('q50-bars');
            const nextEl = document.getElementById('q50-next');
            const diffEl = document.getElementById('q50-diff');
            // Phase 3 elements
            const presetBtns = document.querySelectorAll('.q50-preset');
            const capA = document.getElementById('q50-capA');
            const capB = document.getElementById('q50-capB');
            const capClear = document.getElementById('q50-capClear');
            const abStatus = document.getElementById('q50-ab-status');
            const abDiff = document.getElementById('q50-ab-diff');
            const exportBtn = document.getElementById('q50-export');
            const exportStatus = document.getElementById('q50-export-status');
            const abNote = document.getElementById('q50-ab-note');
            // Phase 4 elements
            const tierEl = document.getElementById('q50-tier');
            const nextTierEl = document.getElementById('q50-next-tier');
            const radarCanvas = document.getElementById('q50-radar');
            const radarAlt = document.getElementById('q50-radar-alt');
            const risksEl = document.getElementById('q50-risks');
            const interventionsEl = document.getElementById('q50-interventions');
            if (!pr || !infra || !align || !data || !quant4 || !distill || !cache || !rag || !badgeEl || !meterEl || !prosEl || !consEl || !expl) return;

            let prevState = { pr: pr.value, infra: infra.value, align: align.value, data: data.value, quant4: quant4.checked, distill: distill.checked, cache: cache.checked, rag: rag.checked };
            let snapA = null, snapB = null;

            function setImpact(score) {
                score = Math.max(0, Math.min(1, score));
                let label = '';
                let bg = '#e5e7eb', fg = '#111827', border = '#d1d5db';
                if (score >= 0.85) { label = `Excellent (${Math.round(score*100)}%)`; bg = '#dcfce7'; fg = '#166534'; border = '#86efac'; }
                else if (score >= 0.65) { label = `Good (${Math.round(score*100)}%)`; bg = '#dbeafe'; fg = '#1e40af'; border = '#93c5fd'; }
                else if (score >= 0.35) { label = `Developing (${Math.round(score*100)}%)`; bg = '#fef9c3'; fg = '#854d0e'; border = '#fde68a'; }
                else { label = `Basic (${Math.round(score*100)}%)`; bg = '#fee2e2'; fg = '#991b1b'; border = '#fecaca'; }
                badgeEl.textContent = label;
                badgeEl.style.backgroundColor = bg;
                badgeEl.style.color = fg;
                badgeEl.style.borderColor = border;
                meterEl.style.width = `${Math.round(score*100)}%`;
                meterEl.style.backgroundColor = fg;
            }

            function scores() {
                // Simple heuristics for each dimension in [0,1]
                let latency = 0.5, cost = 0.5, safety = 0.5, interpret = 0.45, privacy = 0.5;

                // Infra effects
                const infraVal = (infra.value||'').toLowerCase();
                switch (infraVal) {
                    case 'cloud gpu': latency += 0.35; cost += 0.35; privacy -= 0.05; break;
                    case 'cloud cpu': latency -= 0.35; cost -= 0.15; privacy -= 0.05; break;
                    case 'on-prem gpu': latency += 0.25; cost += 0.05; privacy += 0.15; break;
                    case 'edge device': latency += 0.15; cost -= 0.15; privacy += 0.25; interpret += 0.05; break;
                }

                // Techniques
                if (quant4.checked) { latency += 0.2; cost += 0.2; interpret -= 0.05; }
                if (distill.checked) { latency += 0.15; cost += 0.15; interpret += 0.05; }
                if (cache.checked) { latency += 0.15; cost += 0.05; }
                if (rag.checked) { safety += 0.1; interpret += 0.05; }

                // Alignment
                const a = (align.value||'None').toLowerCase();
                if (a === 'instruction-tuned') safety += 0.1;
                if (a === 'rlhf') safety += 0.2;

                // Data sensitivity policy
                const d = (data.value||'Medium').toLowerCase();
                if (d === 'low') privacy += 0.1;
                if (d === 'high') privacy -= 0.1;
                // RAG with high sensitivity on cloud has extra privacy pressure
                if (rag.checked && d === 'high' && (infraVal.includes('cloud'))) privacy -= 0.1;

                // Priority nudges (emphasize target dimension, slightly trade others)
                const p = (pr.value||'Latency').toLowerCase();
                if (p === 'latency') { latency += 0.1; cost -= 0.05; }
                if (p === 'cost') { cost += 0.15; latency -= 0.05; }
                if (p === 'privacy') { privacy += 0.15; latency -= 0.05; }
                if (p === 'safety') { safety += 0.15; }
                if (p === 'quality') { interpret += 0.05; safety += 0.05; }

                // Clamp to [0,1]
                const clamp = (x) => Math.max(0, Math.min(1, x));
                latency = clamp(latency); cost = clamp(cost); safety = clamp(safety); interpret = clamp(interpret); privacy = clamp(privacy);

                // Overall readiness: harmonic-ish mean to penalize weakest links
                const eps = 1e-6;
                const invSum = (1/(latency+eps) + 1/(cost+eps) + 1/(safety+eps) + 1/(interpret+eps) + 1/(privacy+eps));
                const readiness = 5 / invSum; // in [~0,1]
                return { latency, cost, safety, interpret, privacy, readiness };
            }

            function render() {
                const s = scores();
                setImpact(s.readiness);

                // Score breakdown (Phase 1 transparency)
                if (breakdownEl) {
                    const dims = [
                        { k:'Latency', v:s.latency },
                        { k:'Cost', v:s.cost },
                        { k:'Safety', v:s.safety },
                        { k:'Interpret', v:s.interpret },
                        { k:'Privacy', v:s.privacy }
                    ];
                    const weakest = dims.reduce((m,d)=> d.v < m.v ? d : m, dims[0]);
                    const line = dims.map(d=>`${d.k} ${(d.v*100).toFixed(0)}%${d===weakest?'*':''}`).join(' · ');
                    breakdownEl.textContent = line + '  (* bottleneck)';
                }

                // Dimension bars
                if (barsEl) {
                    const barDefs = [
                        { id:'latency', label:'Latency', val:s.latency },
                        { id:'cost', label:'Cost', val:s.cost },
                        { id:'safety', label:'Safety', val:s.safety },
                        { id:'interpret', label:'Interpret', val:s.interpret },
                        { id:'privacy', label:'Privacy', val:s.privacy }
                    ];
                    barsEl.innerHTML = barDefs.map(d=>{
                        const pct = (d.val*100).toFixed(0);
                        let color = 'bg-gray-300';
                        if (d.val >= 0.7) color = 'bg-green-500';
                        else if (d.val >= 0.5) color = 'bg-yellow-400';
                        else color = 'bg-red-500';
                        return `<div class=\"space-y-1\"><div class=\"text-xs text-gray-600 text-center\">${d.label}</div><div class=\"h-2 w-full bg-gray-200 rounded overflow-hidden relative\" aria-label='${d.label} ${pct}%'><div class=\"h-full ${color}\" style=\"width:${pct}%\"></div></div><div class=\"text-xs text-center text-gray-700\">${pct}%</div></div>`;
                    }).join('');
                }

                // Next-step guidance (single prioritized action)
                if (nextEl) {
                    const pairs = [
                        { k:'latency', v:s.latency, msg:'Improve latency: enable caching, quantization, or GPU scaling' },
                        { k:'cost', v:s.cost, msg:'Cut cost: increase batch size, consider smaller distilled/quantized model' },
                        { k:'safety', v:s.safety, msg:'Boost safety: add instruction tuning, guardrail filters, eval coverage' },
                        { k:'interpret', v:s.interpret, msg:'Increase interpretability: add tracing, prompt tests, eval dashboards' },
                        { k:'privacy', v:s.privacy, msg:'Enhance privacy: move sensitive flows on-prem/edge, add redaction' }
                    ];
                    pairs.sort((a,b)=> a.v - b.v);
                    const weakest = pairs[0];
                    nextEl.textContent = `Next focus → ${weakest.msg}`;
                }

                const pros = [];
                const cons = [];
                const infraVal = (infra.value||'').toLowerCase();
                const p = (pr.value||'Latency').toLowerCase();
                const a = (align.value||'None').toLowerCase();
                const d = (data.value||'Medium').toLowerCase();

                // Helper to avoid duplicates
                const uniquePush = (arr, msg) => { if (!arr.includes(msg)) arr.push(msg); };

                // Pros based on high dimensions
                if (s.latency >= 0.7) pros.push('Meets tight latency targets with current setup');
                if (s.cost >= 0.7) pros.push('Cost-efficient serving approach');
                if (s.safety >= 0.7) pros.push('Good alignment and guardrails reduce risky outputs');
                if (s.interpret >= 0.7) pros.push('Reasonable explainability and auditability');
                if (s.privacy >= 0.7) pros.push('Solid privacy posture for sensitive data');

                // Cons based on low dimensions (strong risks)
                if (s.latency <= 0.5) uniquePush(cons, 'Latency risk: consider batching, KV-cache, quantization, or distilled models');
                if (s.cost <= 0.5) uniquePush(cons, 'Cost pressure: enable autoscaling, increase batch size, or use smaller/CPU/edge for low-QPS');
                if (s.safety <= 0.5) uniquePush(cons, 'Safety gap: add instruction tuning, RLHF, policy filters and evaluations');
                if (s.interpret <= 0.5) uniquePush(cons, 'Low interpretability: add evals, tracing, prompt tests, and monitoring');
                if (s.privacy <= 0.5) uniquePush(cons, 'Privacy risk: keep PII on-prem/edge, add redaction, retention, and access controls');

                // Mid-level warnings when in the gray zone [0.4, 0.6]
                const warn = (v, msg) => { if (v > 0.4 && v < 0.6) uniquePush(cons, `Watch-out: ${msg}`); };
                warn(s.latency, 'latency might spike under load; verify p95/p99 and warm pools');
                warn(s.cost, 'cost could grow with QPS; simulate peak and enforce budgets');
                warn(s.safety, 'safety guardrails may be insufficient; expand eval sets');
                warn(s.interpret, 'observability may be limited; add traces and test harness');
                warn(s.privacy, 'recheck data residency and retention policies');

                // Technique-specific caveats
                if (quant4.checked) uniquePush(cons, 'Quantization can slightly reduce quality; validate key tasks');
                if (quant4.checked && infraVal.includes('edge')) uniquePush(cons, 'Aggressive edge quantization may degrade semantics; test critical tasks');
                if (!cache.checked && p === 'latency') uniquePush(cons, 'KV cache disabled while latency is priority: expect p95/p99 spikes');
                if (rag.checked && s.privacy < 0.7) uniquePush(cons, 'RAG with sensitive data needs robust filtering and governance');
                if (rag.checked && s.safety < 0.6) uniquePush(cons, 'RAG retrieval noise can amplify hallucinations; enforce strict content filters');

                // Infra-specific risks
                if (infraVal.includes('cpu')) uniquePush(cons, 'CPU serving risks: high latency/low throughput for LLMs; use int8/4-bit, smaller model, or GPU for tight SLAs');
                if (infraVal === 'cloud gpu') uniquePush(cons, 'GPU cost and quota/availability risk under bursts; batch and autoscale to control spend');
                if (infraVal === 'on-prem gpu') uniquePush(cons, 'On‑prem GPU capacity, queueing, and capex; plan for peaks and maintenance windows');
                if (infraVal === 'edge device') uniquePush(cons, 'Edge constraints: limited memory/compute; quality drops with small models and heavy quantization');

                // Priority/setting mismatches
                if (p === 'latency' && infraVal.includes('cpu')) uniquePush(cons, 'Priority/infra mismatch: latency-first on CPU is risky—prefer GPU, caching, and quantization');
                if (p === 'cost' && infraVal === 'cloud gpu' && !(quant4.checked || distill.checked)) uniquePush(cons, 'Priority/infra mismatch: cost-first on cloud GPU without quantization/distillation will be expensive');
                if (p === 'privacy' && infraVal.includes('cloud') && d === 'high') uniquePush(cons, 'Priority/infra mismatch: privacy-first with high-sensitivity data on cloud—consider on‑prem/edge or stronger redaction');
                if (p === 'safety' && a === 'none') uniquePush(cons, 'Priority/setting mismatch: safety-first requires instruction tuning/RLHF and policy filters');

                // Alignment-specific caveats
                if (a === 'none') uniquePush(cons, 'Unaligned outputs may be off-brand or unsafe; add alignment and guardrails');
                if (a === 'rlhf') uniquePush(cons, 'RLHF drift/over‑optimization risk; maintain evals and refresh policies regularly');

                // Ensure at least one actionable caution
                if (cons.length === 0) uniquePush(cons, 'No major risks detected. Still add continuous evals, guardrails, and drift monitoring.');

                // Limit list length for readability
                const maxItems = 6;
                const consList = cons.slice(0, maxItems);

                prosEl.innerHTML = pros.map(p => `<li>${p}</li>`).join('');
                consEl.innerHTML = consList.map(c => `<li>${c}</li>`).join('');

                const parts = [
                    `Priority: <b>${pr.value}</b>`,
                    `Infra: <b>${infra.value}</b>`,
                    `Alignment: <b>${align.value}</b>`,
                    `Data sensitivity: <b>${data.value}</b>`,
                    quant4.checked ? '4-bit quant: <b>on</b>' : '4-bit quant: <b>off</b>',
                    distill.checked ? 'Distillation: <b>on</b>' : 'Distillation: <b>off</b>',
                    cache.checked ? 'KV cache: <b>on</b>' : 'KV cache: <b>off</b>',
                    rag.checked ? 'RAG: <b>on</b>' : 'RAG: <b>off</b>'
                ];

                expl.innerHTML = `
                    <div class="flex flex-wrap gap-2 mb-2 text-indigo-700">${parts.map(p => `<span class=\"px-2 py-0.5 bg-white border rounded text-xs\">${p}</span>`).join('')}</div>
                    <div class="text-xs text-gray-800">
                        This configuration balances production constraints. Tuning infra and techniques can trade cost vs latency, while alignment, RAG, and policy controls address bias, safety, and privacy.
                    </div>
                `;

                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(() => {});
                }

                // Phase 4: Ladder tiers
                if(tierEl && nextTierEl){
                    const tiers = [
                        {name:'Prototype', min:0},
                        {name:'Pilot', min:0.35},
                        {name:'Limited Production', min:0.55},
                        {name:'Production', min:0.70},
                        {name:'Hardened', min:0.85}
                    ];
                    let current = tiers[0];
                    for(const t of tiers){ if(s.readiness >= t.min) current = t; }
                    const next = tiers.find(t=> t.min > current.min);
                    tierEl.textContent = `Tier: ${current.name} (${(s.readiness*100).toFixed(0)}%)`;
                    nextTierEl.textContent = next ? `Next: ${next.name} need +${((next.min - s.readiness)*100).toFixed(0)} pts` : 'At highest tier';
                }

                // Phase 4: Radar chart
                if(radarCanvas){
                    const ctx = radarCanvas.getContext('2d');
                    const dims = [
                        {k:'latency', v:s.latency, label:'Latency'},
                        {k:'cost', v:s.cost, label:'Cost'},
                        {k:'safety', v:s.safety, label:'Safety'},
                        {k:'interpret', v:s.interpret, label:'Interpret'},
                        {k:'privacy', v:s.privacy, label:'Privacy'}
                    ];
                    ctx.clearRect(0,0,radarCanvas.width, radarCanvas.height);
                    const cx = radarCanvas.width/2, cy = radarCanvas.height/2, R = 60;
                    ctx.strokeStyle = '#e5e7eb';
                    ctx.lineWidth = 1;
                    for(let ring=1; ring<=3; ring++){
                        ctx.beginPath();
                        dims.forEach((d,i)=>{
                            const ang = (Math.PI*2*i/dims.length)-Math.PI/2;
                            const r = R * (ring/3);
                            const x = cx + Math.cos(ang)*r;
                            const y = cy + Math.sin(ang)*r;
                            if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                        });
                        ctx.closePath();
                        ctx.stroke();
                    }
                    ctx.strokeStyle = '#d1d5db';
                    dims.forEach((d,i)=>{
                        const ang = (Math.PI*2*i/dims.length)-Math.PI/2;
                        ctx.beginPath();
                        ctx.moveTo(cx,cy);
                        ctx.lineTo(cx+Math.cos(ang)*R, cy+Math.sin(ang)*R);
                        ctx.stroke();
                    });
                    ctx.beginPath();
                    dims.forEach((d,i)=>{
                        const ang = (Math.PI*2*i/dims.length)-Math.PI/2;
                        const r = R * d.v;
                        const x = cx + Math.cos(ang)*r;
                        const y = cy + Math.sin(ang)*r;
                        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                    });
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(79,70,229,0.20)';
                    ctx.strokeStyle = '#4f46e5';
                    ctx.lineWidth = 2;
                    ctx.fill();
                    ctx.stroke();
                    if(radarAlt){ radarAlt.textContent = 'Radar ' + dims.map(d=> `${d.label} ${(d.v*100).toFixed(0)}%`).join(', '); }
                }

                // Phase 4: Risk clusters
                if(risksEl){
                    const riskDims = [
                        {label:'Latency', v: s.latency},
                        {label:'Cost', v: s.cost},
                        {label:'Safety', v: s.safety},
                        {label:'Interpret', v: s.interpret},
                        {label:'Privacy', v: s.privacy}
                    ];
                    risksEl.innerHTML = '';
                    riskDims.forEach(d=>{
                        const risk = 1 - d.v;
                        let level = 'Low';
                        if(risk >= 0.6) level = 'High'; else if (risk >= 0.4) level = 'Med';
                        const span = document.createElement('span');
                        const color = level==='High' ? 'bg-red-100 text-red-700 border-red-300' : level==='Med' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300';
                        span.className = `px-1.5 py-0.5 rounded border text-xs ${color}`;
                        span.textContent = `${d.label}:${level}`;
                        risksEl.appendChild(span);
                    });
                }

                // Phase 4: Intervention planner
                if(interventionsEl){
                    interventionsEl.innerHTML = '';
                    const actions = [
                        {key:'quant4', label:'Add 4-bit quantization', complexity:1},
                        {key:'distill', label:'Fine-tune distillation', complexity:2},
                        {key:'cache', label:'Enable response caching', complexity:1},
                        {key:'rag', label:'Add RAG retrieval', complexity:3}
                    ];
                    const complexityLabel = c => c===1?'low': c===2? 'med':'high';
                    const curStates = {quant4:quant4.checked, distill:distill.checked, cache:cache.checked, rag:rag.checked};
                    const improvements = [];
                    actions.forEach(a=>{
                        if(curStates[a.key]) return;
                        const original = {quant4:quant4.checked, distill:distill.checked, cache:cache.checked, rag:rag.checked};
                        if(a.key==='quant4') quant4.checked = true;
                        if(a.key==='distill') distill.checked = true;
                        if(a.key==='cache') cache.checked = true;
                        if(a.key==='rag') rag.checked = true;
                        const after = scores().readiness;
                        quant4.checked = original.quant4;
                        distill.checked = original.distill;
                        cache.checked = original.cache;
                        rag.checked = original.rag;
                        const delta = after - s.readiness;
                        improvements.push({label:a.label, delta, complexity:a.complexity});
                    });
                    improvements.sort((a,b)=> b.delta - a.delta);
                    improvements.slice(0,3).forEach(im => {
                        if(im.delta < 0.01) return;
                        const row = document.createElement('div');
                        row.className='flex items-center justify-between gap-2';
                        row.innerHTML = `<span class=\"text-gray-700\">${im.label}</span><span class=\"text-indigo-700\">+${(im.delta*100).toFixed(0)} pts</span><span class=\"text-gray-500\">${complexityLabel(im.complexity)}</span>`;
                        interventionsEl.appendChild(row);
                    });
                    if(!interventionsEl.children.length){
                        interventionsEl.textContent = 'No meaningful single-step gains remaining.';
                    }
                }

                // Micro diff line
                if (diffEl) {
                    const curr = { pr: pr.value, infra: infra.value, align: align.value, data: data.value, quant4: quant4.checked, distill: distill.checked, cache: cache.checked, rag: rag.checked };
                    const changes = [];
                    for (const k of Object.keys(curr)) {
                        if (curr[k] !== prevState[k]) {
                            if (typeof curr[k] === 'boolean') changes.push(`${k}${curr[k]?'✓':'✗'}`); else changes.push(`${k}→${curr[k]}`);
                        }
                    }
                    if (changes.length) {
                        diffEl.textContent = 'Change: ' + changes.join('; ');
                        setTimeout(()=>{ if (diffEl.textContent.startsWith('Change:')) diffEl.textContent=''; }, 1800);
                    }
                    prevState = curr;
                }
            }

            // Presets
            function applyPreset(name){
                const presets = {
                    lowcost: { pr:'Cost', infra:'Cloud CPU', align:'None', data:'Low', quant4:true, distill:true, cache:true, rag:false },
                    balanced: { pr:'Quality', infra:'Cloud GPU', align:'Instruction-tuned', data:'Medium', quant4:true, distill:false, cache:true, rag:false },
                    privacy: { pr:'Privacy', infra:'On-Prem GPU', align:'Instruction-tuned', data:'High', quant4:false, distill:false, cache:true, rag:false },
                    safety: { pr:'Safety', infra:'Cloud GPU', align:'RLHF', data:'Medium', quant4:true, distill:false, cache:true, rag:true }
                };
                const ps = presets[name]; if(!ps) return;
                pr.value = ps.pr; infra.value=ps.infra; align.value=ps.align; data.value=ps.data;
                quant4.checked = ps.quant4; distill.checked = ps.distill; cache.checked = ps.cache; rag.checked = ps.rag;
                render();
            }
            presetBtns.forEach(btn=> btn.addEventListener('click', ()=> applyPreset(btn.getAttribute('data-preset'))));

            // Snapshot helpers
            function snapshot(){
                const s = scores();
                return {
                    priority: pr.value,
                    infra: infra.value,
                    alignment: align.value,
                    dataSensitivity: data.value,
                    quant4: quant4.checked,
                    distill: distill.checked,
                    cache: cache.checked,
                    rag: rag.checked,
                    latency: s.latency,
                    cost: s.cost,
                    safety: s.safety,
                    interpret: s.interpret,
                    privacy: s.privacy,
                    readiness: s.readiness
                };
            }
            function diff(a,b){
                if(!a||!b) return '';
                const parts = [];
                function delta(label, va, vb){ if(va!==vb) parts.push(`${label}: ${formatVal(va)}→${formatVal(vb)}`); }
                function formatVal(v){ return typeof v==='boolean' ? (v?'on':'off') : (typeof v==='number'? (v*100).toFixed(0)+'%' : v); }
                delta('priority', a.priority, b.priority);
                delta('infra', a.infra, b.infra);
                delta('align', a.alignment, b.alignment);
                delta('data', a.dataSensitivity, b.dataSensitivity);
                ['quant4','distill','cache','rag'].forEach(k=> delta(k, a[k], b[k]));
                ['latency','cost','safety','interpret','privacy','readiness'].forEach(k=> { if (Math.abs(a[k]-b[k])>0.02) parts.push(`${k} ${(a[k]*100).toFixed(0)}%→${(b[k]*100).toFixed(0)}%`); });
                return parts.join('; ');
            }
            function updateAB(){
                if(!capB||!capClear) return;
                capB.disabled = !snapA;
                capClear.disabled = !(snapA||snapB);
                if(abDiff) abDiff.textContent = diff(snapA, snapB);
                if(abNote){
                    if(snapA && snapB) abNote.textContent = 'Comparison shows deltas; focus on largest % drops for bottleneck mitigation.';
                    else if(snapA) abNote.textContent = 'Captured A; adjust settings then capture B.';
                    else abNote.textContent='Capture A to start comparison.';
                }
            }
            if(capA) capA.addEventListener('click', ()=>{ snapA = snapshot(); if(abStatus){abStatus.textContent='Captured A'; setTimeout(()=>{ if(abStatus.textContent==='Captured A') abStatus.textContent=''; },1200);} updateAB(); });
            if(capB) capB.addEventListener('click', ()=>{ if(!snapA) return; snapB = snapshot(); if(abStatus){abStatus.textContent='Captured B'; setTimeout(()=>{ if(abStatus.textContent==='Captured B') abStatus.textContent=''; },1200);} updateAB(); });
            if(capClear) capClear.addEventListener('click', ()=>{ snapA=null; snapB=null; updateAB(); });

            // Export
            if(exportBtn){
                exportBtn.addEventListener('click', ()=>{
                    const shot = snapshot();
                    const text = JSON.stringify(shot, null, 2);
                    navigator.clipboard.writeText(text).then(()=>{ if(exportStatus){ exportStatus.textContent='Copied'; setTimeout(()=>{ if(exportStatus.textContent==='Copied') exportStatus.textContent=''; },1200);} }).catch(()=>{ if(exportStatus){ exportStatus.textContent='Clipboard blocked'; } });
                });
            }

            [pr, infra, align, data].forEach(el => el.addEventListener('change', render));
            [quant4, distill, cache, rag].forEach(el => el.addEventListener('change', render));
            render();
        }
    }
};

module.exports = { question };
