// Question 49: What defines a Large Language Model (LLM)?
// Created: 2025-08-14
// Educational Focus: Define LLMs (architecture, scale, data, capabilities) and provide an explorer linking parameters, data, and context to capabilities/trade-offs.

const question = {
    title: "49. What defines a Large Language Model (LLM)?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core idea</h4>
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
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Roadmapping:</strong> Understanding scale/data trade-offs helps plan budgets.</li>
                <li>• <strong>Performance:</strong> Larger models and longer context often improve quality within limits.</li>
                <li>• <strong>Safety:</strong> Alignment techniques (RLHF, safety tuning) are critical for deployment.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "📈 LLM scale vs capability explorer",
        html: `<div class="space-y-6">
            <!-- Controls -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid md:grid-cols-4 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Parameters (log10)</label>
                        <input id="q49-params" type="range" min="7" max="13" step="0.1" value="9.5" class="w-full">
                        <div class="text-xs text-gray-600">10^x parameters</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Data tokens (log10)</label>
                        <input id="q49-data" type="range" min="9" max="14" step="0.1" value="11.5" class="w-full">
                        <div class="text-xs text-gray-600">10^x tokens</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Context length</label>
                        <select id="q49-context" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>4K</option>
                            <option selected>8K</option>
                            <option>32K</option>
                            <option>128K</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                        <select id="q49-align" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option selected>None</option>
                            <option>Instruction-tuned</option>
                            <option>RLHF</option>
                        </select>
                    </div>
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
                        </div>
                        <div class="text-[11px] text-gray-500 mt-1">Heuristic combining params, data, context, and alignment.</div>
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
            </div>

            <!-- Output -->
            <div id="q49-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900"></div>
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
            if (!pEl || !dEl || !cEl || !aEl || !badgeEl || !meterEl || !prosEl || !consEl || !expl) return;

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

            function computeScore(pLog, dLog, ctx, align) {
                // Rough heuristic: combine log-scaled params+data (Chinchilla-like), add ctx and alignment bonuses
                const pScore = (pLog - 7) / (13 - 7); // 7..13
                const dScore = (dLog - 9) / (14 - 9); // 9..14
                const scale = Math.sqrt(Math.max(0, pScore * dScore));
                const ctxScore = Math.min(1, Math.log10(ctx) / 5); // diminishing returns
                const alignBonus = align === 'RLHF' ? 0.15 : align === 'Instruction-tuned' ? 0.08 : 0.0;
                return Math.max(0, Math.min(1, 0.7*scale + 0.2*ctxScore + alignBonus));
            }

            function render() {
                const pLog = parseFloat(pEl.value || '9.5');
                const dLog = parseFloat(dEl.value || '11.5');
                const ctx = ctxToNumber(cEl.value || '8K');
                const align = aEl.value || 'None';
                const score = computeScore(pLog, dLog, ctx, align);
                setImpact(score);

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
            }

            pEl.addEventListener('input', render);
            dEl.addEventListener('input', render);
            cEl.addEventListener('change', render);
            aEl.addEventListener('change', render);
            render();
        }
    }
};

module.exports = { question };
