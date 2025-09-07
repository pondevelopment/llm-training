// Question 49: What defines a Large Language Model (LLM)?
// Created: 2025-08-14
// Educational Focus: Define LLMs (architecture, scale, data, capabilities) and provide an explorer linking parameters, data, and context to capabilities/trade-offs.

const question = {
    title: "49. What defines a Large Language Model (LLM)?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-01" class="text-indigo-700 underline hover:text-indigo-900">Question 1: Tokenization & why it matters</a></li>
                <li><a href="#question-02" class="text-indigo-700 underline hover:text-indigo-900">Question 2: Attention mechanisms</a></li>
                <li><a href="#question-18" class="text-indigo-700 underline hover:text-indigo-900">Question 18: Overfitting & mitigation</a></li>
                <li><a href="#question-47" class="text-indigo-700 underline hover:text-indigo-900">Question 47: Context & perplexity</a></li>
                <li><a href="#question-48" class="text-indigo-700 underline hover:text-indigo-900">Question 48: Hyperparameters</a></li>
            </ul>
        </div>
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core Idea</h4>
            <p class="text-blue-800">LLMs are transformer-based generative models trained on vast corpora to predict tokens. Scale (parameters, data), compute, and training objectives enable emergent capabilities like in-context learning and broad task generalization.</p>
            <div class="text-center mt-3 bg-white p-3 rounded border">
                $$\\text{LM objective: } \\max_\\theta \\sum_t \\log p_\\theta(y_t \\mid y_{\\lt t})$$
            </div>
        </div>
        
        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Architecture</h5>
                <ul class="text-sm text-green-800 list-disc pl-5 space-y-1">
                    <li>Transformer with self-attention</li>
                    <li>Decoder-only or encoder–decoder</li>
                    <li>Positional encodings, MLP blocks</li>
                </ul>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Scale</h5>
                <ul class="text-sm text-purple-800 list-disc pl-5 space-y-1">
                    <li>Parameters: millions → trillions</li>
                    <li>Data: diverse web, code, books</li>
                    <li>Compute: long training runs</li>
                </ul>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Capabilities</h5>
                <ul class="text-sm text-orange-800 list-disc pl-5 space-y-1">
                    <li>Generation, reasoning, coding</li>
                    <li>In-context learning, tool use</li>
                    <li>Multimodality (for some models)</li>
                </ul>
            </div>
        </div>
        
        <!-- Why It Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Roadmapping:</strong> Understanding scale/data trade-offs helps plan budgets.</li>
                <li>• <strong>Performance:</strong> Larger models and longer context often improve quality within limits.</li>
                <li>• <strong>Safety:</strong> Alignment techniques (RLHF, safety tuning) are critical for deployment.</li>
                <li>• <strong>Cost & latency:</strong> Bigger ≠ always better; inference + fine-tuning costs grow superlinearly with size.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "📈 LLM scale vs capability explorer",
    html: `<div class="space-y-4">
            <!-- Controls -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid md:grid-cols-4 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Parameters (log10) <span title="Model capacity; higher allows learning more complex functions but needs proportional data." class="text-xs text-indigo-600 cursor-help align-middle">ℹ️</span></label>
                        <input id="q49-params" type="range" min="7" max="13" step="0.1" value="9.5" class="w-full">
                        <div class="text-xs text-gray-600">10^x parameters</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Data tokens (log10) <span title="Unique training token volume; improves coverage & reduces overfitting risk." class="text-xs text-indigo-600 cursor-help align-middle">ℹ️</span></label>
                        <input id="q49-data" type="range" min="9" max="14" step="0.1" value="11.5" class="w-full">
                        <div class="text-xs text-gray-600">10^x tokens</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Context length <span title="Max tokens model attends to; enables longer reasoning chains & document grounding." class="text-xs text-indigo-600 cursor-help align-middle">ℹ️</span></label>
                        <select id="q49-context" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>4K</option>
                            <option selected>8K</option>
                            <option>32K</option>
                            <option>128K</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Alignment <span title="Instruction / preference tuning improves helpfulness & safety." class="text-xs text-indigo-600 cursor-help align-middle">ℹ️</span></label>
                        <select id="q49-align" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option selected>None</option>
                            <option>Instruction-tuned</option>
                            <option>RLHF</option>
                        </select>
                    </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-4 items-center text-xs">
                    <div class="flex items-center gap-2">
                        <label class="text-gray-700 font-medium">Lens:</label>
                        <select id="q49-lens" class="px-2 py-1 border rounded bg-white">
                            <option value="research" selected>Research (maximize raw capability)</option>
                            <option value="production">Production (optimize usefulness & latency)</option>
                        </select>
                    </div>
                    <label class="flex items-center gap-1 cursor-pointer"><input id="q49-cb" type="checkbox" class="rounded"> <span class="text-gray-700">Color‑blind assist</span></label>
                </div>
            </div>

            <!-- Impact & Guidance -->
            <div class="bg-white p-3 rounded-lg border">
                <div class="grid md:grid-cols-3 gap-4 items-start">
                    <div>
                        <div class="text-sm font-medium text-gray-700 mb-1">Capability estimate</div>
                        <div id="q49-impact" class="text-xs">
                            <span id="q49-impact-badge" class="inline-block px-2 py-0.5 rounded border"></span>
                            <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                <div id="q49-meter" class="h-full rounded" style="width:0%"></div>
                            </div>
                            <div id="q49-breakdown" class="mt-2 text-xs text-gray-600" aria-live="polite"></div>
                            <div class="mt-2 flex flex-wrap gap-1" id="q49-regimes" aria-live="polite"></div>
                            <div class="mt-2" id="q49-alignbars" aria-hidden="true"></div>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">Heuristic combining params, data, context, and alignment.</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-green-700 mb-1">Strengths</div>
                        <ul id="q49-pros" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-red-700 mb-1">Limitations</div>
                        <ul id="q49-cons" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                </div>
                <div id="q49-diff" class="mt-2 text-xs text-indigo-700 h-4" aria-live="polite"></div>
            </div>

            <!-- Phase 2: Scaling & Trade-offs -->
            <div class="bg-white p-3 rounded-lg border space-y-3">
                <div class="flex flex-wrap items-center gap-3 text-xs">
                    <div id="q49-ratio" class="px-2 py-0.5 rounded border" aria-live="polite">ratio...</div>
                    <div class="flex items-center gap-1">
                        <button id="q49-scale-toggle" class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs">Scaling law</button>
                        <span class="text-gray-500">heuristic</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600">Context utilization</span>
                        <div class="w-32 h-2 bg-gray-200 rounded overflow-hidden"><div id="q49-util-bar" class="h-full bg-teal-600" style="width:0%"></div></div>
                        <span id="q49-util-label" class="text-gray-600"></span>
                    </div>
                </div>
                <div class="flex flex-wrap gap-4 items-center">
                    <div class="flex flex-col gap-1">
                        <canvas id="q49-spark" width="160" height="50" class="border rounded bg-gray-50"></canvas>
                        <span class="text-xs text-gray-500">Loss vs added params (data fixed)</span>
                    </div>
                    <div class="text-xs text-gray-700 hidden" id="q49-scale-box">
                        <div class="overflow-x-auto whitespace-nowrap">$$\\text{Loss} \approx L_\\infty + a P^{-\\alpha} + b D^{-\\beta}$$</div>
                        <div id="q49-loss" class="mt-1"></div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <canvas id="q49-pareto" width="130" height="80" class="border rounded bg-gray-50"></canvas>
                        <span class="text-xs text-gray-500">Capability vs latency</span>
                    </div>
                </div>
            </div>

            <!-- Phase 3: Scenarios & Comparison -->
            <div class="bg-white p-3 rounded-lg border space-y-4">
                <div class="flex flex-wrap gap-2 text-xs items-center">
                    <span class="text-gray-600">Presets:</span>
                    <button class="q49-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="edge">Edge micro-model</button>
                    <button class="q49-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="mid">Mid generalist</button>
                    <button class="q49-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="assistant">Large aligned assistant</button>
                    <button class="q49-preset px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100" data-preset="frontier">Research-scale frontier</button>
                </div>
                <div class="grid md:grid-cols-3 gap-4 text-xs">
                    <div class="space-y-2">
                        <h4 class="font-medium text-gray-700 flex items-center gap-2">A/B Compare <span class="text-xs text-gray-400">(capture states)</span></h4>
                        <div class="flex flex-wrap gap-2">
                            <button id="q49-capA" class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300">Capture A</button>
                            <button id="q49-capB" class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300" disabled>Capture B</button>
                            <button id="q49-capClear" class="px-2 py-0.5 rounded border" disabled>Clear</button>
                        </div>
                        <div id="q49-ab-status" class="h-4 text-indigo-600"></div>
                        <div id="q49-ab-diff" class="text-gray-700 text-xs leading-snug"></div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-gray-700">Cost & Footprint</h4>
                        <div id="q49-foot" class="text-gray-700 space-y-1"></div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-gray-700">Guidance</h4>
                        <div id="q49-guide" class="text-gray-700"></div>
                        <button id="q49-export" class="mt-1 px-2 py-0.5 rounded border bg-green-50 hover:bg-green-100 text-green-700 text-xs">Copy config JSON</button>
                        <div id="q49-export-status" class="h-4 text-green-600 text-xs"></div>
                    </div>
                </div>
            </div>

            <!-- Phase 4: Emergent Capability Thresholds -->
            <div class="bg-white p-3 rounded-lg border space-y-3">
                <h4 class="font-medium text-gray-700 text-sm">Emergent capability ladder</h4>
                <ol id="q49-ladder" class="space-y-1 text-xs" aria-live="polite"></ol>
                <div id="q49-th-near" class="text-xs text-indigo-700 h-4" aria-live="polite"></div>
            </div>

            <!-- Output -->
            <div id="q49-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900" aria-live="polite" role="status"></div>
        </div>`,
        script: () => {
            const pEl = document.getElementById('q49-params');
            const dEl = document.getElementById('q49-data');
            const cEl = document.getElementById('q49-context');
            const aEl = document.getElementById('q49-align');
            const badgeEl = document.getElementById('q49-impact-badge');
            const meterEl = document.getElementById('q49-meter');
            const prosEl = document.getElementById('q49-pros');
            const consEl = document.getElementById('q49-cons');
            const expl = document.getElementById('q49-expl');
            const breakdownEl = document.getElementById('q49-breakdown');
            const regimesEl = document.getElementById('q49-regimes');
            const diffEl = document.getElementById('q49-diff');
            const ratioEl = document.getElementById('q49-ratio');
            const spark = document.getElementById('q49-spark');
            const scaleToggle = document.getElementById('q49-scale-toggle');
            const scaleBox = document.getElementById('q49-scale-box');
            const lossEl = document.getElementById('q49-loss');
            const utilBar = document.getElementById('q49-util-bar');
            const utilLabel = document.getElementById('q49-util-label');
            const alignBars = document.getElementById('q49-alignbars');
            const lensEl = document.getElementById('q49-lens');
            const cbEl = document.getElementById('q49-cb');
            const paretoCanvas = document.getElementById('q49-pareto');
            // Phase 3 elements
            const presetBtns = document.querySelectorAll('.q49-preset');
            const capA = document.getElementById('q49-capA');
            const capB = document.getElementById('q49-capB');
            const capClear = document.getElementById('q49-capClear');
            const abStatus = document.getElementById('q49-ab-status');
            const abDiff = document.getElementById('q49-ab-diff');
            const footEl = document.getElementById('q49-foot');
            const guideEl = document.getElementById('q49-guide');
            const exportBtn = document.getElementById('q49-export');
            const exportStatus = document.getElementById('q49-export-status');
            // Phase 4 elements
            const ladderEl = document.getElementById('q49-ladder');
            const nearThEl = document.getElementById('q49-th-near');
            if (!pEl || !dEl || !cEl || !aEl || !badgeEl || !meterEl || !prosEl || !consEl || !expl) return;

            let prev = { p: parseFloat(pEl.value), d: parseFloat(dEl.value), ctx: cEl.value, align: aEl.value };
            let snapA = null, snapB = null;
            let prevLadderLevel = -1; // highest completed index previously

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

            function ctxToNumber(val) {
                // '4K' -> 4000 approximation
                return parseInt(val) * 1000;
            }

            function computeScore(pLog, dLog, ctx, align, lens) {
                // Base components
                const pScore = (pLog - 7) / (13 - 7);
                const dScore = (dLog - 9) / (14 - 9);
                const scale = Math.sqrt(Math.max(0, pScore * dScore));
                const ctxScore = Math.min(1, Math.log10(ctx) / 5);
                let alignBonus = align === 'RLHF' ? 0.15 : align === 'Instruction-tuned' ? 0.08 : 0.0;
                // Lens weighting
                let wScale=0.7, wCtx=0.2, alignMult=1;
                if (lens === 'production') { wScale=0.55; wCtx=0.25; alignMult=1.15; }
                else if (lens === 'research') { wScale=0.75; wCtx=0.20; alignMult=1; }
                alignBonus *= alignMult;
                const raw = wScale*scale + wCtx*ctxScore + alignBonus;
                const final = Math.max(0, Math.min(1, raw));
                return { final, scale, ctxScore, alignBonus, wScale, wCtx, alignMult };
            }

            function render() {
                const pLog = parseFloat(pEl.value || '9.5');
                const dLog = parseFloat(dEl.value || '11.5');
                const ctx = ctxToNumber(cEl.value || '8K');
                const align = aEl.value || 'None';
                const lens = lensEl ? lensEl.value : 'research';
                const { final: score, scale, ctxScore, alignBonus, wScale, wCtx, alignMult } = computeScore(pLog, dLog, ctx, align, lens);
                setImpact(score);

                // Breakdown (percent share of final). Avoid divide by zero.
                if (breakdownEl) {
                    if (score > 0) {
                        const scalePart = (wScale*scale)/score*100;
                        const ctxPart = (wCtx*ctxScore)/score*100;
                        const alignPart = (alignBonus)/score*100;
                        breakdownEl.textContent = `Breakdown (${lens}): Scale ${scalePart.toFixed(0)}% · Context ${ctxPart.toFixed(0)}% · Align ${alignPart.toFixed(0)}%`;
                    } else breakdownEl.textContent = 'Breakdown: n/a';
                }

                // Regime chips
                if (regimesEl) {
                    const params = Math.pow(10, pLog);
                    const data = Math.pow(10, dLog);
                    const ratio = data / params; // tokens per parameter
                    const chips = [];
                    const cbMode = cbEl && cbEl.checked;
                    if (ratio < 10) chips.push({ t: (cbMode?'# ':'')+'Param-heavy (data scarce)', cls: 'bg-orange-100 text-orange-800 border-orange-300' });
                    else if (ratio > 40) chips.push({ t: (cbMode?'* ':'')+'Data-heavy (capacity limited)', cls: 'bg-indigo-100 text-indigo-800 border-indigo-300' });
                    else chips.push({ t: (cbMode?'= ':'')+'Balanced data/params', cls: 'bg-green-100 text-green-800 border-green-300' });
                    if ((cEl.value === '32K' || cEl.value === '128K') && scale < 0.4) chips.push({ t: (cbMode?'+ ':'')+'Context underutilized', cls: 'bg-yellow-100 text-yellow-800 border-yellow-300' });
                    regimesEl.innerHTML = chips.map(ch => `<span class=\"px-2 py-0.5 rounded border text-xs font-medium ${ch.cls} ${cbMode?'border-dashed':''}\">${ch.t}</span>`).join('');
                    if (ratioEl) {
                        let cls = 'border-gray-300 bg-gray-100 text-gray-700';
                        if (ratio < 10) cls = 'border-orange-300 bg-orange-50 text-orange-700';
                        else if (ratio > 40) cls = 'border-indigo-300 bg-indigo-50 text-indigo-700';
                        else cls = 'border-green-300 bg-green-50 text-green-700';
                        ratioEl.className = `px-2 py-0.5 rounded border ${cls}`;
                        ratioEl.textContent = `Data/Param ratio: ${ratio.toFixed(1)} (target 10–40)`;
                    }
                }

                const pros = [];
                const cons = [];
                if (pLog >= 11) pros.push('High capacity for complex tasks and reasoning');
                if (dLog >= 12) pros.push('Broad knowledge coverage from large corpora');
                if (ctx >= 32000) pros.push('Handles longer documents and multi-step prompts');
                if (align !== 'None') pros.push('Better instruction-following and safety');

                if (pLog <= 8.5) cons.push('Limited capacity; may struggle with nuanced tasks');
                if (dLog <= 10) cons.push('Narrow knowledge; risk of factual gaps');
                if (ctx <= 8000) cons.push('Short context; may truncate references');
                if (align === 'None') cons.push('Unaligned outputs may be less helpful or safe');

                prosEl.innerHTML = pros.map(p => `<li>${p}</li>`).join('');
                consEl.innerHTML = cons.map(c => `<li>${c}</li>`).join('');

                const params = (Math.pow(10, pLog)).toExponential(1);
                const data = (Math.pow(10, dLog)).toExponential(1);
                expl.innerHTML = `
                    <div class=\"flex items-center gap-2 mb-2\"><span class=\"text-indigo-700\">Current setup</span>
                    <span class=\"text-xs text-gray-500\">(params≈${params}, data tokens≈${data}, ctx=${cEl.value}, align=${align})</span></div>
                    LLM capability emerges from scale (parameters and data), context window, and alignment. These factors shape in-context learning and generalization.
                `;
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }

                // Alignment contribution bars
                if (alignBars) {
                    const baseScore = Math.max(0, Math.min(1, ( (lens==='production'?0.55:0.75)*scale + (lens==='production'?0.25:0.20)*ctxScore )));
                    const alignDelta = score - baseScore;
                    alignBars.innerHTML = `
                        <div class=\"space-y-1 mt-2\">
                            <div class=\"flex items-center gap-2\"><span class=\"text-gray-600\">Base</span><div class=\"flex-1 h-2 bg-gray-200 rounded overflow-hidden\"><div style=\"width:${(baseScore*100).toFixed(0)}%;background:#6366f1\" class=\"h-full\"></div></div></div>
                            <div class=\"flex items-center gap-2\"><span class=\"text-gray-600\">Aligned</span><div class=\"flex-1 h-2 bg-gray-200 rounded overflow-hidden\"><div style=\"width:${(score*100).toFixed(0)}%;background:#16a34a\" class=\"h-full\"></div></div><span class=\"text-xs text-gray-500\">+${(alignDelta*100).toFixed(0)}%</span></div>
                        </div>`;
                }
                // Pareto plot (capability vs latency proxy)
                if (paretoCanvas && paretoCanvas.getContext) {
                    const ctxp = paretoCanvas.getContext('2d');
                    ctxp.clearRect(0,0,paretoCanvas.width, paretoCanvas.height);
                    const P = Math.pow(10, pLog);
                    const latencyProxy = Math.pow(P, 1/3); // monotonic
                    // Balanced recommendation: adjust ratio toward 25 if outside band
                    let recPLog = pLog, recDLog = dLog;
                    const ratio = Math.pow(10, dLog - pLog);
                    if (ratio < 10) { // increase data
                        const targetRatio = 25;
                        recDLog = pLog + Math.log10(targetRatio);
                    } else if (ratio > 40) { // increase params
                        const targetRatio = 25;
                        recPLog = dLog - Math.log10(targetRatio);
                    }
                    const recScore = computeScore(recPLog, recDLog, ctx, align, lens).final;
                    const recLatency = Math.pow(Math.pow(10, recPLog), 1/3);
                    // Normalize axes
                    function norm(v, min, max){ return (v-min)/(max-min||1); }
                    const capMin=0, capMax=1; // scores already 0..1
                    const latMin = Math.pow(10,7) ** (1/3); // min param
                    const latMax = Math.pow(10,13) ** (1/3); // max param
                    const curX = 8 + norm(latencyProxy, latMin, latMax)*(paretoCanvas.width-16);
                    const curY = (paretoCanvas.height-8) - norm(score, capMin, capMax)*(paretoCanvas.height-16);
                    const recX = 8 + norm(recLatency, latMin, latMax)*(paretoCanvas.width-16);
                    const recY = (paretoCanvas.height-8) - norm(recScore, capMin, capMax)*(paretoCanvas.height-16);
                    // Axes
                    ctxp.strokeStyle = '#9ca3af';
                    ctxp.lineWidth = 1;
                    ctxp.beginPath();
                    ctxp.moveTo(8, paretoCanvas.height-8); ctxp.lineTo(paretoCanvas.width-4, paretoCanvas.height-8); // x
                    ctxp.moveTo(8, paretoCanvas.height-8); ctxp.lineTo(8, 4); // y
                    ctxp.stroke();
                    // Line
                    ctxp.strokeStyle='#6366f1';
                    ctxp.beginPath();
                    ctxp.moveTo(curX, curY); ctxp.lineTo(recX, recY); ctxp.stroke();
                    // Points
                    ctxp.fillStyle='#2563eb';
                    ctxp.beginPath(); ctxp.arc(curX, curY, 3, 0, Math.PI*2); ctxp.fill();
                    ctxp.fillStyle='#16a34a';
                    ctxp.beginPath(); ctxp.arc(recX, recY, 3, 0, Math.PI*2); ctxp.fill();
                    paretoCanvas.title = `Current latency proxy & capability vs recommended balanced configuration (blue=current, green=balanced)`;
                }

                // Sparkline (loss vs params increase with data fixed)
                if (spark && spark.getContext) {
                    const ctx2 = spark.getContext('2d');
                    ctx2.clearRect(0,0,spark.width,spark.height);
                    const LINF=1, a=3, b=2, alpha=0.08, beta=0.05;
                    const dataLog = dLog;
                    function loss(plog){
                        const P = Math.pow(10, plog);
                        const D = Math.pow(10, dataLog);
                        return LINF + a*Math.pow(P, -alpha) + b*Math.pow(D, -beta);
                    }
                    // Fixed param sweep for visual consistency (7..15) irrespective of current base param.
                    const sweepStart = 7, sweepEnd = 15, steps = 32;
                    const points = [];
                    for(let i=0;i<steps;i++){
                        const pl = sweepStart + (i/(steps-1))*(sweepEnd - sweepStart);
                        points.push({ pl, y: loss(pl) });
                    }
                    const globalMin = Math.min(...points.map(p=>p.y));
                    const globalMax = Math.max(...points.map(p=>p.y));
                    // Draw curve
                    ctx2.beginPath();
                    points.forEach((p,i)=>{
                        const x = (i/(points.length-1))*(spark.width-6)+3;
                        const norm = (p.y - globalMin)/(globalMax - globalMin || 1);
                        const y = 5 + norm*(spark.height-10);
                        const yInv = spark.height - y;
                        if(i===0) ctx2.moveTo(x,yInv); else ctx2.lineTo(x,yInv);
                    });
                    ctx2.strokeStyle = '#2563eb';
                    ctx2.lineWidth = 1.25;
                    ctx2.stroke();

                    // Highlight current param position within sweep
                    const curNorm = (pLog - sweepStart)/(sweepEnd - sweepStart);
                    const curX = Math.max(0, Math.min(1, curNorm))*(spark.width-6)+3;
                    const curLoss = loss(pLog);
                    const curLossNorm = (curLoss - globalMin)/(globalMax - globalMin || 1);
                    const curY = 5 + curLossNorm*(spark.height-10);
                    ctx2.fillStyle = '#dc2626';
                    ctx2.beginPath();
                    ctx2.arc(curX, spark.height - curY, 3, 0, Math.PI*2);
                    ctx2.fill();

                    // Start / end small ticks
                    ctx2.strokeStyle='#6b7280';
                    ctx2.lineWidth=1;
                    ctx2.beginPath();
                    ctx2.moveTo(3, spark.height-5);
                    ctx2.lineTo(3, spark.height-10);
                    ctx2.moveTo(spark.width-3, spark.height-5);
                    ctx2.lineTo(spark.width-3, spark.height-10);
                    ctx2.stroke();

                    // Annotation (title attribute for accessibility)
                    const startLoss = loss(sweepStart).toFixed(2);
                    const endLoss = loss(sweepEnd).toFixed(2);
                    spark.title = `Loss sweep (data fixed @ 10^${dataLog.toFixed(1)} tokens): start≈${startLoss}, current≈${curLoss.toFixed(2)}, far-end≈${endLoss}`;
                }

                // Scaling law formula & relative loss
                if (scaleBox && lossEl) {
                    const LINF=1, a=3, b=2, alpha=0.08, beta=0.05;
                    const P = Math.pow(10, pLog);
                    const D = Math.pow(10, dLog);
                    const currentLoss = LINF + a*Math.pow(P, -alpha) + b*Math.pow(D, -beta);
                    const baseP0 = Math.pow(10,7); // min range
                    const baseD0 = Math.pow(10,9);
                    const baseLoss = LINF + a*Math.pow(baseP0, -alpha) + b*Math.pow(baseD0, -beta);
                    const rel = baseLoss / currentLoss;
                    lossEl.textContent = `Predicted relative loss improvement vs tiny baseline: ${(rel).toFixed(2)}× lower`;
                    if (scaleBox.classList.contains('hidden') === false && window.MathJax?.typesetPromise) {
                        window.MathJax.typesetPromise([scaleBox]).catch(()=>{});
                    }
                }

                // Context utilization
                if (utilBar && utilLabel) {
                    // Utilization grows with scale; simple model
                    const rawCtx = ctx; // numeric tokens
                    const scaleFactor = Math.max(0, Math.min(1, scale));
                    const util = 0.4 + 0.6*scaleFactor; // base 40% -> 100%
                    const eff = util * 100;
                    utilBar.style.width = eff.toFixed(0)+'%';
                    utilLabel.textContent = eff.toFixed(0)+'%';
                }

                // Cost & footprint
                if (footEl) {
                    const P = Math.pow(10, pLog);
                    const D = Math.pow(10, dLog);
                    const flops = 6 * P * D; // heuristic
                    const peta = flops / 1e15;
                    let band = 'Low';
                    if (peta > 5e5) band = 'Frontier';
                    else if (peta > 5e4) band = 'High';
                    else if (peta > 5e3) band = 'Moderate';
                    const memGB = (P * 2 / 1e9).toFixed(2); // fp16 params only
                    const latencyClass = P > 1e12 ? 'High (tensor parallelism needed)' : P > 1e11 ? 'Moderate (multi-GPU)' : P > 5e9 ? 'Manageable' : 'Low';
                    footEl.innerHTML = `
                        <div><span class=\"text-gray-500\">Train FLOPs (≈6·P·D):</span> ${peta.toExponential(2)} PFLOPs <span class=\"ml-1 px-1 rounded bg-gray-100\">${band}</span></div>
                        <div><span class=\"text-gray-500\">Param memory fp16:</span> ~${memGB} GB</div>
                        <div><span class=\"text-gray-500\">Latency class:</span> ${latencyClass}</div>
                    `;
                }

                // Guidance panel
                if (guideEl) {
                    const params = Math.pow(10, pLog);
                    const data = Math.pow(10, dLog);
                    const ratio = data / params;
                    const advice = [];
                    if (ratio < 10) advice.push('Increase data tokens before scaling params further');
                    if (ratio > 40) advice.push('Model may be capacity limited—scale parameters');
                    if ((cEl.value === '32K' || cEl.value === '128K') && scale < 0.4) advice.push('Context length exceeds capacity leverage—consider smaller window');
                    if (aEl.value === 'None') advice.push('Add alignment (instruction/RLHF) to unlock usability');
                    if (!advice.length) advice.push('Configuration is balanced—incremental scaling yields diminishing returns');
                    guideEl.innerHTML = '<ul class="list-disc ml-4 space-y-1">' + advice.map(a=>`<li>${a}</li>`).join('') + '</ul>';
                }

                // Capability ladder (Phase 4)
                if (ladderEl) {
                    const thresholds = [
                        { name: 'Basic text completion', pass: score >= 0.15 },
                        { name: 'Multi-step reasoning baseline', pass: score >= 0.35 },
                        { name: 'Code synthesis potential', pass: score >= 0.55 },
                        { name: 'Long document integration', pass: (score >= 0.70) && (cEl.value==='32K' || cEl.value==='128K') },
                        { name: 'Tool / function calling readiness', pass: score >= 0.80 && aEl.value !== 'None' }
                    ];
                    const currentLevel = thresholds.reduce((acc,t,i)=> t.pass ? i : acc, -1);
                    ladderEl.innerHTML = thresholds.map((t,i)=>{
                        const base = 'flex items-center gap-2 px-2 py-1 rounded border';
                        const complete = t.pass ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500';
                        const pulse = (t.pass && i>prevLadderLevel) ? 'animate-pulse' : '';
                        return `<li class="${base} ${complete} ${pulse}"><span class="w-4 text-center">${t.pass ? '✓' : '•'}</span> <span>${t.name}</span></li>`;
                    }).join('');
                    if (nearThEl) {
                        const next = thresholds.find((t,i)=> i>currentLevel);
                        if (next) {
                            // approximate need: show simple suggestion based on which dimension could help
                            let hint = '';
                            if (next.name.startsWith('Multi-step')) hint = 'Increase balanced scale (both params & data).';
                            else if (next.name.startsWith('Code')) hint = 'Scale parameters and diversify data.';
                            else if (next.name.startsWith('Long')) hint = 'Extend context AND ensure capacity (raise params).';
                            else if (next.name.startsWith('Tool')) hint = 'Add alignment (instruction/RLHF) and modest scale.';
                            const gap = (([0.15,0.35,0.55,0.70,0.80][currentLevel+1] || 1) - score);
                            if (gap <= 0.06) nearThEl.textContent = `Near: ${next.name} (raise score ~${(gap*100).toFixed(0)}%) – ${hint}`;
                            else nearThEl.textContent = '';
                        } else {
                            nearThEl.textContent = '';
                        }
                    }
                    prevLadderLevel = currentLevel;
                }

                // Micro diff line
                if (diffEl) {
                    let msg = '';
                    const changes = [];
                    const dParam = pLog - prev.p;
                    const dData = dLog - prev.d;
                    if (Math.abs(dParam) >= 0.2) {
                        const mult = Math.pow(10, Math.abs(dParam));
                        changes.push(`Parameters ${dParam>0?'+':'-'}${Math.abs(dParam).toFixed(1)} log10 (~${mult.toFixed(1)}x)`);
                    }
                    if (Math.abs(dData) >= 0.2) {
                        const mult = Math.pow(10, Math.abs(dData));
                        changes.push(`Data ${dData>0?'+':'-'}${Math.abs(dData).toFixed(1)} log10 (~${mult.toFixed(1)}x)`);
                    }
                    if (prev.ctx !== cEl.value) changes.push(`Context → ${cEl.value}`);
                    if (prev.align !== align) changes.push(`Alignment → ${align}`);
                    if (prev.lens && prev.lens !== lens) changes.push(`Lens → ${lens}`);
                    if (changes.length) msg = 'Change: ' + changes.join('; ');
                    diffEl.textContent = msg;
                    if (msg) setTimeout(()=>{ if (diffEl.textContent === msg) diffEl.textContent=''; }, 1800);
                }

                prev = { p: pLog, d: dLog, ctx: cEl.value, align, lens };
            }

            // Toggle scaling law box
            if (scaleToggle && scaleBox) {
                scaleToggle.addEventListener('click', ()=>{
                    scaleBox.classList.toggle('hidden');
                    if (!scaleBox.classList.contains('hidden') && window.MathJax?.typesetPromise) {
                        window.MathJax.typesetPromise([scaleBox]).catch(()=>{});
                    }
                });
            }

            // Presets
            function applyPreset(name){
                const presets = {
                    edge: { p:7.5, d:9.5, ctx:'4K', align:'None' },
                    mid: { p:9.5, d:11.3, ctx:'8K', align:'Instruction-tuned' },
                    assistant: { p:11.2, d:12.5, ctx:'32K', align:'RLHF' },
                    frontier: { p:12.5, d:13.5, ctx:'128K', align:'RLHF' }
                };
                const ps = presets[name];
                if(!ps) return;
                pEl.value = ps.p;
                dEl.value = ps.d;
                cEl.value = ps.ctx;
                aEl.value = ps.align;
                render();
            }
            presetBtns.forEach(btn=> btn.addEventListener('click', ()=> applyPreset(btn.getAttribute('data-preset'))));

            // A/B capture
            function snapshot(){
                const pLog = parseFloat(pEl.value);
                const dLog = parseFloat(dEl.value);
                const ctx = cEl.value;
                const align = aEl.value;
                const lens = lensEl ? lensEl.value : 'research';
                const { final } = computeScore(pLog, dLog, ctxToNumber(ctx), align, lens);
                return { pLog, dLog, ctx, align, lens, score: final };
            }
            function diff(a,b){
                if(!a||!b) return '';
                const parts = [];
                function delta(label, va, vb, fmt=(v)=>v.toFixed(2)){
                    if(va===vb) return;
                    parts.push(`${label}: ${fmt(va)} → ${fmt(vb)} (${(vb-va>=0?'+':'')+(vb-va).toFixed(2)})`);
                }
                delta('Params log10', a.pLog, b.pLog);
                delta('Data log10', a.dLog, b.dLog);
                if(a.ctx!==b.ctx) parts.push(`Context: ${a.ctx} → ${b.ctx}`);
                if(a.align!==b.align) parts.push(`Align: ${a.align} → ${b.align}`);
                if(a.lens!==b.lens) parts.push(`Lens: ${a.lens} → ${b.lens}`);
                delta('Score', a.score, b.score, v=> (v*100).toFixed(0)+'%');
                return parts.join('; ');
            }
            function updateAB(){
                capB.disabled = !snapA;
                capClear.disabled = !(snapA||snapB);
                abDiff.textContent = diff(snapA, snapB);
            }
            if(capA) capA.addEventListener('click', ()=>{ snapA = snapshot(); abStatus.textContent='Captured A'; updateAB(); setTimeout(()=>{ if(abStatus.textContent==='Captured A') abStatus.textContent=''; },1500); });
            if(capB) capB.addEventListener('click', ()=>{ if(!snapA) return; snapB = snapshot(); abStatus.textContent='Captured B'; updateAB(); setTimeout(()=>{ if(abStatus.textContent==='Captured B') abStatus.textContent=''; },1500); });
            if(capClear) capClear.addEventListener('click', ()=>{ snapA=null; snapB=null; updateAB(); });

            // Export config
            if(exportBtn){
                exportBtn.addEventListener('click', ()=>{
                    const shot = snapshot();
                    const P = Math.pow(10, shot.pLog);
                    const D = Math.pow(10, shot.dLog);
                    const ratio = D / P;
            const out = { ...shot, paramsApprox: P.toExponential(2), dataTokensApprox: D.toExponential(2), ratio: ratio.toFixed(2) };
                    const text = JSON.stringify(out, null, 2);
                    navigator.clipboard.writeText(text).then(()=>{ exportStatus.textContent='Copied'; setTimeout(()=>{ if(exportStatus.textContent==='Copied') exportStatus.textContent=''; }, 1200); }).catch(()=>{ exportStatus.textContent='Clipboard blocked'; });
                });
            }

        lensEl?.addEventListener('change', render);
        cbEl?.addEventListener('change', render);

            pEl.addEventListener('input', render);
            dEl.addEventListener('input', render);
            cEl.addEventListener('change', render);
            aEl.addEventListener('change', render);
            render();
        }
    }
};
// Standard optional export (consistency with other questions)
if (typeof module !== 'undefined') { module.exports = question; }
