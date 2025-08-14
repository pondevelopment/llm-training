// Question 47: How do LLMs differ from traditional statistical language models?
// Created: 2025-08-14
// Educational Focus: Contrast transformers-based LLMs with classical statistical models (N-grams, HMMs); show capacity, context, and training differences.

const question = {
    title: "47. How do LLMs differ from traditional statistical language models?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core idea</h4>
            <p class="text-blue-800">LLMs are neural sequence models using transformer architectures, trained on massive corpora with self-supervised objectives. Traditional models like N-grams and HMMs rely on simplified independence assumptions and shallow statistics. LLMs capture long-range dependencies and semantic structure; classical models are limited by fixed contexts and feature design.</p>
            <div class="text-center mt-3 bg-white p-3 rounded border">
                $$\\text{Attention}(\\mathbf{Q},\\mathbf{K},\\mathbf{V}) = \\text{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}}\\right)\\mathbf{V}$$
            </div>
        </div>
        
        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">N-grams / Statistical</h5>
                <ul class="text-sm text-green-800 list-disc pl-5 space-y-1">
                    <li>Fixed window: P(word | last N−1 words)</li>
                    <li>Sparse counts + smoothing (Kneser–Ney)</li>
                    <li>Limited generalization; struggles with rare words</li>
                </ul>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">HMMs / Probabilistic</h5>
                <ul class="text-sm text-purple-800 list-disc pl-5 space-y-1">
                    <li>Hidden states, Markov assumptions</li>
                    <li>Viterbi / Forward–Backward inference</li>
                    <li>Good for tagging; limited expressivity</li>
                </ul>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Transformers / LLMs</h5>
                <ul class="text-sm text-orange-800 list-disc pl-5 space-y-1">
                    <li>Self-attention over long contexts</li>
                    <li>Rich embeddings; transfer via pretraining</li>
                    <li>Handles diverse tasks with prompting</li>
                </ul>
            </div>
        </div>
        
        <!-- Why It Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Context length:</strong> LLMs model long-range dependencies; N-grams are bounded by N.</li>
                <li>• <strong>Generalization:</strong> LLMs learn semantics via embeddings; counts-based models memorize statistics.</li>
                <li>• <strong>Versatility:</strong> Prompting enables many tasks without retraining; classical models need bespoke pipelines.</li>
                <li>• <strong>Compute tradeoff:</strong> LLMs need significant compute; classical models are cheap but limited.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🧪 N-gram vs Transformer — context and perplexity explorer",
        html: `<div class="space-y-6">
            <!-- Controls -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid md:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <select id="q47-model" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option value="ngram" selected>N-gram (N=)</option>
                            <option value="hmm">HMM (tagging)</option>
                            <option value="transformer">Transformer (LLM)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Context size / N</label>
                        <input id="q47-n" type="range" min="1" max="10" value="3" class="w-full">
                        <div class="text-xs text-gray-600">For N-gram: order; For Transformer: visible tokens</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Sequence length</label>
                        <select id="q47-L" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>8</option>
                            <option selected>16</option>
                            <option>32</option>
                            <option>64</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Impact & Guidance -->
            <div class="bg-white p-3 rounded-lg border">
                <div class="grid md:grid-cols-3 gap-4 items-start">
                    <div>
                        <div class="text-sm font-medium text-gray-700 mb-1">Impact at current settings</div>
                        <div id="q47-impact" class="text-xs">
                            <span id="q47-impact-badge" class="inline-block px-2 py-0.5 rounded border"></span>
                            <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                <div id="q47-meter" class="h-full rounded" style="width:0%"></div>
                            </div>
                        </div>
                        <div class="text-[11px] text-gray-500 mt-1">Based on effective context vs. sequence length.</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-green-700 mb-1">Good for</div>
                        <ul id="q47-pros" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-red-700 mb-1">Watch out for</div>
                        <ul id="q47-cons" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                </div>
            </div>

            <!-- Canvas -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div id="q47-canvas" class="space-y-3"></div>
            </div>
            
            <!-- Explanation -->
            <div id="q47-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900"></div>
        </div>`,
        script: () => {
            const modelEl = document.getElementById('q47-model');
            const nEl = document.getElementById('q47-n');
            const LEl = document.getElementById('q47-L');
            const canvas = document.getElementById('q47-canvas');
            const expl = document.getElementById('q47-expl');
            const badgeEl = document.getElementById('q47-impact-badge');
            const meterEl = document.getElementById('q47-meter');
            const prosEl = document.getElementById('q47-pros');
            const consEl = document.getElementById('q47-cons');
            if (!modelEl || !nEl || !LEl || !canvas || !expl) return;

            function token(label, active=false) {
                const t = document.createElement('span');
                t.className = `inline-flex items-center justify-center w-6 h-6 rounded text-xs font-mono border ${active? 'bg-indigo-100 border-indigo-300' : 'bg-gray-50 border-gray-300'}`;
                t.textContent = label;
                return t;
            }
            function row(title, children) {
                const wrap = document.createElement('div');
                wrap.className = 'flex items-center gap-2';
                const label = document.createElement('div');
                label.className = 'w-44 text-right pr-2 text-xs text-gray-600';
                label.textContent = title;
                const content = document.createElement('div');
                content.className = 'flex flex-wrap items-center gap-1';
                children.forEach(c => content.appendChild(c));
                wrap.appendChild(label);
                wrap.appendChild(content);
                return wrap;
            }

            function setImpact(pct) {
                pct = Math.max(0, Math.min(1, pct));
                let label = '';
                let bg = '#e5e7eb', fg = '#111827', border = '#d1d5db';
                if (pct >= 0.95) { label = `Excellent (${Math.round(pct*100)}%)`; bg = '#dcfce7'; fg = '#166534'; border = '#86efac'; }
                else if (pct >= 0.6) { label = `Good (${Math.round(pct*100)}%)`; bg = '#dbeafe'; fg = '#1e40af'; border = '#93c5fd'; }
                else if (pct >= 0.3) { label = `Limited (${Math.round(pct*100)}%)`; bg = '#fef9c3'; fg = '#854d0e'; border = '#fde68a'; }
                else { label = `Poor (${Math.round(pct*100)}%)`; bg = '#fee2e2'; fg = '#991b1b'; border = '#fecaca'; }
                if (badgeEl) {
                    badgeEl.textContent = label;
                    badgeEl.style.backgroundColor = bg;
                    badgeEl.style.color = fg;
                    badgeEl.style.borderColor = border;
                }
                if (meterEl) {
                    meterEl.style.width = `${Math.round(pct*100)}%`;
                    meterEl.style.backgroundColor = fg;
                }
            }

            function getProsCons(model, N, L, eff) {
                const common = {
                    ngram: {
                        pros: [
                            'Simple and fast for small N',
                            'Interpretable probabilities from counts',
                            'Low compute cost, easy to implement'
                        ],
                        cons: [
                            'Fixed context window; misses long-range dependencies',
                            'Data sparsity with larger N; many unseen n-grams',
                            'Poor semantic generalization (surface-level stats)'
                        ]
                    },
                    hmm: {
                        pros: [
                            'Encodes structure via hidden states',
                            'Efficient DP inference (Viterbi, Forward–Backward)',
                            'Strong for tagging/segmentation tasks'
                        ],
                        cons: [
                            'Markov assumptions limit long-range context',
                            'Requires feature engineering or labeled data',
                            'Lower expressivity than neural models'
                        ]
                    },
                    transformer: {
                        pros: [
                            'Long-range context via self-attention',
                            'Rich embeddings and transfer from pretraining',
                            'Versatile with prompting across tasks'
                        ],
                        cons: [
                            'High compute/memory; attention scales quadratically',
                            'May hallucinate; alignment and safety challenges',
                            'Large data requirements for strong performance'
                        ]
                    }
                };

                // Dynamic notes
                if (model === 'ngram') {
                    if (N >= 5) common.ngram.cons.push('Sparsity risk rises with high N; smoothing becomes critical');
                    if (N <= 2) common.ngram.cons.push('Very small N may underfit local structure');
                }
                if (model === 'transformer') {
                    const pct = eff / Math.max(1,L);
                    if (pct < 0.4) common.transformer.cons.push('Limited effective context with current setting; increase context size');
                }
                return common[model];
            }

            function render() {
                const model = modelEl.value;
                const N = Math.max(1, Math.min(10, parseInt(nEl.value||'3',10)));
                const L = Math.max(4, Math.min(64, parseInt(LEl.value||'16',10)));
                canvas.innerHTML = '';

                // Sequence
                const seq = [];
                for (let i=1;i<=L;i++) seq.push(token(String(i)));
                canvas.appendChild(row('Sequence', seq));

                // Visible context for next token
                const ctx = [];
                if (model === 'ngram') {
                    for (let i=Math.max(1, L - (N-1)); i<=L; i++) ctx.push(token(String(i), true));
                } else if (model === 'hmm') {
                    // HMM effectively first-order Markov on states; show local window
                    for (let i=Math.max(1, L-1); i<=L; i++) ctx.push(token(String(i), true));
                } else {
                    // Transformer: can use long context; bound by N slider here
                    for (let i=Math.max(1, L-(N)); i<=L; i++) ctx.push(token(String(i), true));
                }
                canvas.appendChild(row('Context used for next token', ctx));

                // Toy perplexity trend (illustrative)
                const basePP = model === 'transformer' ? 20 : model === 'hmm' ? 80 : 120;
                const eff = ctx.length; // effective context size
                const pp = Math.max(10, Math.round(basePP / Math.log2(2+eff)));
                const ppEl = document.createElement('div');
                ppEl.className = 'text-sm text-gray-700 mt-2';
                ppEl.innerHTML = `<span class="font-medium">Estimated perplexity (toy):</span> ${pp}`;
                canvas.appendChild(ppEl);

                // Impact and guidance
                setImpact(eff / Math.max(1, L));
                if (prosEl && consEl) {
                    prosEl.innerHTML = '';
                    consEl.innerHTML = '';
                    const pc = getProsCons(model, N, L, eff);
                    pc.pros.forEach(txt => { const li = document.createElement('li'); li.textContent = txt; prosEl.appendChild(li); });
                    pc.cons.forEach(txt => { const li = document.createElement('li'); li.textContent = txt; consEl.appendChild(li); });
                }

                // Explanation
                const messages = {
                    ngram: `N-grams estimate \\(p(w_t \\mid w_{t-1},...,w_{t-N+1})\\) from counts with smoothing. Larger N reduces sparsity but explodes parameters; generalization is limited to seen patterns.`,
                    hmm: `HMMs model sequences via hidden states with Markov assumptions. Great for tagging and simple structure, but long-range dependencies are hard to encode explicitly.`,
                    transformer: `Transformers learn contextual embeddings and use self-attention to relate distant tokens. Pretraining on large corpora plus fine-tuning or prompting yields broad capabilities.`
                };
                const title = model==='ngram' ? 'N-gram' : model==='hmm' ? 'HMM' : 'Transformer/LLM';
                expl.innerHTML = `
                    <div class=\"flex items-center gap-2 mb-2\"><span class=\"text-indigo-700\">${title}</span> <span class=\"text-xs text-gray-500\">(N/context=${N}, L=${L})</span></div>
                    ${messages[model]}
                `;

                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }
            }

            modelEl.addEventListener('change', render);
            nEl.addEventListener('input', render);
            LEl.addEventListener('change', render);
            render();
        }
    }
};

module.exports = { question };
