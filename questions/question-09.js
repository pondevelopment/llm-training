// Question 9: Autoregressive vs Masked Language Models
// Created: July 9, 2025
// Educational Focus: Understanding the fundamental differences between GPT-style and BERT-style training approaches

const question = {
    title: "9. How do autoregressive and masked models differ in LLM training?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔄 What are Training Paradigms?</h4>
            <p class="text-blue-800">Language models learn through different training strategies that shape their strengths. Think of it like learning to read: you could learn by predicting the next word in a story (autoregressive) or by filling in missing words in completed sentences (masked). Each approach develops different language understanding capabilities.</p>
        </div>
        
        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">🎯 Autoregressive Models (GPT-style)</h5>
                <p class="text-sm text-green-700 mb-3">Predict the next token in sequence, seeing only previous context. Like writing a story word by word, never looking ahead.</p>
                <div class="text-xs space-y-2">
                    <div><strong>Training:</strong> "The cat sat on" → predict "the"</div>
                    <div><strong>Strengths:</strong> Text generation, completion, creative writing</div>
                    <div><strong>Direction:</strong> Left-to-right (causal)</div>
                    <div><strong>Examples:</strong> GPT-3/4, ChatGPT, Claude</div>
                </div>
                <code class="text-xs bg-green-100 px-2 py-1 rounded block mt-2">P(token | previous_tokens)</code>
            </div>
            
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🎭 Masked Language Models (BERT-style)</h5>
                <p class="text-sm text-purple-700 mb-3">Predict masked tokens using full bidirectional context. Like solving a crossword puzzle with clues from all directions.</p>
                <div class="text-xs space-y-2">
                    <div><strong>Training:</strong> "The cat [MASK] on the mat" → predict "sat"</div>
                    <div><strong>Strengths:</strong> Understanding, classification, Q&A</div>
                    <div><strong>Direction:</strong> Bidirectional (sees all)</div>
                    <div><strong>Examples:</strong> BERT, RoBERTa, DeBERTa</div>
                </div>
                <code class="text-xs bg-purple-100 px-2 py-1 rounded block mt-2">P(token | all_context)</code>
            </div>
        </div>

        <!-- Training Process Comparison -->
        <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">🔄 Training Process Differences</h4>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h6 class="font-medium text-green-800 mb-2">Autoregressive Training</h6>
                    <div class="text-sm space-y-1">
                        <div class="font-mono bg-white p-2 rounded border">
                            <div class="text-gray-500">Input: "The weather is"</div>
                            <div class="text-green-600">→ Predict: "nice"</div>
                            <div class="text-gray-500">Input: "The weather is nice"</div>
                            <div class="text-green-600">→ Predict: "today"</div>
                        </div>
                        <p class="text-xs text-gray-600">Sequential prediction, one token at a time</p>
                    </div>
                </div>
                <div>
                    <h6 class="font-medium text-purple-800 mb-2">Masked Training</h6>
                    <div class="text-sm space-y-1">
                        <div class="font-mono bg-white p-2 rounded border">
                            <div class="text-gray-500">Input: "The [MASK] is nice today"</div>
                            <div class="text-purple-600">→ Predict: "weather"</div>
                            <div class="text-gray-500">Input: "The weather [MASK] nice today"</div>
                            <div class="text-purple-600">→ Predict: "is"</div>
                        </div>
                        <p class="text-xs text-gray-600">Multiple masks predicted simultaneously</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Task Specialization:</strong> Training paradigm determines what the model excels at - generation vs understanding</li>
                <li>• <strong>Architecture Design:</strong> Influences attention mechanisms (causal vs bidirectional) and model structure</li>
                <li>• <strong>Use Case Selection:</strong> Choose autoregressive for creative tasks, masked for analytical tasks</li>
                <li>• <strong>Computational Trade-offs:</strong> Different training costs and inference patterns affect deployment decisions</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔄 Interactive Model Training Simulator",
        html: `<div class="space-y-6">
            <!-- How it works -->
            <div class="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <h4 class="font-semibold text-sky-900 mb-1">🎓 How this simulator works</h4>
                        <p class="text-sm text-sky-800">Two training paradigms: Autoregressive (predict next token with causal masking) and Masked LM (recover hidden tokens with bidirectional context). This demo visualizes steps, confidence, and summary stats.</p>
                    </div>
                    <button id="q9-how-toggle" class="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded hover:bg-sky-200" aria-expanded="true">Hide</button>
                </div>
                <div id="q9-how-body" class="mt-3 grid md:grid-cols-3 gap-3 text-xs text-sky-900">
                    <div class="bg-white/60 border border-sky-200 rounded p-2">
                        <div class="font-semibold mb-1">Autoregressive</div>
                        <ul class="list-disc list-inside space-y-0.5">
                            <li>Predict next token left→right</li>
                            <li>Causal attention mask</li>
                            <li>Great for generation</li>
                        </ul>
                    </div>
                    <div class="bg-white/60 border border-sky-200 rounded p-2">
                        <div class="font-semibold mb-1">Masked LM</div>
                        <ul class="list-disc list-inside space-y-0.5">
                            <li>Mask some tokens</li>
                            <li>Use full context to recover</li>
                            <li>Great for understanding</li>
                        </ul>
                    </div>
                    <div class="bg-white/60 border border-sky-200 rounded p-2">
                        <div class="font-semibold mb-1">What you’ll see</div>
                        <ul class="list-disc list-inside space-y-0.5">
                            <li>Steps + confidence</li>
                            <li>Stats (perplexity / recovery)</li>
                            <li>Mask chips for each mode</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Input Section (dropdown for controlled examples) -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q9-text-select" class="block text-sm font-medium text-gray-700 mb-2">📝 Choose a sentence</label>
                <select id="q9-text-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Large language models learn from text data" selected>Large language models learn from text data</option>
                    <option value="Machine learning models require extensive training data">Machine learning models require extensive training data</option>
                    <option value="The quick brown fox jumps over the lazy dog">The quick brown fox jumps over the lazy dog</option>
                    <option value="Natural language processing is fascinating and complex">Natural language processing is fascinating and complex</option>
                    <option value="I love programming in Python">I love programming in Python</option>
                </select>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span class="text-xs text-gray-600">Or cycle examples:</span>
                    <button id="q9-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Next example</button>
                </div>
            </div>
            
            <!-- Training paradigms (examples only) -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Training Paradigm (examples)</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div class="font-medium text-gray-900 mb-1">Autoregressive (GPT-style)</div>
                        <p class="text-xs text-gray-600 mb-2">Predicts next token sequentially, left-to-right</p>
                        <ul class="text-xs text-gray-700 list-disc list-inside space-y-0.5 mb-2">
                            <li>Great for generation and continuation</li>
                            <li>Sequential (causal) attention</li>
                        </ul>
                        <div class="text-xs font-mono bg-white px-2 py-1 rounded border">"The cat" → predict "sat"</div>
                    </div>
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div class="font-medium text-gray-900 mb-1">Masked (BERT-style)</div>
                        <p class="text-xs text-gray-600 mb-2">Predicts masked tokens using bidirectional context</p>
                        <ul class="text-xs text-gray-700 list-disc list-inside space-y-0.5 mb-2">
                            <li>Great for understanding and classification</li>
                            <li>Sees full bidirectional context</li>
                        </ul>
                        <div class="text-xs font-mono bg-white px-2 py-1 rounded border">"The [MASK] sat" → predict "cat"</div>
                    </div>
                </div>
                <div class="text-[11px] text-gray-500 mt-2">You can switch paradigms directly in the simulation below.</div>
            </div>

            <!-- Controls -->
            <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700">🧪 Compare both paradigms</label>
                    <input type="checkbox" id="q9-compare-toggle" class="h-4 w-4" checked>
                </div>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div class="bg-green-50 border border-green-200 rounded p-3">
                        <div class="font-medium text-green-900 mb-2">Autoregressive controls</div>
                        <div class="flex items-center gap-2 mb-2">
                            <input type="checkbox" id="q9-free-run" class="h-4 w-4">
                            <label for="q9-free-run" class="text-green-800">Generate short continuation</label>
                        </div>
                        <label class="block text-xs text-green-800">Max steps
                            <input type="range" id="q9-max-steps" min="3" max="10" value="6" class="w-full">
                        </label>
                        <div class="mt-1 text-[11px] text-green-700">Shows up to N prediction steps.</div>
                    </div>
                    <div class="bg-purple-50 border border-purple-200 rounded p-3">
                        <div class="font-medium text-purple-900 mb-2">Masked LM controls</div>
                        <label class="block text-xs text-purple-800">Mask rate (10–40%)
                            <input type="range" id="q9-mask-rate" min="10" max="40" value="30" class="w-full">
                        </label>
                        <div class="flex items-center gap-2 mt-2">
                            <input type="checkbox" id="q9-span-toggle" class="h-4 w-4">
                            <label for="q9-span-toggle" class="text-purple-800 text-sm">Use span corruption</label>
                        </div>
                        <label class="block text-xs text-purple-800 mt-1">Span length (1–3)
                            <input type="range" id="q9-span-length" min="1" max="3" value="2" class="w-full">
                        </label>
                        <div class="flex items-center gap-2 mt-2">
                            <input type="checkbox" id="q9-stopwords" class="h-4 w-4">
                            <label for="q9-stopwords" class="text-purple-800 text-sm">Avoid masking stopwords</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Training Simulation</h4>
                    <div class="flex items-center gap-2">
                        <div id="q9-view-toggle" class="hidden text-xs rounded border border-gray-300 overflow-hidden">
                            <button data-strategy="autoregressive" class="px-2 py-1 bg-white hover:bg-gray-50">Autoregressive</button>
                            <button data-strategy="masked" class="px-2 py-1 bg-white hover:bg-gray-50 border-l border-gray-300">Masked</button>
                        </div>
                        <div id="q9-strategy-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                    </div>
                </div>
                <div id="q9-output" class="min-h-[120px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
                <div id="q9-legend" class="mt-3 text-xs"></div>
                <div id="q9-compare-grid" class="hidden mt-3 grid md:grid-cols-2 gap-4">
                    <div>
                        <div class="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">Autoregressive <span id="q9-badge-ar" class="hidden px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200">Selected</span></div>
                        <div id="q9-output-ar" class="min-h-[120px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">Masked LM <span id="q9-badge-mlm" class="hidden px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200">Selected</span></div>
                        <div id="q9-output-mlm" class="min-h-[120px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
                    </div>
                </div>
            </div>
            
            <!-- Educational Comparison -->
            <div id="q9-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Training Paradigm Analysis</h4>
                <div id="q9-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
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
                autoregressive: { name: 'Autoregressive (GPT-style)', color: '#10b981', bgColor: '#ecfdf5' },
                masked: { name: 'Masked Language Model (BERT-style)', color: '#8b5cf6', bgColor: '#f3e8ff' }
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
                const toggle = document.getElementById('q9-view-toggle');
                if(toggle){
                    // Show toggle only in single view
                    toggle.classList.toggle('hidden', !!compareToggle?.checked);
                    // Update button styles
                    toggle.querySelectorAll('button').forEach(btn=>{
                        const isActive = btn.getAttribute('data-strategy')===selectedStrategy;
                        btn.classList.toggle('bg-indigo-600', isActive);
                        btn.classList.toggle('text-white', isActive);
                        btn.classList.toggle('bg-white', !isActive);
                        btn.classList.toggle('text-gray-700', !isActive);
                    });
                }
            }

            function highlightCompareSelection(){
                if(!compareToggle?.checked) return;
                const selected=document.querySelector('input[name="q9-strategy"]:checked'); if(!selected) return;
                const selectedValue=selected.value;
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
                        <strong>Autoregressive Training</strong> predicts tokens sequentially from left to right.
                        <br>• <strong>Pros:</strong> Excellent for text generation, natural for language modeling, maintains coherent long-form text
                        <br>• <strong>Cons:</strong> Cannot see future context, slower inference (sequential), limited understanding tasks
                        <br>• <strong>Best for:</strong> Text completion, creative writing, chatbots, code generation
                        <br>• <strong>Examples:</strong> GPT series, Claude`,
                    masked: `
                        <strong>Masked Language Model Training</strong> predicts tokens using full bidirectional context.
                        <br>• <strong>Pros:</strong> Rich understanding, bidirectional context, excellent for classification and analysis
                        <br>• <strong>Cons:</strong> Cannot generate text naturally, requires fine-tuning for downstream tasks
                        <br>• <strong>Best for:</strong> Text classification, sentiment analysis, question answering, named entity recognition
                        <br>• <strong>Examples:</strong> BERT, RoBERTa, DeBERTa`
                };
                explanation.innerHTML = explanations[strategy] || '';
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
                    stepsContainer.innerHTML='<div class="text-gray-500 text-center py-4">Input too short for meaningful training simulation</div>';
                } else {
                    // Display steps sorted by confidence (high → low) for better readability
                    const displaySteps = [...steps].sort((a,b)=> (b.probability||0) - (a.probability||0));
                    displaySteps.forEach(step=>{
                        const confidence=(step.probability*100).toFixed(1);
                        const confidenceColor= step.probability>0.8 ? 'text-green-600' : step.probability>0.6 ? 'text-yellow-600' : 'text-red-600';
                        const stepEl=document.createElement('div');
                        stepEl.className='border rounded-lg p-3 transition-all duration-200 hover:shadow-md';
                        stepEl.style.backgroundColor=config.bgColor; stepEl.style.borderColor=config.color+'40';
                        stepEl.innerHTML=`
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-medium" style="color: ${config.color}">${strategy==='autoregressive' ? 'Prediction Step' : 'Mask'} ${step.step}</span>
                                <span class="text-xs ${confidenceColor} font-medium">${confidence}% confidence</span>
                            </div>
                            <div class="font-mono text-sm mb-2"><span class="text-gray-600">Context:</span> "${step.context}"</div>
                            <div class="font-mono text-sm"><span class="text-gray-600">Predict:</span> <span class="font-bold" style="color: ${config.color}">"${step.prediction}"</span></div>
                            <div class="mt-2 text-[10px] inline-flex items-center gap-1">
                                <span class="px-1 rounded bg-blue-100 text-blue-800">${strategy==='autoregressive' ? 'Causal mask' : 'Bidirectional'}</span>
                                ${strategy==='masked' ? `<span class="px-1 rounded bg-purple-100 text-purple-800">${spanToggle?.checked ? 'Masked span' : 'Masked token'}</span>` : ''}
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
                const statsEl=document.createElement('div'); statsEl.className='grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-white rounded border mt-4 text-sm';
                statsEl.innerHTML=`
                    <div class="text-center"><div class="text-lg font-bold" style="color: ${config.color}">${steps.length}</div><div class="text-gray-600 text-xs">Training Steps</div></div>
                    <div class="text-center"><div class="text-lg font-bold text-blue-600">${tokens.length}</div><div class="text-gray-600 text-xs">Total Tokens</div></div>
                    <div class="text-center"><div class="text-lg font-bold text-green-600">${avgConfidence}%</div><div class="text-gray-600 text-xs">Avg Confidence</div></div>
                    <div class="text-center"><div class="text-lg font-bold text-purple-600">${extraMetricValue || (strategy==='autoregressive' ? 'Sequential' : 'Parallel')}</div><div class="text-gray-600 text-xs">${extraMetricLabel || 'Processing'}</div></div>`;
                container.appendChild(statsEl);

                // Legend and explanation only on single view
        if(container===output && legend){
                    legend.innerHTML=`
            <div class="flex items-center justify-center space-x-4 text-xs">
                            <div class="flex items-center space-x-1"><div class="w-3 h-3 rounded" style="background-color: ${config.color}"></div><span>${strategy==='autoregressive' ? 'Prediction Steps' : 'Masked Tokens'}</span></div>
                            <div class="flex items-center space-x-1"><div class="w-3 h-3 rounded bg-green-500"></div><span>High Confidence (>80%)</span></div>
                            <div class="flex items-center space-x-1"><div class="w-3 h-3 rounded bg-yellow-500"></div><span>Medium Confidence (60-80%)</span></div>
            </div>
            <div class="text-center text-[10px] text-gray-500 mt-1">Sorted by confidence (high → low)</div>`;
                }
                if(container===output) updateExplanation(strategy);
            }

            function processAndDisplay(){
                const text=(input.value||'').trim();
                updateStrategyVisuals();
                if(!text){ output.innerHTML='<div class="text-gray-500 text-center py-8">Choose a sentence to see the simulation</div>'; if(legend) legend.innerHTML=''; return; }
                if(compareToggle?.checked){
                    output.classList.add('hidden'); if(legend) legend.innerHTML=''; compareGrid.classList.remove('hidden'); outputAR.innerHTML=''; outputMLM.innerHTML='';
                    renderOne('autoregressive', text, outputAR); renderOne('masked', text, outputMLM);
                    highlightCompareSelection();
                    // Show continuation in compare mode under AR pane if enabled
                    if(freeRunToggle?.checked){
                        const rng=getRngFor(text,'gen');
                        const toks=tokenize(text);
                        const vocab=['model','learns','tokens','context','predicts','sequence','language','data','text','understanding'];
                        const gen=[]; for(let i=0;i<8;i++){ const pick = rng()<0.6 && toks[i%toks.length] ? toks[i%toks.length] : vocab[Math.floor(rng()*vocab.length)]; gen.push(pick);} 
                        const genEl=document.createElement('div');
                        genEl.className='mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs';
                        genEl.innerHTML=`<span class="font-medium text-green-800">Continuation (demo):</span> ${gen.join(' ')}`;
                        outputAR.appendChild(genEl);
                    }
                } else {
                    compareGrid.classList.add('hidden'); output.classList.remove('hidden'); output.innerHTML=''; if(legend) legend.innerHTML=''; const strategy=getCurrentStrategy(); renderOne(strategy, text, output);
                }
                if(!compareToggle?.checked && freeRunToggle?.checked && getCurrentStrategy()==='autoregressive'){
                    const rng=getRngFor(text,'gen'); const toks=tokenize(text); const vocab=['model','learns','tokens','context','predicts','sequence','language','data','text','understanding']; const gen=[]; for(let i=0;i<8;i++){ const pick = rng()<0.6 && toks[i%toks.length] ? toks[i%toks.length] : vocab[Math.floor(rng()*vocab.length)]; gen.push(pick);} const genEl=document.createElement('div'); genEl.className='mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs'; genEl.innerHTML=`<span class="font-medium text-green-800">Continuation (demo):</span> ${gen.join(' ')}`; output.appendChild(genEl);
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
        }
    }
};

// Export the question object
if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
} else if (typeof window !== 'undefined') {
    window.question09 = question;
}
