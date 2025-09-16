const interactiveScript = () => {
            const modelEl = document.getElementById('q47-model');
            const nEl = document.getElementById('q47-n');
            const LEl = document.getElementById('q47-L');
            const smoothingEl = document.getElementById('q47-smoothing');
            const canvas = document.getElementById('q47-canvas');
            const expl = document.getElementById('q47-expl');
            const guideEl = document.getElementById('q47-guide');
            const changeEl = document.getElementById('q47-change');
            const badgeEl = document.getElementById('q47-impact-badge');
            const meterEl = document.getElementById('q47-meter');
            const prosEl = document.getElementById('q47-pros');
            const consEl = document.getElementById('q47-cons');
            const coverageEl = document.getElementById('q47-coverage');
            const copyBtn = document.getElementById('q47-copy');
            const exportBtn = document.getElementById('q47-export');
            const tourBtn = document.getElementById('q47-tour-btn');
            const presetBtns = Array.from(document.querySelectorAll('[data-q47-preset]'));
               const probEl = document.getElementById('q47-prob');
               const capA = document.getElementById('q47-capA');
               const capB = document.getElementById('q47-capB');
               const clearCmp = document.getElementById('q47-clearCmp');
               const compareSlotsEl = document.getElementById('q47-compare-slots');
               const compareDeltaEl = document.getElementById('q47-compare-delta');
            const trailEl = document.getElementById('q47-trail');
            const clearTrailBtn = document.getElementById('q47-clearTrail');
            const exportTrailBtn = document.getElementById('q47-exportTrail');
            const memEl = document.getElementById('q47-mem');
            const factorEl = document.getElementById('q47-factor');
            if (!modelEl || !nEl || !LEl || !canvas || !expl) return;

            // Previous state for change explanations
            const prev = { model: null, eff: null, pp: null, smoothing: null };
               const ppHistory = []; // for sparkline
               const compare = { A:null, B:null };
            const sessionTrail = [];
            function updateGoals(){} // noop after removal

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
                if (coverageEl) coverageEl.textContent = `Context window coverage: ${Math.round(pct*100)}%`;
            }

            function getProsCons(model, N, L, eff) {
                const base = {
                    ngram: {
                        pros: ['Simple & fast for small N','Interpretable counts','Low compute footprint'],
                        cons: ['Fixed window; no long-range links','Sparsity for high N','Weak semantic generalization']
                    },
                    hmm: {
                        pros: ['Structured hidden states','Dynamic programming inference','Good for tagging/segmentation'],
                        cons: ['Markov limits long dependencies','Needs features / labels','Less expressive than deep nets']
                    },
                    transformer: {
                        pros: ['Global self-attention','Transfer via pretraining','Multi-task via prompting'],
                        cons: ['High compute/memory','Possible hallucinations','Large data demand']
                    }
                };
                const result = { pros: [...base[model].pros], cons: [...base[model].cons] };
                if (model==='ngram') {
                    if (N >=5) result.cons.push('High-order sparsity; smoothing critical');
                    if (N <=2) result.cons.push('Very small N underfits local structure');
                }
                if (model==='transformer') {
                    const pct = eff / Math.max(1,L);
                    if (pct < 0.4) result.cons.push('Small effective window: raise context or N');
                }
                return result;
            }

            function guidance(model, N, L, eff){
                const pct = eff / Math.max(1,L);
                if (model==='ngram') return pct < 0.4 ? 'Low-order n-gram: fast but misses broader dependencies—raise N or switch model.' : 'Higher-order n-gram: better locality capture; watch sparsity beyond ~5.';
                if (model==='hmm') return 'HMM: structured tagging; good for sequence labeling but limited global context.';
                if (model==='transformer') return pct < 0.4 ? 'Transformer with truncated window: limited context; expand to leverage attention.' : 'Transformer: broad context utilization enabling semantic generalization.';
                return '';
            }

            function render() {
                const model = modelEl.value;
                const N = Math.max(1, Math.min(10, parseInt(nEl.value||'3',10)));
                const L = Math.max(4, Math.min(64, parseInt(LEl.value||'16',10)));
                const smoothing = smoothingEl ? smoothingEl.value : 'none'; // main smoothing selection
                canvas.innerHTML = '';

                // Memory slider enable/disable & readout
                if (memEl){
                    if (model !== 'transformer') {
                        memEl.disabled = true;
                        document.getElementById('q47-mem-label').textContent='(transformer only)';
                        document.getElementById('q47-mem-readout').textContent='';
                    } else {
                        memEl.disabled = false;
                        const capVal = parseInt(memEl.value,10);
                        document.getElementById('q47-mem-label').textContent=`(cap ${capVal})`;
                        document.getElementById('q47-mem-readout').textContent=`Using up to ${capVal} tokens`;
                    }
                }

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
                    // Transformer: theoretical window (origWin) can attend to all previous (clipped by N & L), but memory cap may truncate further
                    const cap = memEl ? parseInt(memEl.value,10) : 64;
                    const origWin = Math.min(N, L); // model configuration window
                    const win = Math.min(origWin, cap); // enforced window after memory cap
                    for (let i=Math.max(1, L-(win)); i<=L; i++) ctx.push(token(String(i), true));
                    // Store for later perplexity adjustment & annotation
                    render._memInfo = { cap, origWin, win };
                }
                // Apply fading: non-context tokens faded globally
                const contextIndices = new Set(ctx.map(el => el.textContent));
                const sequenceRow = canvas.querySelector(':scope > div:nth-child(1)');
                if (sequenceRow) {
                    const tokens = sequenceRow.querySelectorAll('span');
                    let clipStart = null;
                    if (model==='transformer' && render._memInfo){
                        const { win } = render._memInfo;
                        clipStart = L - win + 1; // first included token
                    }
                    tokens.forEach(t => {
                        const idx = parseInt(t.textContent,10);
                        const inCtx = contextIndices.has(String(idx));
                        if (!inCtx) {
                            t.style.opacity = '0.18';
                            if (model==='transformer' && clipStart && idx < clipStart) {
                                // visually mark clipped region (before cap window)
                                t.style.background = 'repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9 4px,#e2e8f0 4px,#e2e8f0 8px)';
                                t.style.border = '1px dashed #cbd5e1';
                            }
                        } else {
                            const distance = L - idx; // 0 is most recent
                            const maxDist = L - Math.max(1, L-(ctx.length));
                            const rel = maxDist ? distance / maxDist : 0;
                            t.style.opacity = String(1 - 0.4*rel);
                            if (model==='transformer' && clipStart && idx === clipStart) {
                                // boundary marker
                                t.style.outline = '2px solid #6366f1';
                                t.title = (t.title? t.title+'\n':'') + 'Memory cap boundary';
                            }
                        }
                    });
                }
                canvas.appendChild(row('Context used for next token', ctx));

                   // Transformer attention heatmap mock (sample last 8 tokens)
                   if (model==='transformer') {
                       const heatWrap = document.createElement('div');
                       heatWrap.className='text-xs';
                       const header = document.createElement('div');
                       header.className='font-medium text-indigo-700 mt-2 mb-1';
                       header.textContent='Mock attention weights (last 8 tokens)';
                       const size = Math.min(8, L);
                       const table = document.createElement('div');
                       table.className='grid';
                       table.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
                       // generate pattern
                       for (let q= L - size +1; q<=L; q++) {
                           for (let k= L - size +1; k<=L; k++) {
                               const cell = document.createElement('div');
                               let weight;
                               if (N < size/2) {
                                   // more local band
                                   const dist = Math.abs(q-k);
                                   weight = Math.max(0, 1 - dist / (N+1));
                               } else {
                                   // broader distribution
                                   const dist = Math.abs(q-k);
                                   weight = 0.6 + 0.4*(1 - dist/size);
                               }
                               const hue = 220; // blue-ish
                               const light = 90 - weight*50; // darker for higher weight
                               cell.style.background=`hsl(${hue} 100% ${light}%)`;
                               cell.style.height='14px';
                               cell.title = `q${q}→k${k}: ${weight.toFixed(2)}`;
                               table.appendChild(cell);
                           }
                       }
                       heatWrap.appendChild(header);
                       heatWrap.appendChild(table);
                    // Accessibility summary
                    heatWrap.setAttribute('role','img');
                    heatWrap.setAttribute('aria-label', 'Mock attention heatmap for last tokens: darker cells imply higher weight.');
                       canvas.appendChild(heatWrap);
                   }

                // Toy perplexity trend (illustrative)
                let basePP; // base perplexity heuristic
                if (model === 'transformer') basePP = 20;
                else if (model === 'hmm') basePP = 80;
                else { // ngram with smoothing effects (illustrative)
                    if (smoothing === 'none') basePP = N >=5 ? 150 : 130;
                    else if (smoothing === 'addk') basePP = N >=5 ? 120 : 110;
                    else basePP = N >=5 ? 105 : 100; // kneser
                }
                const eff = ctx.length; // effective context size after any caps
                const factor = factorEl ? parseFloat(factorEl.value) : 1;
                // If transformer and memory cap reduced original window, inflate difficulty slightly
                let memPenalty = 0;
                if (model==='transformer' && render._memInfo) {
                    const { origWin, win } = render._memInfo;
                    if (win < origWin) {
                        const reduction = 1 - (win / Math.max(1, origWin)); // 0..1
                        // Scale penalty: up to +10 added to basePP when window severely truncated
                        memPenalty = Math.round(reduction * 10);
                    }
                }
                const adjEff = Math.round(eff * factor);
                const seqEff = Math.round(L * factor);
                const pp = Math.max(10, Math.round((basePP + memPenalty) / Math.log2(2+adjEff)) + Math.max(0, factor-1)*4);
                const ppEl = document.createElement('div');
                ppEl.className = 'text-sm text-gray-700 mt-2';
                let extraNote = '';
                if (model==='transformer' && render._memInfo){
                    const { origWin, win, cap } = render._memInfo;
                    if (win < origWin) extraNote = ` – window truncated by cap ${cap} (orig ${origWin})`;
                    else extraNote = ` – full window (=${origWin}) utilized`;
                }
                ppEl.innerHTML = `<span class=\"font-medium\">Estimated perplexity (toy):</span> ${pp} <span class=\"text-xs text-gray-500\">(factor ${factor} cost≈${seqEff}${extraNote})</span>`;
                canvas.appendChild(ppEl);

                   // Sparkline history
                   ppHistory.push(pp);
                   while (ppHistory.length > 30) ppHistory.shift();
                   const spark = document.createElement('div');
                   spark.className='mt-1';
                   const w=120, h=28; const maxPP = Math.max(...ppHistory); const minPP = Math.min(...ppHistory);
                   const range = Math.max(1, maxPP - minPP);
                   const points = ppHistory.map((v,i)=>{
                       const x = (i/(ppHistory.length-1||1))*w;
                       const y = h - ((v - minPP)/range)*h;
                       return `${x.toFixed(1)},${y.toFixed(1)}`;
                   }).join(' ');
                   spark.innerHTML = `<svg width="${w}" height="${h}" class="overflow-visible"><polyline points="${points}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" /><circle cx="${w}" cy="${h - ((ppHistory[ppHistory.length-1]-minPP)/range)*h}" r="3" fill="#6366f1" /></svg>`;
                   ppEl.appendChild(spark);
                spark.setAttribute('role','img');
                spark.setAttribute('aria-label', `Perplexity history with ${ppHistory.length} points; current ${pp}; range ${minPP}-${maxPP}`);

                // Impact and guidance
                const ratio = eff / Math.max(1, L);
                setImpact(ratio);
                if (prosEl && consEl) {
                    prosEl.innerHTML = '';
                    consEl.innerHTML = '';
                    const pc = getProsCons(model, N, L, eff);
                    pc.pros.forEach(txt => { const li = document.createElement('li'); li.textContent = txt; prosEl.appendChild(li); });
                    pc.cons.forEach(txt => { const li = document.createElement('li'); li.textContent = txt; consEl.appendChild(li); });
                }

                // Explanation
                const messages = {
                    ngram: `N-grams estimate \\( p(w_t \\mid w_{t-1},...,w_{t-N+1}) \\) via counts + smoothing (e.g. Kneser–Ney). Expressive power capped by N and data coverage. <span class=\"text-xs text-gray-600\">Smoothing: ${smoothing}</span>`,
                    hmm: `HMMs introduce latent states with first-order transitions. Effective for POS tagging / segmentation but long-range semantics remain inaccessible.`,
                    transformer: `Transformers learn deep contextual token embeddings; self-attention links distant positions enabling semantic generalization + transfer across tasks.`
                };
                const title = model==='ngram' ? 'N-gram' : model==='hmm' ? 'HMM' : 'Transformer/LLM';
                expl.innerHTML = `
                    <div class=\"flex items-center gap-2 mb-2\"><span class=\"text-indigo-700\">${title}</span> <span class=\"text-xs text-gray-500\">(N/context=${N}, L=${L})</span></div>
                    ${messages[model]}
                `;
                if (guideEl) guideEl.textContent = guidance(model, N, L, eff);

                // Change explanation sentence
                if (changeEl) {
                    let parts = [];
                    if (prev.model && prev.model !== model) parts.push(`Model changed ${prev.model}→${model}`);
                    if (prev.eff != null && prev.eff !== eff) parts.push(`${eff>prev.eff? 'Increased':'Reduced'} effective context (${prev.eff||0}→${eff})`);
                    if (model==='ngram' && (prev.smoothing && prev.smoothing !== smoothing)) parts.push(`Smoothing '${smoothing}'`);
                    if (prev.pp != null && prev.pp !== pp) parts.push(`Perplexity ${prev.pp}→${pp}`);
                    if (prev.factor && prev.factor !== factor) parts.push(`Factor ${prev.factor}→${factor}`);
                    if (model==='transformer') {
                        const capNow = memEl?memEl.value:undefined;
                        if (capNow) {
                            if (render._memInfo){
                                const { origWin, win } = render._memInfo;
                                const trunc = win < origWin ? ` (truncated to ${win})` : ' (full)';
                                parts.push(`Mem cap ${capNow}${trunc}`);
                            } else parts.push(`Mem cap ${capNow}`);
                        }
                    }
                    if (!parts.length) parts.push('Adjust sliders or presets to explore effects.');
                    changeEl.textContent = parts.join('; ') + '.';
                    prev.model = model; prev.eff = eff; prev.pp = pp; prev.smoothing = smoothing; prev.factor = factor; prev.mem = memEl?memEl.value:undefined;
                }

                // Session trail logging
                const smoothingUsed = smoothingEl ? (model==='ngram'? smoothingEl.value: undefined) : undefined;
                const last = sessionTrail[sessionTrail.length-1];
                const effLog = ctx.length; // reuse effective context size
                let basePPTrail;
                if (model === 'transformer') basePPTrail = 20; else if (model==='hmm') basePPTrail = 80; else {
                    if ((smoothingUsed||'none') === 'none') basePPTrail = N >=5 ? 150 : 130;
                    else if (smoothingUsed === 'addk') basePPTrail = N >=5 ? 120 : 110;
                    else basePPTrail = N >=5 ? 105 : 100;
                }
                const factorTrail = factorEl ? parseFloat(factorEl.value) : 1;
                const memCapTrail = memEl ? parseInt(memEl.value,10) : 64;
                const ppSnapshot = Math.max(10, Math.round(basePPTrail / Math.log2(2+effLog*factorTrail)) + Math.max(0, factorTrail-1)*4);
                const snapshot = { t: Date.now(), model, N, L, smoothing: smoothingUsed, eff: effLog, ratio: effLog/Math.max(1,L), factor: factorTrail, memCap: memCapTrail, pp: ppSnapshot };
                const changed = !last || ['model','N','L','smoothing','eff','pp','factor','memCap'].some(k => last[k] !== snapshot[k]);
                if (changed) {
                    sessionTrail.push(snapshot);
                    if (trailEl) {
                        const li = document.createElement('li');
                        const dt = new Date(snapshot.t).toLocaleTimeString();
                        li.textContent = `${dt} – ${model} N=${N} L=${L}${smoothing? ' sm='+smoothing:''} f=${factorTrail} mem=${memCapTrail} eff=${effLog} pp=${ppSnapshot}`;
                        trailEl.appendChild(li);
                        if (trailEl.children.length > 150) trailEl.removeChild(trailEl.firstChild);
                    }
                    // exploration goal removed
                }

                   // Probability walkthrough
                   if (probEl){
                       if (model==='ngram') {
                           const ctxTokens = ctx.map(t=>`w_{${t.textContent}}`).join(',');
                           const inside = ctxTokens || '\\varnothing';
                           probEl.innerHTML = `Next-token estimate approximates chain rule using last N−1 tokens: \\(${`p(w_{t} \\mid ${inside})`}\\). Smoothing=${smoothing}.`;
                       } else if (model==='hmm') {
                           probEl.innerHTML = `Predict via latent state transition + emission: \\(${`p(w_t)=\\sum_s p(s_t\\mid s_{t-1}) p(w_t\\mid s_t)`}\\). Context limited by first-order Markov property.`;
                       } else {
                           probEl.innerHTML = `Self-attention forms context vector: \\(${`z_t = \\sum_j \\alpha_{t,j} V_j`}\\). Wider N allows more tokens to contribute.`;
                       }
                       if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([probEl]).catch(()=>{});
                   }

                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }
            }

            function updateHash(){
                const params = new URLSearchParams({ model: modelEl.value, N: nEl.value, L: LEl.value });
                if (modelEl.value==='ngram' && smoothingEl) params.set('S', smoothingEl.value);
                if (memEl) params.set('M', memEl.value);
                if (factorEl) params.set('F', factorEl.value);
                const newHash = '#question-47?' + params.toString();
                if (location.hash !== newHash) history.replaceState(null,'',newHash);
            }

            // Initial typeset of static math (in case details is already open by default)
            const mathPane = document.getElementById('q47-math');
            if (mathPane?.open && window.MathJax?.typesetPromise) {
                window.MathJax.typesetPromise([mathPane]).catch(()=>{});
            }

            function applyPreset(name){
                if (name==='ngram-small'){ modelEl.value='ngram'; nEl.value='2'; LEl.value='16'; if (smoothingEl) smoothingEl.value='none'; }
                else if (name==='ngram-high'){ modelEl.value='ngram'; nEl.value='5'; LEl.value='32'; if (smoothingEl) smoothingEl.value='kneser'; }
                else if (name==='hmm'){ modelEl.value='hmm'; nEl.value='2'; LEl.value='16'; }
                else if (name==='tx-short'){ modelEl.value='transformer'; nEl.value='6'; LEl.value='16'; }
                else if (name==='tx-long'){ modelEl.value='transformer'; nEl.value='12'; LEl.value='32'; }
                render(); updateHash();
            }
            presetBtns.forEach(b=>b.addEventListener('click', ()=>applyPreset(b.getAttribute('data-q47-preset'))));

            copyBtn?.addEventListener('click', ()=>{
                const params = new URLSearchParams({ model:modelEl.value, N:nEl.value, L:LEl.value });
                const url = `${location.origin}${location.pathname}#question-47?${params.toString()}`;
                navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
            });

            exportBtn?.addEventListener('click', ()=>{
                const model = modelEl.value; const N = parseInt(nEl.value,10); const L = parseInt(LEl.value,10);
                const eff = model==='hmm' ? 2 : Math.min(N, L);
                const ratio = eff/Math.max(1,L);
                let basePP;
                const smoothing = smoothingEl ? smoothingEl.value : 'none';
                if (model === 'transformer') basePP = 20; else if (model==='hmm') basePP = 80; else {
                    if (smoothing === 'none') basePP = N >=5 ? 150 : 130;
                    else if (smoothing === 'addk') basePP = N >=5 ? 120 : 110;
                    else basePP = N >=5 ? 105 : 100;
                }
                const pp = Math.max(10, Math.round(basePP / Math.log2(2+eff)));
                const payload = { question:'47', generated:new Date().toISOString(), config:{ model, N, L, smoothing: model==='ngram'? smoothing: undefined }, metrics:{ effectiveContext: eff, effectiveRatio: ratio, toyPerplexity: pp }, sessionTrail };
                const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `q47-${model}-N${N}-L${L}.json`;
                a.click();
                setTimeout(()=>URL.revokeObjectURL(a.href), 50);
            });

            function initFromHash(){
                if(!location.hash) return; const m = location.hash.match(/question-47\?(.*)$/); if(!m) return; const p = new URLSearchParams(m[1]);
                if(p.get('model')) modelEl.value=p.get('model');
                if(p.get('N')) nEl.value=p.get('N');
                if(p.get('L')) LEl.value=p.get('L');
                if(p.get('S') && smoothingEl) smoothingEl.value=p.get('S');
                if(p.get('M') && memEl) memEl.value=p.get('M');
                if(p.get('F') && factorEl) factorEl.value=p.get('F');
            }

            // Guided tour implementation
            function startTour(){
                if (document.getElementById('q47-tour')) return;
                const steps = [
                    { title:'1. Pick a model', body:'Switch between N-gram, HMM, and Transformer to change how context is gathered.'},
                    { title:'2. Adjust context / N', body:'Slide N or length; highlighted tokens (brighter = more recent) show the effective window.'},
                    { title:'3. Observe fading', body:'Faded tokens are outside the current model\'s usable context.'},
                    { title:'4. Perplexity heuristic', body:'Toy perplexity drops as effective context and model expressivity increase.'},
                    { title:'5. Smoothing & presets', body:'For N-grams, try smoothing to mitigate sparsity; presets jump to illustrative points.'}
                ];
                let idx = 0;
                const overlay = document.createElement('div');
                overlay.id='q47-tour';
                overlay.setAttribute('role','dialog');
                overlay.setAttribute('aria-modal','true');
                overlay.className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-sm';
                const box=document.createElement('div');
                box.className='bg-white rounded-lg shadow-lg max-w-sm w-[380px] p-4 space-y-3';
                overlay.appendChild(box);
                const titleEl=document.createElement('div');
                titleEl.className='font-semibold text-indigo-700';
                const bodyEl=document.createElement('div');
                bodyEl.className='text-gray-700';
                const ctr=document.createElement('div');
                ctr.className='flex justify-between items-center pt-2';
                const back=document.createElement('button'); back.className='px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-40'; back.textContent='Back';
                const next=document.createElement('button'); next.className='px-3 py-1 rounded bg-indigo-600 text-white'; next.textContent='Next';
                const skip=document.createElement('button'); skip.className='px-2 py-1 rounded bg-red-50 text-red-600'; skip.textContent='Skip';
                ctr.appendChild(back); ctr.appendChild(skip); ctr.appendChild(next);
                box.appendChild(titleEl); box.appendChild(bodyEl); box.appendChild(ctr);
                function renderStep(){
                    const s = steps[idx]; titleEl.textContent=s.title; bodyEl.textContent=s.body; back.disabled = idx===0; next.textContent = idx===steps.length-1? 'Done':'Next';
                }
                back.addEventListener('click', ()=>{ if(idx>0){idx--; renderStep(); }});
                next.addEventListener('click', ()=>{ if(idx<steps.length-1){idx++; renderStep(); } else { overlay.remove(); }});
                skip.addEventListener('click', ()=>overlay.remove());
                document.body.appendChild(overlay); renderStep();
            }
            tourBtn?.addEventListener('click', startTour);

               // Compare slot rendering
               function renderCompare(){
                   if(!compareSlotsEl) return; compareSlotsEl.innerHTML='';
                   ['A','B'].forEach(slot=>{
                       const data = compare[slot];
                       const card = document.createElement('div');
                       card.className='border rounded p-2 bg-gray-50';
                       if (!data) {
                           card.innerHTML = `<div class=\"text-gray-400 italic\">Slot ${slot} empty</div>`;
                       } else {
                           card.innerHTML = `<div class=\"font-semibold text-indigo-700 mb-1\">${slot}: ${data.model}</div>
                           <div class=\"text-xs text-gray-600\">N=${data.N}, L=${data.L}${data.smoothing? ', sm='+data.smoothing:''}</div>
                           <div class=\"mt-1 text-xs\">Eff ctx: <b>${data.eff}</b> (${Math.round(data.ratio*100)}%)</div>
                           <div class=\"text-xs\">Perplexity: <b>${data.pp}</b></div>`;
                       }
                       compareSlotsEl.appendChild(card);
                   });
                   if (compare.A && compare.B && compareDeltaEl){
                       const dEff = compare.B.eff - compare.A.eff;
                       const dPP = compare.B.pp - compare.A.pp;
                       compareDeltaEl.textContent = `Δ(B−A): eff ${dEff>0?'+':''}${dEff}, perplexity ${dPP>0?'+':''}${dPP}`;
                   } else if (compareDeltaEl) compareDeltaEl.textContent='';
               }
               capA?.addEventListener('click', ()=>{
                   const model = modelEl.value; const N=parseInt(nEl.value,10); const L=parseInt(LEl.value,10); const eff = model==='hmm'?2: Math.min(N,L); const ratio= eff/Math.max(1,L); const smoothing = smoothingEl?.value; let basePP; if (model==='transformer') basePP=20; else if (model==='hmm') basePP=80; else { if (smoothing==='none') basePP = N>=5?150:130; else if (smoothing==='addk') basePP=N>=5?120:110; else basePP=N>=5?105:100; } const pp = Math.max(10, Math.round(basePP/ Math.log2(2+eff))); compare.A={model,N,L,eff,ratio,pp,smoothing:(model==='ngram'?smoothing:undefined)}; renderCompare(); });
               capB?.addEventListener('click', ()=>{
                   const model = modelEl.value; const N=parseInt(nEl.value,10); const L=parseInt(LEl.value,10); const eff = model==='hmm'?2: Math.min(N,L); const ratio= eff/Math.max(1,L); const smoothing = smoothingEl?.value; let basePP; if (model==='transformer') basePP=20; else if (model==='hmm') basePP=80; else { if (smoothing==='none') basePP = N>=5?150:130; else if (smoothing==='addk') basePP=N>=5?120:110; else basePP=N>=5?105:100; } const pp = Math.max(10, Math.round(basePP/ Math.log2(2+eff))); compare.B={model,N,L,eff,ratio,pp,smoothing:(model==='ngram'?smoothing:undefined)}; renderCompare(); });
            clearCmp?.addEventListener('click', ()=>{ compare.A=null; compare.B=null; renderCompare(); });
            // Goal trigger for compare when both filled happens on second capture
            // learning goals removed

            // Quiz logic
            // quiz removed

            // Trail controls
            clearTrailBtn?.addEventListener('click', ()=>{ sessionTrail.length = 0; if (trailEl) trailEl.innerHTML=''; });
            exportTrailBtn?.addEventListener('click', ()=>{
                const blob = new Blob([JSON.stringify({ question:'47-trail', generated:new Date().toISOString(), trail: sessionTrail }, null, 2)], {type:'application/json'});
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'q47-session-trail.json';
                a.click();
                setTimeout(()=>URL.revokeObjectURL(a.href), 50);
            });

            // MathJax typeset when math details opened
            document.getElementById('q47-math')?.addEventListener('toggle', (e)=>{
                if (e.target.open){
                    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([e.target]).catch(()=>{});
            // goal tracking removed
                }
            });
        // confidence removed

            modelEl.addEventListener('change', ()=>{ render(); updateHash(); });
            nEl.addEventListener('input', ()=>{ render(); updateHash(); });
            LEl.addEventListener('change', ()=>{ render(); updateHash(); });
            smoothingEl?.addEventListener('change', ()=>{ if (modelEl.value==='ngram') { render(); updateHash(); } });
            memEl?.addEventListener('input', ()=>{ if (modelEl.value==='transformer') { render(); updateHash(); } });
            factorEl?.addEventListener('change', ()=>{ render(); updateHash(); });

            initFromHash();
            render();
            updateHash();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question47Interactive = interactiveScript;
}
