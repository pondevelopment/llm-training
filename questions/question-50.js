// Question 50: What challenges do LLMs face in deployment?
// Created: 2025-08-14
// Educational Focus: Identify key deployment challenges (cost, latency, bias/safety, interpretability, privacy) and explore trade-offs via infra/technique choices.

const question = {
    title: "50. What challenges do LLMs face in deployment?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core challenges</h4>
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
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Production readiness:</strong> Meeting SLAs without exploding costs.</li>
                <li>• <strong>Trust & safety:</strong> Reducing bias and harmful outputs.</li>
                <li>• <strong>Governance:</strong> Satisfying privacy, security, and audit requirements.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🚀 Deployment challenges explorer",
        html: `<div class="space-y-6">
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
                            <span id="q50-impact-badge" class="inline-block px-2 py-0.5 rounded border"></span>
                            <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                <div id="q50-meter" class="h-full rounded" style="width:0%"></div>
                            </div>
                        </div>
                        <div class="text-[11px] text-gray-500 mt-1">Heuristic: balances latency, cost, safety, interpretability, and privacy.</div>
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
            </div>

            <!-- Output -->
            <div id="q50-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900"></div>
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
            if (!pr || !infra || !align || !data || !quant4 || !distill || !cache || !rag || !badgeEl || !meterEl || !prosEl || !consEl || !expl) return;

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
            }

            [pr, infra, align, data].forEach(el => el.addEventListener('change', render));
            [quant4, distill, cache, rag].forEach(el => el.addEventListener('change', render));
            render();
        }
    }
};

module.exports = { question };
