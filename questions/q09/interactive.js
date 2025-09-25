const interactiveScript = () => {
            // DOM elements
            const input = document.getElementById('q9-text-select');
            const output = document.getElementById('q9-output');
            // Selection state (replaces radio inputs)
            let selectedStrategy = 'autoregressive';
            const exampleBtn = document.getElementById('q9-example-btn');
            const strategyIndicator = document.getElementById('q9-strategy-indicator');
            const legend = document.getElementById('q9-legend');
            const explanation = document.getElementById('q9-explanation');
            const howToggle = document.getElementById('q9-how-toggle');
            const howBody = document.getElementById('q9-how-body');
            // Controls
            const compareToggle = document.getElementById('q9-compare-toggle');
            const freeRunToggle = document.getElementById('q9-free-run');
            const maxStepsSlider = document.getElementById('q9-max-steps');
            const maskRateSlider = document.getElementById('q9-mask-rate');
            const spanToggle = document.getElementById('q9-span-toggle');
            const spanLengthSlider = document.getElementById('q9-span-length');
            const stopwordsToggle = document.getElementById('q9-stopwords');
            // Compare containers
            const compareGrid = document.getElementById('q9-compare-grid');
            const outputAR = document.getElementById('q9-output-ar');
            const outputMLM = document.getElementById('q9-output-mlm');

            if (!input || !output) return;

            // Config
            const configData = {
                autoregressive: { name: 'Autoregressive (GPT-style)', panelClass: 'panel panel-success', chipClass: 'chip chip-success' },
                masked: { name: 'Masked Language Model (BERT-style)', panelClass: 'panel panel-accent', chipClass: 'chip chip-accent' }
            };

            const STOPWORDS = new Set(['the','is','a','an','and','or','of','to','in','on','for','with','from']);

            // Helpers
            function getCurrentStrategy() { return selectedStrategy; }
            function mulberry32(a) { return function(){ let t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
            function strSeed(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);} return h>>>0; }
            function getRngFor(text,mode){ return mulberry32(strSeed(text+'|'+mode)); }
            function tokenize(text){ return text.split(/[^A-Za-z0-9_]+/).filter(Boolean); }

            // Simulations
            function simulateAutoregressive(text, maxSteps, rng){
                const tokens = tokenize(text);
                const steps = [];
                const limit = Math.min(tokens.length, Math.max(3, parseInt(maxSteps||6,10)));
                for(let i=1;i<limit;i++){
                    const context = tokens.slice(0,i).join(' ');
                    const target = tokens[i];
                    const base = 0.6 + rng()*0.4; // 0.6–1.0
                    const lengthPenalty = Math.max(0,(8-target.length))/20;
                    const prob = Math.min(0.99, Math.max(0.55, base + lengthPenalty - 0.05));
                    steps.push({context, prediction: target, probability: prob, step: i});
                }
                return steps;
            }
            function simulateMasked(text, opts){
                const rng=opts.rng; const tokens=tokenize(text); const steps=[];
                const maskRate=Math.min(0.4,Math.max(0.1,(parseInt(opts.maskRate||30,10)/100)));
                const maxMasks=Math.min(6,Math.max(1,Math.round(tokens.length*maskRate))); // cap masked tokens to keep UI compact
                const useSpan=!!opts.span; const spanLen=Math.min(3,Math.max(1,parseInt(opts.spanLen||2,10)));
                const avoidStops=!!opts.avoidStopwords;

                const indices=Array.from({length:tokens.length},(_,i)=>i);
                // shuffle indices deterministically by rng
                for(let i=indices.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [indices[i],indices[j]]=[indices[j],indices[i]]; }

                if(!useSpan){
                    // Token-level masking
                    const positions=[];
                    for(const idx of indices){
                        if(positions.length>=maxMasks) break;
                        const tok=tokens[idx].toLowerCase();
                        if(avoidStops&&STOPWORDS.has(tok)) continue;
                        positions.push(idx);
                    }
                    positions.sort((a,b)=>a-b);
                    positions.forEach((pos,index)=>{
                        const masked=[...tokens]; masked[pos]='[MASK]';
                        const target=tokens[pos];
                        const base=0.7+rng()*0.3; const lengthPenalty=Math.max(0,(7-target.length))/25;
                        const prob=Math.min(0.99,Math.max(0.6,base+lengthPenalty-0.03));
                        steps.push({context:masked.join(' '), prediction: target, probability: prob, step:index+1, position:pos});
                    });
                } else {
                    // Span corruption: mask contiguous spans as a single step
                    const used=new Set();
                    let maskedCount=0;
                    for(const start of indices){
                        if(maskedCount>=maxMasks) break;
                        if(used.has(start)) continue;
                        const tok=tokens[start]?.toLowerCase();
                        if(avoidStops&&tok && STOPWORDS.has(tok)) continue;
                        // Compute effective span length without exceeding limits
                        const remaining=maxMasks-maskedCount;
                        let effLen=Math.min(spanLen, tokens.length-start, remaining);
                        if(effLen<=0) continue;
                        const spanPositions=[];
                        for(let k=0;k<effLen;k++){
                            const p=start+k; if(used.has(p)) break; // avoid overlap
                            used.add(p); spanPositions.push(p);
                        }
                        if(spanPositions.length===0) continue;
                        maskedCount+=spanPositions.length;
                        // Build masked context with multiple [MASK] tokens for visibility
                        const masked=[...tokens]; spanPositions.forEach(p=>{ masked[p]='[MASK]'; });
                        const target=spanPositions.map(p=>tokens[p]).join(' ');
                        // Slight penalty for longer spans to show difficulty
                        const avgLen = spanPositions.reduce((s,p)=>s+tokens[p].length,0)/spanPositions.length;
                        const base=0.72+rng()*0.25; const lengthPenalty=Math.max(0,(7-avgLen))/25; const spanPenalty=0.02*(spanPositions.length-1);
                        const prob=Math.min(0.99, Math.max(0.6, base+lengthPenalty-spanPenalty));
                        steps.push({context:masked.join(' '), prediction: target, probability: prob, step:steps.length+1, positions:spanPositions});
                    }
                }
                return steps;
            }

            function updateStrategyVisuals(){
                if(strategyIndicator && configData[selectedStrategy] && !compareToggle?.checked) {
                    strategyIndicator.textContent = configData[selectedStrategy].name;
                }
                const strategyRadio = document.querySelector(`input[name="q9-strategy"][value="${selectedStrategy}"]`);
                if(strategyRadio) strategyRadio.checked = true;
                const toggle = document.getElementById('q9-view-toggle');
                if(toggle){
                    // Show toggle only in single view
                    toggle.classList.toggle('hidden', !!compareToggle?.checked);
                    // Update button styles
                    toggle.querySelectorAll('button').forEach(btn=>{
                        const isActive = btn.getAttribute('data-strategy')===selectedStrategy;
                          btn.classList.toggle('toggle-active', isActive);
                          btn.classList.toggle('toggle-inactive', !isActive);
                      });
                  }
              }

            function highlightCompareSelection(){
                if(!compareToggle?.checked) return;
                const selected=document.querySelector('input[name="q9-strategy"]:checked');
                const selectedValue= selected?.value || selectedStrategy;
                // Reset
                [outputAR, outputMLM].forEach(el=>{ if(!el) return; el.classList.remove('ring-2','ring-indigo-500','opacity-60'); });
                const badgeAR = document.getElementById('q9-badge-ar');
                const badgeMLM = document.getElementById('q9-badge-mlm');
                if(badgeAR) badgeAR.classList.add('hidden');
                if(badgeMLM) badgeMLM.classList.add('hidden');
                if(selectedValue==='autoregressive'){
                    outputAR?.classList.add('ring-2','ring-indigo-500');
                    outputMLM?.classList.add('opacity-60');
                    if(badgeAR) badgeAR.classList.remove('hidden');
                } else {
                    outputMLM?.classList.add('ring-2','ring-indigo-500');
                    outputAR?.classList.add('opacity-60');
                    if(badgeMLM) badgeMLM.classList.remove('hidden');
                }
                if(strategyIndicator){ strategyIndicator.textContent = 'Comparing: Autoregressive vs Masked'; }
            }

            function updateExplanation(strategy){
                if(!explanation) return;
                const explanations={
                    autoregressive: `
                        <strong>Autoregressive training</strong> predicts tokens sequentially from left to right, so the model learns to extend a passage one token at a time.
                        <ul class="mt-2 space-y-1">
                            <li>• <strong>Pros:</strong> Natural for long-form generation, coherent storytelling, code completion.</li>
                            <li>• <strong>Cons:</strong> No future context, sequential inference is slower, weaker at analysis tasks.</li>
                            <li>• <strong>Best for:</strong> Chat, creative writing, autocomplete, summarisation.</li>
                            <li>• <strong>Examples:</strong> GPT family, Claude, Llama.</li>
                        </ul>`,
                    masked: `
                        <strong>Masked language-model training</strong> hides tokens and asks the model to recover them with full bidirectional context.
                        <ul class="mt-2 space-y-1">
                            <li>• <strong>Pros:</strong> Strong comprehension, uses both left and right context, excels at classification.</li>
                            <li>• <strong>Cons:</strong> Not suited for free-form generation, usually needs fine-tuning for tasks.</li>
                            <li>• <strong>Best for:</strong> Search ranking, QA, sentiment, retrieval and analysis.</li>
                            <li>• <strong>Examples:</strong> BERT, RoBERTa, DeBERTa.</li>
                        </ul>`
                };
                explanation.innerHTML = explanations[strategy] || '';
            }

            function updateComparisonExplanation(){
                if(!explanation) return;
                explanation.innerHTML = `
                    <strong>Comparing Autoregressive vs Masked LM.</strong>
                    <ul class="mt-2 space-y-1">
                        <li>• Autoregressive models learn to <em>continue</em> text and generate fluent sequences but do not see future tokens.</li>
                        <li>• Masked LMs learn to <em>understand</em> text by filling blanks with full context, giving higher accuracy on analysis and ranking tasks.</li>
                        <li>• Choose autoregressive when you need longer responses or creative output; choose masked when you prioritise comprehension and structured predictions.</li>
                        <li>• Many production systems pair them: autoregressive for generation, masked models for evaluation or retrieval scoring.</li>
                    </ul>`;
            }

            function updateSpanControlsEnabled(){
                if(!spanLengthSlider) return;
                const enabled = !!spanToggle?.checked;
                spanLengthSlider.disabled = !enabled;
                const labelEl = spanLengthSlider.closest('label');
                if(labelEl){
                    if(enabled){
                        labelEl.classList.remove('opacity-50','cursor-not-allowed');
                    } else {
                        labelEl.classList.add('opacity-50','cursor-not-allowed');
                    }
                }
            }

            function renderOne(strategy, text, container){
                const config=configData[strategy];
                container.innerHTML='';
                const rng=getRngFor(text,strategy);
                const steps = strategy==='autoregressive' ?
                    simulateAutoregressive(text, maxStepsSlider?.value, rng) :
                    simulateMasked(text, {maskRate:maskRateSlider?.value, span:spanToggle?.checked, spanLen:spanLengthSlider?.value, avoidStopwords:stopwordsToggle?.checked, rng});

                const stepsContainer=document.createElement('div'); stepsContainer.className='space-y-3';
                if(steps.length===0){
                    stepsContainer.innerHTML='<div class="panel panel-neutral-soft text-center py-4">Input too short for meaningful training simulation</div>';
                } else {
                    // Display steps sorted by confidence (high to low) for better readability
                    const displaySteps = [...steps].sort((a,b)=> (b.probability||0) - (a.probability||0));
                    displaySteps.forEach(step=>{
                        const confidence=(step.probability*100).toFixed(1);
                        const confidenceClass = step.probability>0.8 ? 'text-success' : step.probability>0.6 ? 'text-warning' : 'text-danger';
                        const stepEl=document.createElement('div');
                        stepEl.className=`${config.panelClass} panel-emphasis p-3 space-y-2 transition-all duration-200 hover:shadow-md`;
                        stepEl.innerHTML=`
                            <div class="flex items-center justify-between text-xs font-medium">
                                <span>${strategy==='autoregressive' ? 'Prediction Step' : 'Mask'} ${step.step}</span>
                                <span class="${confidenceClass}">${confidence}% confidence</span>
                            </div>
                            <div class="font-mono text-sm panel-muted">Context: "${step.context}"</div>
                            <div class="font-mono text-sm"><span class="panel-muted">Predict:</span> <span class="font-bold">"${step.prediction}"</span></div>
                            <div class="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                                <span class="${config.chipClass}">${strategy==='autoregressive' ? 'Causal mask' : 'Bidirectional'}</span>
                                ${strategy==='masked' ? `<span class="chip chip-accent">${spanToggle?.checked ? 'Masked span' : 'Masked token'}</span>` : ''}
                            </div>`;
                        stepEl.title = strategy==='autoregressive' ? 'Autoregressive: Predict next token based on previous context' : 'Masked LM: Predict masked token using bidirectional context';
                        stepsContainer.appendChild(stepEl);
                    });
                }
                container.appendChild(stepsContainer);

                // Stats
                const tokens=tokenize(text);
                const avgConfidence = steps.length>0 ? (steps.reduce((s,st)=>s+st.probability,0)/steps.length*100).toFixed(1) : 0;
                let extraMetricLabel=''; let extraMetricValue='';
                if(strategy==='autoregressive' && steps.length>0){
                    const ppl=Math.exp(-steps.reduce((s,st)=>s+Math.log(Math.max(1e-6,st.probability)),0)/steps.length);
                    extraMetricLabel='Perplexity (↓)'; extraMetricValue=ppl.toFixed(2);
                } else if(strategy==='masked' && steps.length>0){
                    extraMetricLabel='Recovery rate'; extraMetricValue=avgConfidence+'%';
                }
                const statsEl=document.createElement('div');
                statsEl.className='panel panel-neutral-soft grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm';
                statsEl.innerHTML=`
                    <div class="text-center space-y-1"><div class="text-lg font-bold">${steps.length}</div><div class="text-xs panel-muted">Training Steps</div></div>
                    <div class="text-center space-y-1"><div class="text-lg font-bold text-info">${tokens.length}</div><div class="text-xs panel-muted">Total Tokens</div></div>
                    <div class="text-center space-y-1"><div class="text-lg font-bold text-success">${avgConfidence}%</div><div class="text-xs panel-muted">Avg Confidence</div></div>
                    <div class="text-center space-y-1"><div class="text-lg font-bold text-accent">${extraMetricValue || (strategy==='autoregressive' ? 'Sequential' : 'Parallel')}</div><div class="text-xs panel-muted">${extraMetricLabel || 'Processing'}</div></div>`;
                container.appendChild(statsEl);

                // Legend and explanation only on single view
        if(container===output && legend){
                    legend.innerHTML=`
            <div class="flex flex-wrap items-center justify-center gap-3 text-xs">
                            <span class="${config.chipClass}">${strategy==='autoregressive' ? 'Prediction steps' : 'Masked tokens'}</span>
                            <span class="chip chip-success">High confidence (&gt;80%)</span>
                            <span class="chip chip-warning">Medium confidence (60-80%)</span>
                            <span class="chip chip-neutral">Low confidence (&lt;60%)</span>
            </div>
            <div class="text-center text-[10px] panel-muted mt-1">Sorted by confidence (high to low)</div>`;
                }
                if(container===output && !compareToggle?.checked) updateExplanation(strategy);
            }

            function processAndDisplay(){
                const text=(input.value||'').trim();
                updateStrategyVisuals();
                if(!text){ output.innerHTML='<div class="panel panel-neutral-soft text-center py-8">Choose a sentence to see the simulation</div>'; if(legend) legend.innerHTML=''; return; }
                if(compareToggle?.checked){
                    output.classList.add('hidden'); if(legend) legend.innerHTML=''; compareGrid.classList.remove('hidden'); outputAR.innerHTML=''; outputMLM.innerHTML='';
                    renderOne('autoregressive', text, outputAR); renderOne('masked', text, outputMLM);
                    highlightCompareSelection();
                    updateComparisonExplanation();
                    // Show continuation in compare mode under AR pane if enabled
                    if(freeRunToggle?.checked){
                        const rng=getRngFor(text,'gen');
                        const toks=tokenize(text);
                        const vocab=['model','learns','tokens','context','predicts','sequence','language','data','text','understanding'];
                        const gen=[]; for(let i=0;i<8;i++){ const pick = rng()<0.6 && toks[i%toks.length] ? toks[i%toks.length] : vocab[Math.floor(rng()*vocab.length)]; gen.push(pick);} 
                        const genEl=document.createElement('div');
                        genEl.className='mt-3 panel panel-success p-3 text-xs';
                        genEl.innerHTML=`<span class="font-medium">Continuation (demo):</span> ${gen.join(' ')}`;
                        outputAR.appendChild(genEl);
                    }
                } else {
                    compareGrid.classList.add('hidden'); output.classList.remove('hidden'); output.innerHTML=''; if(legend) legend.innerHTML=''; const strategy=getCurrentStrategy(); renderOne(strategy, text, output);
                    updateExplanation(strategy);
                }
                if(!compareToggle?.checked && freeRunToggle?.checked && getCurrentStrategy()==='autoregressive'){
                    const rng=getRngFor(text,'gen'); const toks=tokenize(text); const vocab=['model','learns','tokens','context','predicts','sequence','language','data','text','understanding']; const gen=[]; for(let i=0;i<8;i++){ const pick = rng()<0.6 && toks[i%toks.length] ? toks[i%toks.length] : vocab[Math.floor(rng()*vocab.length)]; gen.push(pick);} const genEl=document.createElement('div'); genEl.className='mt-3 panel panel-success p-3 text-xs'; genEl.innerHTML=`<span class="font-medium">Continuation (demo):</span> ${gen.join(' ')}`; output.appendChild(genEl);
                }
            }

            // Examples
            const examples=[
                {text:'Large language models learn from text data',strategy:'autoregressive',note:'Simple sentence showing sequential prediction'},
                {text:'Machine learning models require extensive training data',strategy:'masked',note:'Technical sentence demonstrating bidirectional understanding'},
                {text:'The quick brown fox jumps over the lazy dog',strategy:'autoregressive',note:'Classic phrase showing autoregressive token prediction'},
                {text:'Natural language processing is fascinating and complex',strategy:'masked',note:'Complex sentence for masked token prediction'},
                {text:'I love programming in Python',strategy:'autoregressive',note:'Personal statement for generation tasks'}
            ];
            let exampleIndex=0; exampleBtn?.addEventListener('click',()=>{ const ex=examples[exampleIndex%examples.length]; input.value=ex.text; document.querySelector(`input[name="q9-strategy"][value="${ex.strategy}"]`).checked=true; processAndDisplay(); exampleIndex++; const next=examples[exampleIndex%examples.length]; exampleBtn.title=next.note; });

            // Listeners
            input.addEventListener('change', processAndDisplay);
            // Toggle buttons for single view switching
            const viewToggle = document.getElementById('q9-view-toggle');
            viewToggle?.querySelectorAll('button').forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    const mode = btn.getAttribute('data-strategy');
                    if(mode && (mode==='autoregressive' || mode==='masked')){
                        selectedStrategy = mode;
                        updateStrategyVisuals();
                        processAndDisplay();
                    }
                });
            });
            howToggle?.addEventListener('click',()=>{ if(!howBody) return; const hidden=howBody.classList.toggle('hidden'); howToggle.setAttribute('aria-expanded', (!hidden).toString()); howToggle.textContent=hidden?'Show':'Hide'; });
            compareToggle?.addEventListener('change', ()=>{ processAndDisplay(); highlightCompareSelection(); });
            // Allow selecting by clicking on compare panes
            outputAR?.addEventListener('click', ()=>{ if(compareToggle?.checked){ selectedStrategy='autoregressive'; highlightCompareSelection(); }});
            outputMLM?.addEventListener('click', ()=>{ if(compareToggle?.checked){ selectedStrategy='masked'; highlightCompareSelection(); }});
            freeRunToggle?.addEventListener('change', processAndDisplay);
            maxStepsSlider?.addEventListener('input', processAndDisplay);
            maskRateSlider?.addEventListener('input', processAndDisplay);
            spanToggle?.addEventListener('change', ()=>{ updateSpanControlsEnabled(); processAndDisplay(); });
            spanLengthSlider?.addEventListener('input', processAndDisplay);
            stopwordsToggle?.addEventListener('change', processAndDisplay);

            // Init
            updateStrategyVisuals();
            updateSpanControlsEnabled();
            processAndDisplay();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question09Interactive = interactiveScript;
}





