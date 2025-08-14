// Question 46: How do encoders and decoders differ in transformers?
// Created: 2025-08-14
// Educational Focus: Contrast encoder-only, decoder-only, and encoder–decoder stacks; show masking and cross-attention paths.

const question = {
    title: "46. How do encoders and decoders differ in transformers?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core idea</h4>
            <p class="text-blue-800">Encoders turn an input sequence into contextual representations (bidirectional self-attention). Decoders generate tokens autoregressively with a causal mask and, in encoder–decoder models, attend to the encoder’s outputs via cross‑attention.</p>
            <div class="text-center mt-3 bg-white p-3 rounded border">
                $$\\text{Attention}(\\mathbf{Q},\\mathbf{K},\\mathbf{V}) = \\text{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}}\\right)\\mathbf{V}$$
            </div>
        </div>
        
        <!-- Comparison/Options Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Encoder‑only (e.g., BERT)</h5>
                <p class="text-sm text-green-700">Bidirectional self‑attention creates rich token representations for classification, retrieval, etc. No autoregressive generation.</p>
                <code class="text-xs bg-green-100 px-1 rounded">input → contextual embeddings → head (CLS)</code>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Decoder‑only (e.g., GPT)</h5>
                <p class="text-sm text-purple-700">Causal self‑attention: token t sees only tokens 1…t−1. Suited for next‑token generation and long‑form synthesis.</p>
                <code class="text-xs bg-purple-100 px-1 rounded">y<sub>t</sub> ∼ p(· | y_{&lt;t})</code>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Encoder–decoder (e.g., T5)</h5>
                <p class="text-sm text-orange-700">Decoder uses masked self‑attention <em>and</em> cross‑attention to encoder states. Great for sequence‑to‑sequence tasks like translation and summarization.</p>
                <code class="text-xs bg-orange-100 px-1 rounded">x → encoder → decoder (masked SA + cross‑attn) → y</code>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Task fit:</strong> Classification/embedding → encoder; generation → decoder; seq2seq → encoder–decoder.</li>
                <li>• <strong>Masking:</strong> Causal masks enforce left‑to‑right generation; encoders are typically bidirectional.</li>
                <li>• <strong>Information flow:</strong> Cross‑attention lets the decoder condition on the full input at each step.</li>
                <li>• <strong>Fine‑tuning choices:</strong> Pick architecture+heads that match your downstream objective.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🧩 Encoder vs Decoder — information flow explorer",
        html: `<div class="space-y-6">
            <!-- Config -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid md:grid-cols-4 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Model family</label>
                        <select id="q46-arch" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option value="encoder">Encoder‑only</option>
                            <option value="decoder" selected>Decoder‑only</option>
                            <option value="encdec">Encoder–decoder</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Target step t</label>
                        <input id="q46-step" type="range" min="1" max="8" value="5" class="w-full">
                        <div class="text-xs text-gray-600">Autoregressive target position for visualization</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Input length</label>
                        <select id="q46-len" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>4</option>
                            <option>6</option>
                            <option selected>8</option>
                            <option>10</option>
                            <option>12</option>
                        </select>
                        <div class="text-xs text-gray-600">Tokens in source/context</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Impact at t</label>
                        <div id="q46-impact" class="text-xs">
                            <div id="q46-impact-badge" class="inline-block px-2 py-0.5 rounded border"></div>
                            <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                <div id="q46-meter" class="h-full rounded" style="width:0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Canvas -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div id="q46-canvas" class="space-y-3"></div>
            </div>
            
            <!-- Explanation -->
            <div id="q46-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900"></div>
        </div>`,
        script: () => {
            const archSel = document.getElementById('q46-arch');
            const stepEl = document.getElementById('q46-step');
            const lenEl = document.getElementById('q46-len');
            const canvas = document.getElementById('q46-canvas');
            const expl = document.getElementById('q46-expl');
            const badgeEl = document.getElementById('q46-impact-badge');
            const meterEl = document.getElementById('q46-meter');
            if (!archSel || !stepEl || !lenEl || !canvas || !expl) return;

            function badge(text, style) {
                const span = document.createElement('span');
                span.className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`;
                span.textContent = text;
                return span;
            }

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
                label.className = 'w-40 text-right pr-2 text-xs text-gray-600';
                label.textContent = title;
                const content = document.createElement('div');
                content.className = 'flex flex-wrap items-center gap-1';
                children.forEach(c => content.appendChild(c));
                wrap.appendChild(label);
                wrap.appendChild(content);
                return wrap;
            }

            function setImpact(arch, t, L) {
                // Fraction of context visible at step t
                let pct = 1;
                if (arch === 'decoder') pct = L > 0 ? (t - 1) / L : 0;
                pct = Math.max(0, Math.min(1, pct));

                // Buckets and colors
                let label = '';
                let bg = '#e5e7eb'; // gray-200
                let fg = '#111827'; // gray-900
                let border = '#d1d5db'; // gray-300
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

            function render() {
                const arch = archSel.value; 
                const L = Math.max(2, Math.min(12, parseInt(lenEl.value || '8', 10)));
                const t = Math.max(1, Math.min(L, parseInt(stepEl.value || '5', 10)));
                stepEl.max = String(L);
                canvas.innerHTML = '';

                // Inputs
                const srcRow = [];
                for (let i=1;i<=L;i++) srcRow.push(token(String(i), arch!=="decoder" || i<t));
                canvas.appendChild(row('Input tokens', srcRow));

                // Encoder (if present)
                if (arch !== 'decoder') {
                    const encBadges = [badge('Self‑attn (bi‑dir)','bg-green-100 text-green-800 border border-green-300')];
                    canvas.appendChild(row('Encoder', encBadges));
                }

                // Decoder self‑attention (causal if any)
                if (arch !== 'encoder') {
                    const decBadges = [badge('Self‑attn (causal)','bg-purple-100 text-purple-800 border border-purple-300')];
                    canvas.appendChild(row('Decoder', decBadges));
                }

                // Cross‑attention (enc‑dec only)
                if (arch === 'encdec') {
                    const cross = [badge('Cross‑attn → encoder states','bg-orange-100 text-orange-800 border border-orange-300')];
                    canvas.appendChild(row('Cross‑links', cross));
                }

                // Context window visualization for the selected step
                const ctx = [];
                if (arch === 'decoder') {
                    for (let i=1;i<=L;i++) ctx.push(token(String(i), i < t));
                } else if (arch === 'encoder') {
                    for (let i=1;i<=L;i++) ctx.push(token(String(i), true));
                } else { // encdec
                    for (let i=1;i<=L;i++) ctx.push(token(String(i), true));
                }
                canvas.appendChild(row('Visible at step t', ctx));

                // Explanation
                const messages = {
                    encoder: `At any position, the encoder sees the <em>entire</em> input (bidirectional). It does not generate tokens; it produces contextual embeddings typically read by a task head or a decoder.`,
                        decoder: `The decoder enforces a <strong>causal mask</strong>: at step t it can attend only to tokens 1…t−1. This enables next‑token prediction \\(p(y_t\\mid y_{\\lt t})\\).`,
                    encdec: `Two hops: (1) the encoder builds global representations of the source; (2) the decoder uses <em>masked</em> self‑attention plus <strong>cross‑attention</strong> to those encoder states to generate y step‑by‑step.`
                };
                expl.innerHTML = `
                    <div class=\"flex items-center gap-2 mb-2\">
                        ${arch==='encoder' ? '<span class=\"text-green-700\">Encoder‑only</span>' : arch==='decoder' ? '<span class=\"text-purple-700\">Decoder‑only</span>' : '<span class=\"text-orange-700\">Encoder–decoder</span>'}
                        <span class=\"text-xs text-gray-500\">(L = ${L}, t = ${t})</span>
                    </div>
                    ${messages[arch]}
                `;

                // Trigger MathJax typeset for inline math in explanation
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }

                // Impact meter
                setImpact(arch, t, L);
            }

            archSel.addEventListener('change', render);
            stepEl.addEventListener('input', render);
            lenEl.addEventListener('change', render);
            lenEl.addEventListener('input', render);
            render();
        }
    }
};
 module.exports = { question };
