// Question 46: How do encoders and decoders differ in transformers?
// Created: 2025-08-14
// Educational Focus: Contrast encoder-only, decoder-only, and encoder–decoder stacks; show masking and cross-attention paths.

const question = {
    title: "46. How do encoders and decoders differ in transformers?",
        answer: `<div class="space-y-4">
                <!-- Recommended Reading (canonical) -->
                <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
                    <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-02">Question 2: How does attention work?</a></li>
                        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-05">Question 5: Tokenization & subwords</a></li>
                        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-07">Question 7: Masking & causal generation</a></li>
                        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-21">Question 21: Context windows & limits</a></li>
                        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-15">Question 15: Distillation & architecture choices</a></li>
                    </ul>
                    <p class="mt-2 text-xs text-indigo-700">Attention mechanics, masking, context, and architecture trade-offs.</p>
                </div>

                <!-- Key Idea (accent) -->
                <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <h4 class="font-semibold text-blue-900 mb-2">🧭 Core Idea</h4>
                        <p class="text-blue-800 text-sm">Encoders form <b>bidirectional contextual embeddings</b>. Decoders generate <b>left‑to‑right</b> under a causal mask. Encoder–decoder stacks add <b>cross‑attention</b> so each target step can consult the full encoded source + its history.</p>
                        <div class="math-display">$$\\text{Attention}(\\mathbf{Q},\\mathbf{K},\\mathbf{V}) = \\text{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}}\\right)\\mathbf{V}$$</div>
                        <ul class="mt-3 list-disc ml-5 text-xs text-blue-800 space-y-1">
                            <li><code class="font-mono">L</code>: source length</li>
                            <li><code class="font-mono">t</code>: decode step (1…T)</li>
                            <li><b>Causal mask</b>: hides future positions ( > t )</li>
                            <li><b>Cross‑attention</b>: decoder queries encoder states</li>
                        </ul>
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
                <span class="text-xs bg-purple-100 px-1 rounded font-mono">\( y_t \sim p(\cdot \mid y_{ < t }) \)</span>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Encoder–decoder (e.g., T5)</h5>
                <p class="text-sm text-orange-700">Decoder uses masked self‑attention <em>and</em> cross‑attention to encoder states. Great for sequence‑to‑sequence tasks like translation and summarization.</p>
                <code class="text-xs bg-orange-100 px-1 rounded">x → encoder → decoder (masked SA + cross‑attn) → y</code>
            </div>
        </div>
        
        <!-- Why This Matters (canonical) -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <b>Task fit:</b> classification/embedding → encoder; generation → decoder; seq2seq → encoder–decoder</li>
                <li>• <b>Masking:</b> causal masks enforce left‑to‑right; encoders see full context</li>
                <li>• <b>Flow:</b> cross‑attention fuses source memory + partial target</li>
                <li>• <b>Tuning:</b> choose architecture + heads that match objectives</li>
            </ul>
        </div>
    </div>`,
    interactive: {
                title: "🧩 Encoder vs Decoder — information flow explorer",
                html: `<div class="space-y-6">
                        <!-- Config -->
                        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                                <div class="flex flex-wrap items-center gap-2 mb-3 text-xs" role="group" aria-label="Architecture presets">
                                    <span class="font-semibold text-gray-700 mr-1">Presets:</span>
                                    <button data-q46-preset="enc-cls" class="px-2 py-0.5 rounded border border-blue-300 bg-white hover:bg-blue-100" title="Encoder classification (full context)">Encoder CLS</button>
                                    <button data-q46-preset="dec-early" class="px-2 py-0.5 rounded border border-blue-300 bg-white hover:bg-blue-100" title="Decoder early token (low context)">Dec early</button>
                                    <button data-q46-preset="dec-late" class="px-2 py-0.5 rounded border border-blue-300 bg-white hover:bg-blue-100" title="Decoder later token (rich context)">Dec late</button>
                                    <button data-q46-preset="encdec-early" class="px-2 py-0.5 rounded border border-blue-300 bg-white hover:bg-blue-100" title="Seq2seq early decoding step">Seq2seq early</button>
                                    <button data-q46-preset="encdec-late" class="px-2 py-0.5 rounded border border-blue-300 bg-white hover:bg-blue-100" title="Seq2seq later decoding step">Seq2seq late</button>
                                    <button id="q46-copy" class="px-2 py-0.5 rounded border border-blue-400 bg-white hover:bg-blue-100 text-blue-700">Copy link</button>
                                    <button id="q46-export" class="px-2 py-0.5 rounded border border-blue-400 bg-white hover:bg-blue-100 text-blue-700">Export</button>
                                </div>
                                <div class="grid md:grid-cols-4 gap-3 text-xs">
                    <div>
                                                <label class="block text-xs font-semibold text-gray-700 mb-1">Model family</label>
                                                <select id="q46-arch" aria-label="Model family" class="w-full px-2 py-2 border border-gray-300 rounded" title="Architecture style determines attention and context flow">
                            <option value="encoder">Encoder‑only</option>
                            <option value="decoder" selected>Decoder‑only</option>
                            <option value="encdec">Encoder–decoder</option>
                        </select>
                    </div>
                    <div>
                                                <label class="block text-xs font-semibold text-gray-700 mb-1">Target step t</label>
                                                <input id="q46-step" aria-label="Target decoding step t" type="range" min="1" max="8" value="5" class="w-full" title="Decoding position (only meaningful for decoder / decoder half)" />
                                                <div class="text-xs text-gray-600">Autoregressive position</div>
                    </div>
                    <div>
                                                <label class="block text-xs font-semibold text-gray-700 mb-1">Input length</label>
                                                <select id="q46-len" aria-label="Input length" class="w-full px-2 py-2 border border-gray-300 rounded" title="Number of source / context tokens">
                            <option>4</option>
                            <option>6</option>
                            <option selected>8</option>
                            <option>10</option>
                            <option>12</option>
                        </select>
                                                <div class="text-xs text-gray-600">Tokens in source/context</div>
                    </div>
                    <div>
                                                <label class="block text-xs font-semibold text-gray-700 mb-1">Context coverage</label>
                                                <div id="q46-impact" class="text-xs" aria-live="polite">
                                                    <div id="q46-impact-badge" class="inline-block px-2 py-0.5 rounded border" title="Portion of full context visible at step t"></div>
                                                    <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                                        <div id="q46-meter" class="h-full rounded" style="width:0%"></div>
                                                    </div>
                                                    <div id="q46-coverage" class="mt-1 text-xs text-gray-600"></div>
                                                </div>
                    </div>
                </div>
            </div>
            
            <!-- Canvas -->
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                                <div id="q46-canvas" class="space-y-3"></div>
                                <div class="mt-3 text-xs text-gray-600 flex flex-wrap gap-3" aria-label="Legend">
                                    <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-200 border border-green-400"></span><span>Bi-dir self-attn</span></span>
                                    <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-purple-200 border border-purple-400"></span><span>Causal self-attn</span></span>
                                    <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-orange-200 border border-orange-400"></span><span>Cross-attn</span></span>
                                </div>
                        </div>
            
            <!-- Explanation -->
            <div id="q46-expl" class="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-900" aria-live="polite"></div>
            <div id="q46-guide" class="text-xs text-indigo-700 border-l-4 border-indigo-300 pl-3" aria-live="polite"></div>
        </div>`,
        script: () => {
            const archSel = document.getElementById('q46-arch');
            const stepEl = document.getElementById('q46-step');
            const lenEl = document.getElementById('q46-len');
            const canvas = document.getElementById('q46-canvas');
            const expl = document.getElementById('q46-expl');
            const guideEl = document.getElementById('q46-guide');
            const badgeEl = document.getElementById('q46-impact-badge');
            const meterEl = document.getElementById('q46-meter');
            const copyBtn = document.getElementById('q46-copy');
            const exportBtn = document.getElementById('q46-export');
            const presetButtons = Array.from(document.querySelectorAll('[data-q46-preset]'));
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
                // Coverage of source / context tokens available at step t
                let pct = 1;
                if (arch === 'decoder') pct = L > 0 ? (t - 1) / L : 0; // only left context
                else if (arch === 'encdec') pct = 1; // full encoder memory available
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
                const coverageLine = document.getElementById('q46-coverage');
                if (coverageLine) {
                    if (arch === 'decoder') {
                        coverageLine.textContent = `${Math.max(0,t-1)} / ${L} prior tokens visible at t=${t}`;
                    } else if (arch === 'encoder') {
                        coverageLine.textContent = `All ${L} tokens mutually visible (bidirectional)`;
                    } else { // encdec
                        coverageLine.textContent = `Full source (${L}) + ${Math.max(0,t-1)} generated history accessible`;
                    }
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
                    decoder: `The decoder enforces a <strong>causal mask</strong>: at step t it can attend only to tokens 1…t−1. This enables next‑token prediction \\( p(y_t \\mid y_{< t}) \\).`,
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
                                if (guideEl) guideEl.textContent = guidance(arch, t, L);
            }

                        function guidance(arch, t, L){
                            const parts = [];
                            if (arch==='encoder') {
                                parts.push('Encoder: full bidirectional context – ideal for representation (classify, retrieve, embed).');
                            } else if (arch==='decoder') {
                                parts.push('Decoder: causal left‑to‑right generation.');
                                parts.push(`Step t=${t}: uses ${Math.max(0,t-1)} / ${L} prior tokens.`);
                            } else if (arch==='encdec') {
                                parts.push('Encoder–decoder: global source memory + causal target stream.');
                                parts.push(`Step t=${t}: full source (${L}) + ${Math.max(0,t-1)} generated history.`);
                            }
                            if (L>6) parts.push('Longer inputs amplify encoder strength but slow decoder steps.');
                            return parts.join(' ');
                        }

                        function updateHash(){
                            const params = new URLSearchParams({arch:archSel.value, t:stepEl.value, L:lenEl.value});
                            const newHash = '#question-46?' + params.toString();
                            if (location.hash !== newHash) history.replaceState(null,'',newHash);
                        }

                        archSel.addEventListener('change', ()=>{ render(); updateHash(); });
                        stepEl.addEventListener('input', ()=>{ render(); updateHash(); });
                        lenEl.addEventListener('change', ()=>{ render(); updateHash(); });
                        lenEl.addEventListener('input', ()=>{ render(); updateHash(); });

                        // Presets
                        function applyPreset(name){
                            if(name==='enc-cls'){ archSel.value='encoder'; lenEl.value='8'; stepEl.value='1'; }
                            else if(name==='dec-early'){ archSel.value='decoder'; lenEl.value='10'; stepEl.value='2'; }
                            else if(name==='dec-late'){ archSel.value='decoder'; lenEl.value='12'; stepEl.value='10'; }
                            else if(name==='encdec-early'){ archSel.value='encdec'; lenEl.value='8'; stepEl.value='2'; }
                            else if(name==='encdec-late'){ archSel.value='encdec'; lenEl.value='10'; stepEl.value='8'; }
                            render();
                            updateHash();
                        }
                        presetButtons.forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.getAttribute('data-q46-preset'))));

                        // Permalink copy (#question-46?arch=..&t=..&L=..)
                        copyBtn?.addEventListener('click', ()=>{
                            const params = new URLSearchParams({arch:archSel.value, t:stepEl.value, L:lenEl.value});
                            const url = `${location.origin}${location.pathname}#question-46?${params.toString()}`;
                            navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
                        });

                        // Export JSON snapshot
                        exportBtn?.addEventListener('click', ()=>{
                            const arch = archSel.value; const L = parseInt(lenEl.value,10); const t = Math.min(L, parseInt(stepEl.value,10));
                            const visible = arch==='decoder' ? Math.max(0,t-1) : L;
                            const coverage = arch==='decoder' ? (t-1)/L : 1;
                            const payload = {
                                question: '46',
                                generated: new Date().toISOString(),
                                config: { arch, L, t },
                                metrics: { visibleTokens: visible, totalTokens: L, coverageRatio: coverage }
                            };
                            const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `q46-${arch}-t${t}-L${L}.json`;
                            document.body.appendChild(link); link.click();
                            setTimeout(()=>{ URL.revokeObjectURL(link.href); link.remove(); }, 100);
                        });

                        // Hash parse
                        (function initFromHash(){
                            if(!location.hash) return; const m = location.hash.match(/question-46\?(.*)$/); if(!m) return; const p = new URLSearchParams(m[1]);
                            if(p.get('arch')) archSel.value=p.get('arch');
                            if(p.get('t')) stepEl.value=p.get('t');
                            if(p.get('L')) lenEl.value=p.get('L');
                        })();
            render();
            updateHash();
        }
    }
};
if (typeof module !== 'undefined') { module.exports = question; }
