const interactiveScript = () => {
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question46Interactive = interactiveScript;
}
