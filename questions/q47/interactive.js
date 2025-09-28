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
            const memEl = document.getElementById('q47-mem');
            const factorEl = document.getElementById('q47-factor');
            const memLabelEl = document.getElementById('q47-mem-label');
            const memReadoutEl = document.getElementById('q47-mem-readout');
            if (!modelEl || !nEl || !LEl || !canvas || !expl) return;

            // Previous state for change explanations
            const prev = { model: null, eff: null, pp: null, smoothing: null };
               const ppHistory = []; // for sparkline
               const compare = { A:null, B:null };
            const sessionTrail = [];
            function updateGoals(){} // noop after removal

            function token(label, active=false) {
                const t = document.createElement('span');
                t.className = 'q47-token';
                if (active) t.classList.add('q47-token--context');
                t.textContent = label;
                return t;
            }
            function row(title, children) {
                const wrap = document.createElement('div');
                wrap.className = 'q47-row';
                const label = document.createElement('div');
                label.className = 'q47-row-label';
                label.textContent = title;
                const content = document.createElement('div');
                content.className = 'q47-row-content';
                children.forEach(c => content.appendChild(c));
                wrap.appendChild(label);
                wrap.appendChild(content);
                return wrap;
            }

            function setImpact(pct, effTokens, totalTokens) {
                pct = Math.max(0, Math.min(1, pct));
                let label = '';
                let level = 'poor';
                if (pct >= 0.95) { label = `Excellent (${Math.round(pct*100)}%)`; level = 'excellent'; }
                else if (pct >= 0.6) { label = `Good (${Math.round(pct*100)}%)`; level = 'good'; }
                else if (pct >= 0.3) { label = `Limited (${Math.round(pct*100)}%)`; level = 'limited'; }
                else { label = `Poor (${Math.round(pct*100)}%)`; level = 'poor'; }
                if (badgeEl) {
                    badgeEl.dataset.level = level;
                    badgeEl.textContent = label;
                }
                if (meterEl) {
                    const pctVal = Math.round(pct*100);
                    meterEl.dataset.level = level;
                    meterEl.style.width = `${pctVal}%`;
                    meterEl.setAttribute('aria-valuenow', String(pctVal));
                    meterEl.parentElement?.setAttribute('data-level', level);
                }
                if (coverageEl) {
                    if (typeof effTokens === 'number' && typeof totalTokens === 'number' && totalTokens > 0) {
                        coverageEl.textContent = `Context window coverage: ${Math.round(pct*100)}% (${effTokens}/${totalTokens})`;
                    } else {
                        coverageEl.textContent = `Context window coverage: ${Math.round(pct*100)}%`;
                    }
                }
            }

            const getRootStyle = (() => {
                let cache = null;
                return () => {
                    if (!cache) cache = getComputedStyle(document.documentElement);
                    return cache;
                };
            })();
            const themeToken = (token, fallback) => {
                const value = getRootStyle().getPropertyValue(token);
                return value && value.trim() ? value.trim() : fallback;
            };
            const heatStops = [
                { stop: 0, color: [34, 197, 94] },
                { stop: 0.6, color: [250, 204, 21] },
                { stop: 1, color: [239, 68, 68] }
            ];
            function heatColor(weight) {
                const clamped = Math.max(0, Math.min(1, weight));
                let lower = heatStops[0];
                let upper = heatStops[heatStops.length - 1];
                for (let i = 1; i < heatStops.length; i++) {
                    if (clamped <= heatStops[i].stop) {
                        upper = heatStops[i];
                        lower = heatStops[i - 1];
                        break;
                    }
                }
                const span = upper.stop - lower.stop || 1;
                const ratio = (clamped - lower.stop) / span;
                const mix = lower.color.map((c, idx) => Math.round(c + (upper.color[idx] - c) * ratio));
                const alpha = 0.35 + clamped * 0.55;
                return `rgba(${mix[0]}, ${mix[1]}, ${mix[2]}, ${alpha.toFixed(2)})`;
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
                const rawN = parseInt((nEl?.value ?? '').trim(), 10);
                const rawL = parseInt((LEl?.value ?? '').trim(), 10);
                const N = Number.isNaN(rawN) ? 3 : Math.max(1, Math.min(10, rawN));
                const L = Number.isNaN(rawL) ? 16 : Math.max(4, Math.min(64, rawL));
                const smoothing = smoothingEl ? smoothingEl.value : 'none'; // main smoothing selection
                canvas.innerHTML = '';

                // Memory slider enable/disable & readout
                render._memInfo = null;
                let memInfo = null;
                if (memEl){
                    if (model !== 'transformer') {
                        memEl.disabled = true;
                        if (memLabelEl) memLabelEl.textContent = '(transformer only)';
                        if (memReadoutEl) memReadoutEl.textContent = '';
                    } else {
                        memEl.disabled = false;
                        const rawCap = parseInt(memEl.value,10);
                        const origWin = Math.min(N, L);
                        const cap = Math.max(1, Math.min(L, Number.isNaN(rawCap) ? origWin : rawCap));
                        const win = Math.min(origWin, cap);
                        memInfo = { cap, origWin, win };
                        if (memLabelEl) memLabelEl.textContent = `(cap ${cap})`;
                        if (memReadoutEl) {
                            const truncated = win < origWin;
                            memReadoutEl.textContent = truncated
                                ? `Truncated to ${win}/${origWin} tokens by cap ${cap}.`
                                : `Full window (${win} tokens) within cap ${cap}.`;
                        }
                    }
                }
                render._memInfo = memInfo;

                // Sequence
                const seq = [];
                for (let i=1;i<=L;i++) seq.push(token(String(i)));
                canvas.appendChild(row('Sequence', seq));

                // Visible context for next token
                const ctx = [];
                if (model === 'ngram') {
                    for (let i = Math.max(1, L - (N - 1)); i <= L; i++) ctx.push(token(String(i), true));
                } else if (model === 'hmm') {
                    for (let i = Math.max(1, L - 1); i <= L; i++) ctx.push(token(String(i), true));
                } else {
                    const win = memInfo ? memInfo.win : Math.min(N, L);
                    const start = Math.max(1, L - win + 1);
                    for (let i = start; i <= L; i++) ctx.push(token(String(i), true));
                }
                const ctxStart = ctx.length ? Math.max(1, L - ctx.length + 1) : L;
                const ctxMaxDist = Math.max(0, L - ctxStart);
                ctx.forEach(el => {
                    if (!el) return;
                    if (ctxMaxDist > 0) {
                        const idx = parseInt(el.textContent, 10);
                        const rel = Math.min(1, Math.max(0, (L - idx) / ctxMaxDist));
                        el.style.setProperty('--q47-token-active-opacity', (1 - 0.4 * rel).toFixed(2));
                    } else {
                        el.style.setProperty('--q47-token-active-opacity', '1');
                    }
                });

                const contextIndices = new Set(ctx.map(el => el.textContent));
                const sequenceRow = canvas.querySelector(':scope > div:nth-child(1)');
                if (sequenceRow) {
                    const tokens = sequenceRow.querySelectorAll('.q47-token');
                    const clipStart = model === 'transformer' && memInfo ? Math.max(1, L - memInfo.win + 1) : null;
                    tokens.forEach(t => {
                        const idx = parseInt(t.textContent, 10);
                        const inCtx = contextIndices.has(String(idx));
                        const isClipped = Boolean(model === 'transformer' && clipStart && idx < clipStart);
                        const isBoundary = Boolean(model === 'transformer' && clipStart && idx === clipStart);
                        t.classList.toggle('q47-token--context', inCtx);
                        t.classList.toggle('q47-token--faded', !inCtx);
                        t.classList.toggle('q47-token--clipped', isClipped);
                        t.classList.toggle('q47-token--boundary', isBoundary);
                        if (inCtx) {
                            const rel = ctxMaxDist > 0 ? Math.min(1, Math.max(0, (L - idx) / ctxMaxDist)) : 0;
                            t.style.setProperty('--q47-token-active-opacity', (1 - 0.4 * rel).toFixed(2));
                        } else {
                            t.style.removeProperty('--q47-token-active-opacity');
                        }
                        if (isBoundary) {
                            t.title = (t.title ? `${t.title}\n` : '') + 'Memory cap boundary';
                        } else if (t.title && t.title.includes('Memory cap boundary')) {
                            const sanitized = t.title.replace(/\n?Memory cap boundary/, '').trim();
                            if (sanitized) t.title = sanitized; else t.removeAttribute('title');
                        }
                    });
                }
                canvas.appendChild(row('Context used for next token', ctx));

                const heatWrap = document.createElement('div');
                heatWrap.className = 'q47-heatmap-wrapper';
                const header = document.createElement('div');
                header.className = 'q47-heatmap-title';
                header.textContent = 'Mock attention weights (last 8 tokens)';
                heatWrap.appendChild(header);
                if (model === 'transformer') {
                    heatWrap.setAttribute('role', 'img');
                    heatWrap.setAttribute('aria-label', 'Mock attention heatmap for last tokens; warmer cells imply higher weight.');
                    const sample = Math.max(1, Math.min(8, L));
                    const sampleStart = Math.max(1, L - sample + 1);
                    const table = document.createElement('div');
                    table.className = 'q47-heatmap-grid';
                    table.style.gridTemplateColumns = `repeat(${sample}, minmax(0, 1fr))`;
                    table.style.gridTemplateRows = `repeat(${sample}, 20px)`;
                    for (let q = sampleStart; q <= L; q++) {
                        for (let k = sampleStart; k <= L; k++) {
                            const cell = document.createElement('div');
                            cell.className = 'q47-heatmap-cell';
                            const dist = Math.abs(q - k);
                            let weight;
                            if (N < sample / 2) {
                                weight = Math.max(0, 1 - dist / (Math.max(1, N) + 1));
                            } else {
                                weight = 0.55 + 0.45 * (1 - dist / Math.max(sample, 1));
                            }
                            const bg = heatColor(weight);
                            cell.style.background = bg;
                            cell.style.boxShadow = 'inset 0 0 0 1px color-mix(in srgb, var(--color-card) 70%, transparent 30%)';
                            cell.title = `q${q}→k${k}: ${weight.toFixed(2)}`;
                            table.appendChild(cell);
                        }
                    }
                    heatWrap.appendChild(table);
                } else {
                    heatWrap.setAttribute('role', 'region');
                    heatWrap.setAttribute('aria-label', 'Attention heatmap not available for this model type.');
                    const placeholder = document.createElement('div');
                    placeholder.className = 'q47-heatmap-placeholder';
                    placeholder.textContent = 'Attention heatmap applies to transformer self-attention. Switch to the transformer model to inspect weights.';
                    heatWrap.appendChild(placeholder);
                }
                canvas.appendChild(heatWrap);

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
                if (model==='transformer' && memInfo) {
                    const { origWin, win } = memInfo;
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
                ppEl.className = 'text-sm text-heading mt-2';
                let extraNote = '';
                if (model==='transformer' && memInfo){
                    const { origWin, win, cap } = memInfo;
                    if (win < origWin) extraNote = ` – window truncated to ${win}/${origWin} by cap ${cap}`;
                    else extraNote = ` – full window (=${origWin}) within cap ${cap}`;
                }
                ppEl.innerHTML = `<span class=\"font-medium\">Estimated perplexity (toy):</span> ${pp} <span class=\"text-xs text-muted\">(factor ${factor} cost≈${seqEff}${extraNote})</span>`;
                canvas.appendChild(ppEl);

                   // Sparkline history
                   ppHistory.push(pp);
                   while (ppHistory.length > 30) ppHistory.shift();
                   const spark = document.createElement('div');
                   spark.className='mt-1 q47-sparkline';
                   const w=120, h=28; const maxPP = Math.max(...ppHistory); const minPP = Math.min(...ppHistory);
                   const range = Math.max(1, maxPP - minPP);
                   const points = ppHistory.map((v,i)=>{
                       const x = (i/(ppHistory.length-1||1))*w;
                       const y = h - ((v - minPP)/range)*h;
                       return `${x.toFixed(1)},${y.toFixed(1)}`;
                   }).join(' ');
                   const accent = themeToken('--color-path-foundations-strong', '#6366f1');
                   spark.innerHTML = `<svg width="${w}" height="${h}" class="overflow-visible"><polyline points="${points}" fill="none" stroke="${accent}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" /><circle cx="${w}" cy="${h - ((ppHistory[ppHistory.length-1]-minPP)/range)*h}" r="3" fill="${accent}" /></svg>`;
                   ppEl.appendChild(spark);
                spark.setAttribute('role','img');
                spark.setAttribute('aria-label', `Perplexity history with ${ppHistory.length} points; current ${pp}; range ${minPP}-${maxPP}`);

                // Impact and guidance
                const ratio = eff / Math.max(1, L);
                setImpact(ratio, eff, L);
                if (prosEl && consEl) {
                    prosEl.innerHTML = '';
                    consEl.innerHTML = '';
                    const pc = getProsCons(model, N, L, eff);
                    pc.pros.forEach(txt => { const li = document.createElement('li'); li.textContent = txt; prosEl.appendChild(li); });
                    pc.cons.forEach(txt => { const li = document.createElement('li'); li.textContent = txt; consEl.appendChild(li); });
                }

                // Explanation
                const messages = {
                    ngram: `N-grams estimate \\( p(w_t \\mid w_{t-1},...,w_{t-N+1}) \\) via counts + smoothing (e.g. Kneser–Ney). Expressive power capped by N and data coverage. <span class=\"text-xs text-muted\">Smoothing: ${smoothing}</span>`,
                    hmm: `HMMs introduce latent states with first-order transitions. Effective for POS tagging / segmentation but long-range semantics remain inaccessible.`,
                    transformer: `Transformers learn deep contextual token embeddings; self-attention links distant positions enabling semantic generalization + transfer across tasks.`
                };
                const title = model==='ngram' ? 'N-gram' : model==='hmm' ? 'HMM' : 'Transformer/LLM';
                expl.innerHTML = `
                    <div class=\"flex items-center gap-2 mb-2 text-sm\"><span class=\"font-semibold text-heading\">${title}</span> <span class=\"text-xs text-muted\">(N/context=${N}, L=${L})</span></div>
                    <div class=\"text-sm text-body\">${messages[model]}</div>
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
                    if (model==='transformer' && memInfo) {
                        const { cap, origWin, win } = memInfo;
                        const trunc = win < origWin ? ` (truncated to ${win}/${origWin})` : ' (full window)';
                        parts.push(`Mem cap ${cap}${trunc}`);
                    }
                    if (!parts.length) parts.push('Adjust sliders or presets to explore effects.');
                    changeEl.textContent = parts.join('; ') + '.';
                    prev.model = model; prev.eff = eff; prev.pp = pp; prev.smoothing = smoothing; prev.factor = factor; prev.mem = memInfo ? memInfo.cap : (memEl?memEl.value:undefined);
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
                const memCapTrailRaw = memEl ? parseInt(memEl.value,10) : undefined;
                const memCapTrail = memInfo ? memInfo.cap : (Number.isNaN(memCapTrailRaw) ? undefined : memCapTrailRaw);
                const memPenaltyTrail = memInfo && memInfo.win < memInfo.origWin ? Math.round((1 - (memInfo.win / Math.max(1, memInfo.origWin))) * 10) : 0;
                const ppSnapshot = Math.max(10, Math.round((basePPTrail + memPenaltyTrail) / Math.log2(2+effLog*factorTrail)) + Math.max(0, factorTrail-1)*4);
                const snapshot = { t: Date.now(), model, N, L, smoothing: smoothingUsed, eff: effLog, ratio: effLog/Math.max(1,L), factor: factorTrail, memCap: memCapTrail ?? null, pp: ppSnapshot };
                const changed = !last || ['model','N','L','smoothing','eff','pp','factor','memCap'].some(k => last[k] !== snapshot[k]);
                if (changed) {
                    sessionTrail.push(snapshot);
                    if (trailEl) {
                        const li = document.createElement('li');
                        const dt = new Date(snapshot.t).toLocaleTimeString();
                        const memNote = memInfo ? `${memCapTrail ?? '—'}→${memInfo.win}` : (memCapTrail ?? '—');
                        li.textContent = `${dt} – ${model} N=${N} L=${L}${smoothing? ' sm='+smoothing:''} f=${factorTrail} mem=${memNote} eff=${effLog} pp=${ppSnapshot}`;
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
                           let msg = `Self-attention forms context vector: \\(${`z_t = \\sum_j \\alpha_{t,j} V_j`}\\). Wider N allows more tokens to contribute.`;
                           if (memInfo) {
                               const { cap, origWin, win } = memInfo;
                               if (win < origWin) {
                                   msg += ` <span class=\"text-xs text-muted\">(Cap ${cap} limits effective window to ${win}/${origWin} tokens.)</span>`;
                               } else {
                                   msg += ` <span class=\"text-xs text-muted\">(Cap ${cap} keeps full window of ${origWin} tokens.)</span>`;
                               }
                           }
                           probEl.innerHTML = msg;
                       }
                       if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([probEl]).catch(()=>{});
                   }

                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }
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
                render();
            }
            presetBtns.forEach(b=>b.addEventListener('click', ()=>applyPreset(b.getAttribute('data-q47-preset'))));



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
                overlay.className='q47-tour-overlay';
                overlay.setAttribute('role','dialog');
                overlay.setAttribute('aria-modal','true');
                const box=document.createElement('div');
                box.className='q47-tour-dialog';
                overlay.appendChild(box);
                const titleEl=document.createElement('div');
                titleEl.className='q47-tour-title';
                const bodyEl=document.createElement('div');
                bodyEl.className='q47-tour-body';
                const ctr=document.createElement('div');
                ctr.className='q47-tour-actions';
                const back=document.createElement('button'); back.className='q47-tour-ctrl'; back.textContent='Back';
                const skip=document.createElement('button'); skip.className='q47-tour-ctrl q47-tour-ctrl--warn'; skip.textContent='Skip';
                const next=document.createElement('button'); next.className='q47-tour-ctrl q47-tour-ctrl--primary'; next.textContent='Next';
                ctr.appendChild(back); ctr.appendChild(skip); ctr.appendChild(next);
                box.appendChild(titleEl); box.appendChild(bodyEl); box.appendChild(ctr);
                function renderStep(){
                    const s = steps[idx];
                    titleEl.textContent = s.title;
                    bodyEl.textContent = s.body;
                    back.disabled = idx===0;
                    back.setAttribute('aria-disabled', String(idx===0));
                    next.textContent = idx===steps.length-1 ? 'Done' : 'Next';
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
                       card.className='q47-compare-card';
                       if (!data) {
                           card.classList.add('q47-compare-card--empty');
                           card.textContent = `Slot ${slot} empty`;
                       } else {
                           card.innerHTML = `<div class=\"font-semibold text-heading mb-1\">${slot}: ${data.model}</div>
                           <div class=\"text-xs text-muted\">N=${data.N}, L=${data.L}${data.smoothing? ', sm='+data.smoothing:''}</div>
                           <div class=\"mt-1 text-xs text-heading\">Eff ctx: <b>${data.eff}</b> (${Math.round(data.ratio*100)}%)</div>
                           <div class=\"text-xs text-heading\">Perplexity: <b>${data.pp}</b></div>`;
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
                   const model = modelEl.value;
                   const parsedN = parseInt((nEl?.value ?? '').trim(), 10);
                   const parsedL = parseInt((LEl?.value ?? '').trim(), 10);
                   const N = Number.isNaN(parsedN) ? 3 : Math.max(1, Math.min(10, parsedN));
                   const L = Number.isNaN(parsedL) ? 16 : Math.max(4, Math.min(64, parsedL));
                   const baseEff = model==='hmm' ? Math.min(2,L) : Math.min(N,L);
                   const memData = model==='transformer' ? render._memInfo : null;
                   const eff = memData ? memData.win : baseEff;
                   const ratio = eff/Math.max(1,L);
                   const smoothing = smoothingEl?.value;
                   let basePP;
                   if (model==='transformer') basePP=20;
                   else if (model==='hmm') basePP=80;
                   else {
                       if (smoothing==='none') basePP = N>=5?150:130;
                       else if (smoothing==='addk') basePP=N>=5?120:110;
                       else basePP=N>=5?105:100;
                   }
                   const memPenalty = memData && memData.win < memData.origWin ? Math.round((1 - (memData.win / Math.max(1, memData.origWin))) * 10) : 0;
                   const pp = Math.max(10, Math.round((basePP + memPenalty)/ Math.log2(2+eff)));
                   compare.A={model,N,L,eff,ratio,pp,smoothing:(model==='ngram'?smoothing:undefined)};
                   renderCompare();
               });
               capB?.addEventListener('click', ()=>{
                   const model = modelEl.value;
                   const parsedN = parseInt((nEl?.value ?? '').trim(), 10);
                   const parsedL = parseInt((LEl?.value ?? '').trim(), 10);
                   const N = Number.isNaN(parsedN) ? 3 : Math.max(1, Math.min(10, parsedN));
                   const L = Number.isNaN(parsedL) ? 16 : Math.max(4, Math.min(64, parsedL));
                   const baseEff = model==='hmm' ? Math.min(2,L) : Math.min(N,L);
                   const memData = model==='transformer' ? render._memInfo : null;
                   const eff = memData ? memData.win : baseEff;
                   const ratio = eff/Math.max(1,L);
                   const smoothing = smoothingEl?.value;
                   let basePP;
                   if (model==='transformer') basePP=20;
                   else if (model==='hmm') basePP=80;
                   else {
                       if (smoothing==='none') basePP = N>=5?150:130;
                       else if (smoothing==='addk') basePP=N>=5?120:110;
                       else basePP=N>=5?105:100;
                   }
                   const memPenalty = memData && memData.win < memData.origWin ? Math.round((1 - (memData.win / Math.max(1, memData.origWin))) * 10) : 0;
                   const pp = Math.max(10, Math.round((basePP + memPenalty)/ Math.log2(2+eff)));
                   compare.B={model,N,L,eff,ratio,pp,smoothing:(model==='ngram'?smoothing:undefined)};
                   renderCompare();
               });
            clearCmp?.addEventListener('click', ()=>{ compare.A=null; compare.B=null; renderCompare(); });
            // Goal trigger for compare when both filled happens on second capture
            // learning goals removed

            // Quiz logic
            // quiz removed

            // Trail controls
            clearTrailBtn?.addEventListener('click', ()=>{ sessionTrail.length = 0; if (trailEl) trailEl.innerHTML=''; });
            // MathJax typeset when math details opened
            document.getElementById('q47-math')?.addEventListener('toggle', (e)=>{
                if (e.target.open){
                    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([e.target]).catch(()=>{});
            // goal tracking removed
                }
            });
        // confidence removed

            modelEl.addEventListener('change', ()=>{ render(); });
            nEl.addEventListener('input', ()=>{ render(); });
            LEl.addEventListener('change', ()=>{ render(); });
            smoothingEl?.addEventListener('change', ()=>{ if (modelEl.value==='ngram') { render(); } });
            memEl?.addEventListener('input', ()=>{ if (modelEl.value==='transformer') { render(); } });
            factorEl?.addEventListener('change', ()=>{ render(); });

            render();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question47Interactive = interactiveScript;
}
