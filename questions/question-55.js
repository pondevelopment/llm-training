// Question 55: Stopping Criteria in Generation
const question = {
    title: "55. How do you decide when to stop generating text with an LLM?",
    answer: `<div class=\"space-y-5\">
        <div class=\"bg-indigo-50 p-3 rounded-lg border border-indigo-200\">
            <h4 class=\"font-semibold text-indigo-900 mb-1\">📚 Recommended reading (related)</h4>
            <ul class=\"list-disc ml-5 text-sm text-indigo-800 space-y-1\">
                <li><a href=\"#question-53\" class=\"text-indigo-700 underline hover:text-indigo-900\">Question 53: Decoding strategies (how tokens are selected)</a></li>
                <li><a href=\"#question-54\" class=\"text-indigo-700 underline hover:text-indigo-900\">Question 54: Logits & probability transformations</a></li>
                <li><a href=\"#question-6\" class=\"text-indigo-700 underline hover:text-indigo-900\">Question 6: Temperature effects</a></li>
                <li><a href=\"#question-12\" class=\"text-indigo-700 underline hover:text-indigo-900\">Question 12: Top-k vs top-p sampling</a></li>
                <li><a href=\"#question-5\" class=\"text-indigo-700 underline hover:text-indigo-900\">Question 5: Beam search</a></li>
                <li><a href=\"#question-3\" class=\"text-indigo-700 underline hover:text-indigo-900\">Question 3: Context window limits</a></li>
                <li><a href=\"#question-18\" class=\"text-indigo-700 underline hover:text-indigo-900\">Question 18: (Contrast) Training early stopping</a></li>
            </ul>
        </div>
    <div class=\"bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 space-y-3\">
        <h4 class=\"font-semibold text-blue-900 mb-2\">🛑 Why Stopping Matters</h4>
        <p class=\"text-blue-800 text-sm leading-relaxed\">A generation session is a <strong>constrained optimization</strong>: maximize utility (clarity, completeness, safety) while minimizing cost (tokens, latency, risk). Choosing <em>when to stop</em> is as important as choosing <em>what to emit next</em>. Done well, stopping feels invisible; done poorly, users see cut sentences, runaway rambles, malformed JSON, or policy leaks.</p>
        <div class=\"grid md:grid-cols-2 gap-3 text-[13px] text-blue-900\">
        <div class=\"bg-white/50 rounded p-3 border border-blue-100\">
            <div class=\"font-medium mb-1\">Cost & Latency</div>
            <ul class=\"list-disc ml-4 space-y-0.5 text-blue-800\">
            <li>Each extra token consumes budget + latency.</li>
            <li>Early stop on stable answer improves UX.</li>
            <li>Streaming UIs need responsive abort paths.</li>
            </ul>
        </div>
        <div class=\"bg-white/50 rounded p-3 border border-blue-100\">
            <div class=\"font-medium mb-1\">Coherence & Quality</div>
            <ul class=\"list-disc ml-4 space-y-0.5 text-blue-800\">
            <li>Good endings align with discourse structure.</li>
            <li>Overrun drifts into repetition or filler.</li>
            <li>Balanced structures (JSON / code) must close.</li>
            </ul>
        </div>
        <div class=\"bg-white/50 rounded p-3 border border-blue-100\">
            <div class=\"font-medium mb-1\">Safety & Compliance</div>
            <ul class=\"list-disc ml-4 space-y-0.5 text-blue-800\">
            <li>Terminate as soon as disallowed content pattern emerges.</li>
            <li>Reduce window for compounding policy violations.</li>
            <li>Log stop reason for audit (e.g. <code>policy_toxicity</code>).</li>
            </ul>
        </div>
        <div class=\"bg-white/50 rounded p-3 border border-blue-100\">
            <div class=\"font-medium mb-1\">Structural Integrity</div>
            <ul class=\"list-disc ml-4 space-y-0.5 text-blue-800\">
            <li>APIs consuming JSON / tool calls need valid closure.</li>
            <li>Guard against truncation mid‑object.</li>
            <li>Layer structural validation with token limits.</li>
            </ul>
        </div>
        </div>
        <div class=\"text-[12px] bg-blue-100/60 border border-blue-200 rounded p-3 leading-relaxed text-blue-900\">
        <strong>Contrast vs training early stopping:</strong> training early stopping halts updates to prevent overfitting; inference stopping halts token emission to preserve quality, safety, and efficiency. They share the idea of \"diminishing returns\" but operate on different signals (validation loss vs incremental generation heuristics).
        </div>
        <p class=\"text-blue-800 text-xs\"><strong>Interplay:</strong> Decoding policy proposes a candidate; stopping layer evaluates global state (tokens used, structures closed, patterns matched). Separation of concerns keeps logic maintainable and auditable.</p>
    </div>
    </div>
        </div>
        <div class=\"mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4\">
            <div class=\"bg-green-50 p-3 rounded border-l-4 border-green-400 shadow-sm\">
                <h5 class=\"font-medium text-green-900\">1. Token / Budget Based</h5>
                <p class=\"text-[11px] text-green-800 leading-snug\">Hard limits: EOS token, max tokens, timeout.</p>
            </div>
            <div class=\"bg-purple-50 p-3 rounded border-l-4 border-purple-400 shadow-sm\">
                <h5 class=\"font-medium text-purple-900\">2. Pattern / String Based</h5>
                <p class=\"text-[11px] text-purple-800 leading-snug\">Substring / delimiter match (normalize + longest-first).</p>
            </div>
            <div class=\"bg-orange-50 p-3 rounded border-l-4 border-orange-400 shadow-sm\">
                <h5 class=\"font-medium text-orange-900\">3. Structural Completion</h5>
                <p class=\"text-[11px] text-orange-800 leading-snug\">Detect balanced / closed syntactic containers.</p>
            </div>
            <div class=\"bg-rose-50 p-3 rounded border-l-4 border-rose-400 shadow-sm\">
                <h5 class=\"font-medium text-rose-900\">4. Safety / Quality</h5>
                <p class=\"text-[11px] text-rose-800 leading-snug\">Policy triggers, degeneracy, repetition loops.</p>
            </div>
            <div class=\"bg-yellow-50 p-3 rounded border-l-4 border-yellow-400 shadow-sm\">
                <h5 class=\"font-medium text-yellow-900\">5. Probabilistic / Dynamic</h5>
                <p class=\"text-[11px] text-yellow-800 leading-snug\">Entropy / marginal utility thresholds detect saturation.</p>
            </div>
            <div class=\"bg-slate-50 p-3 rounded border-l-4 border-slate-400 shadow-sm\">
                <h5 class=\"font-medium text-slate-900\">6. Human / Operational</h5>
                <p class=\"text-[11px] text-slate-800 leading-snug\">External interrupts: user cancel, channel close, budget guard.</p>
            </div>
        </div>
    <div class=\"mt-6 bg-emerald-50 p-4 rounded-lg border border-emerald-200\">
            <h4 class=\"font-semibold text-emerald-900 mb-2\">✅ Design Tips</h4>
            <ul class=\"text-sm text-emerald-800 space-y-1\">
                <li>• Normalize text (Unicode, whitespace) before matching stop sequences.</li>
                <li>• Apply <strong>longest stop string first</strong> to avoid premature partial matches.</li>
                <li>• Keep structural guards (JSON balance) orthogonal to textual stops.</li>
                <li>• Log the <em>first triggered criterion</em> + diagnostics for observability.</li>
                <li>• Distinguish <code>truncated = true</code> (budget hit) vs <code>stopped = eos</code> for downstream logic.</li>
            </ul>
        </div>
    <div class=\"mt-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-400\">
            <h4 class=\"font-semibold text-red-900 mb-2\">⚠️ Common Pitfalls</h4>
            <ul class=\"text-sm text-red-800 space-y-1\">
                <li>• Partial stop sequence split across streaming chunks.</li>
                <li>• Unclosed JSON because only max token cap fired.</li>
                <li>• Double termination: both EOS and stop string (record canonical reason).</li>
                <li>• Premature structural stop when braces appear inside code blocks.</li>
                <li>• Repetition detector firing on low length contexts (need warmup tokens).</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🧪 Stopping Criteria Simulator",
        html: `<div class=\"space-y-6\">
            <div class=\"bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200\">
                <label class=\"block text-sm font-medium text-gray-700 mb-2\">📝 Prompt</label>
                <select id=\"q55-prompt\" class=\"w-full px-3 py-2 border rounded bg-white text-sm\">
                    <option value=\"Generate a short JSON object describing a book.\">Generate a short JSON object describing a book.</option>
                    <option value=\"Explain in two sentences what beam search does.\">Explain in two sentences what beam search does.</option>
                    <option value=\"Write a haiku about entropy.\">Write a haiku about entropy.</option>
                    <option value=\"Return a JSON array of three fruits.\">Return a JSON array of three fruits.</option>
                    <option value=\"List three bullet points about overfitting.\">List three bullet points about overfitting.</option>
                    <option value=\"Generate a short JSON object describing a user.\">Generate a short JSON object describing a user.</option>
                    <option value=\"Write a two-line rhyme about gradients.\">Write a two-line rhyme about gradients.</option>
                </select>
                <p class=\"text-xs text-gray-600 mt-1\">A pre-built token stream (mock) will simulate generation for this intent.</p>
            </div>
            <div class=\"grid md:grid-cols-2 gap-4\">
                <div class=\"bg-white border rounded p-4 space-y-4\">
                    <h4 class=\"font-medium text-gray-800 text-sm flex items-center gap-2\">⚙️ Controls <span class=\"text-[10px] bg-gray-100 px-2 py-0.5 rounded border\">Adjust + Re-Run</span></h4>
                    <div class=\"space-y-3 text-xs\">
                        <div>
                            <label class=\"font-medium text-gray-700\">Max tokens: <span id=\"q55-max-val\" class=\"font-mono\">60</span></label>
                            <input id=\"q55-max\" type=\"range\" min=\"5\" max=\"120\" value=\"60\" class=\"w-full\" />
                        </div>
                        <div class=\"space-y-2\">
                            <label class=\"font-medium text-gray-700 flex items-center justify-between\">
                                <span>Stop sequences</span>
                                <span class=\"text-[10px] text-gray-500 font-normal\">Preset set(s)</span>
                            </label>
                            <select id=\"q55-stops-select\" class=\"w-full px-2 py-1 border rounded bg-white text-xs\">
                                <option value=\"none\">None</option>
                                <option value=\"\n\n\">Blank line (\\n\\n)</option>
                                <option value=\"###\">Markdown fence ###</option>
                                <option value=\"</json>\">JSON closing tag </json></option>
                                <option value=\"\n\n,###\">Blank line + ###</option>
                                <option value=\"\n\n,###,</json>\" selected>Blank line + ### + </json></option>
                                <option value=\"\`\`\`\">Code fence (\`\`\`)</option>
                            </select>
                            <p class=\"text-[10px] text-gray-500\">Longest match ordering applied automatically.</p>
                        </div>
                        <div class=\"grid grid-cols-2 gap-3\">
                            <div>
                                <label class=\"font-medium text-gray-700\">Repetition n-gram</label>
                                <select id=\"q55-ngram\" class=\"w-full border rounded px-2 py-1\">
                                    <option value=\"2\">2</option>
                                    <option value=\"3\" selected>3</option>
                                    <option value=\"4\">4</option>
                                </select>
                            </div>
                            <div>
                                <label class=\"font-medium text-gray-700\">Max repeats</label>
                                <select id=\"q55-repeats\" class=\"w-full border rounded px-2 py-1\">
                                    <option value=\"1\">1</option>
                                    <option value=\"2\" selected>2</option>
                                    <option value=\"3\">3</option>
                                </select>
                            </div>
                        </div>
                        <p class=\"text-[10px] text-gray-500 leading-snug\"><strong>What is a 3-gram?</strong> An <em>n-gram</em> is a sequence of <code>n</code> consecutive tokens. We watch the latest n tokens; if that exact sequence has appeared more than the allowed repeats elsewhere in the generated stream, we stop (prevents loops like "the cat the cat the cat").</p>
                        <div class=\"flex items-center gap-2\">
                            <input id=\"q55-json-guard\" type=\"checkbox\" class=\"h-4 w-4\" />
                            <label for=\"q55-json-guard\" class=\"font-medium text-gray-700\">Require balanced JSON braces</label>
                        </div>
                        <p id=\"q55-json-hint\" class=\"text-[10px] text-gray-500 -mt-1\"></p>
                        <div>
                            <label class=\"font-medium text-gray-700 flex items-center justify-between\">
                                <span>Entropy lower bound: <span id=\"q55-entropy-val\" class=\"font-mono\">0.0</span></span>
                                <span class=\"text-[10px] text-gray-500 font-normal\">(optional)</span>
                            </label>
                            <input id=\"q55-entropy-th\" type=\"range\" min=\"0\" max=\"5\" step=\"0.1\" value=\"0\" class=\"w-full\" />
                            <p class=\"text-[10px] text-gray-500 mt-0.5\">Stops when per-step token distribution entropy drops below this threshold (lower = model very certain).</p>
                        </div>
                        <button id=\"q55-run\" class=\"w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-sm font-medium\">▶ Run Simulation</button>
                    </div>
                </div>
                <div class=\"bg-white border rounded p-4 space-y-3\">
                    <h4 class=\"font-medium text-gray-800 text-sm\">🧭 Live Criteria Status</h4>
                    <div id=\"q55-status\" class=\"text-xs grid grid-cols-2 gap-2\"></div>
                    <div id=\"q55-outcome\" class=\"text-sm font-medium text-gray-700 mt-2\"></div>
                </div>
            </div>
            <div class=\"bg-gray-50 border border-gray-200 rounded p-4\">
                <div class=\"flex items-center justify-between mb-2\">
                    <h4 class=\"font-medium text-gray-800 text-sm\">📄 Generated Tokens</h4>
                    <span id=\"q55-token-count\" class=\"text-[11px] bg-white px-2 py-0.5 rounded border font-mono\"></span>
                </div>
                <div class=\"overflow-x-auto\">
                    <table class=\"w-full text-xs border-collapse\">
                        <thead>
                            <tr class=\"bg-gray-100 text-gray-700\"><th class=\"px-2 py-1 text-left\">#</th><th class=\"px-2 py-1 text-left\">Token</th><th class=\"px-2 py-1 text-left\">p</th><th class=\"px-2 py-1 text-left\">Entropy</th><th class=\"px-2 py-1 text-left\">Reason</th></tr>
                        </thead>
                        <tbody id=\"q55-table\" class=\"align-top\"></tbody>
                    </table>
                </div>
            </div>
            <div id=\"q55-explanation\" class=\"bg-yellow-50 border border-yellow-200 rounded p-4 text-xs text-yellow-800\"></div>
        </div>`,
        script: () => {
            const promptSel = document.getElementById('q55-prompt');
            const maxRange = document.getElementById('q55-max');
            const maxVal = document.getElementById('q55-max-val');
            const stopsSelect = document.getElementById('q55-stops-select');
            const ngramSel = document.getElementById('q55-ngram');
            const repeatSel = document.getElementById('q55-repeats');
            const jsonGuard = document.getElementById('q55-json-guard');
            const entropyTh = document.getElementById('q55-entropy-th');
            const entropyVal = document.getElementById('q55-entropy-val');
            const runBtn = document.getElementById('q55-run');
            const statusEl = document.getElementById('q55-status');
            const tableBody = document.getElementById('q55-table');
            const outcomeEl = document.getElementById('q55-outcome');
            const tokenCountEl = document.getElementById('q55-token-count');
            const explanationEl = document.getElementById('q55-explanation');
            const jsonHint = document.getElementById('q55-json-hint');

            const rnd = (seed => () => { seed = (seed * 16807) % 2147483647; return seed/2147483647; })(12345);

            function softmax(vec){ const m=Math.max(...vec); const ex=vec.map(v=>Math.exp(v-m)); const s=ex.reduce((a,b)=>a+b,0); return ex.map(e=>e/s); }
            function entropy(p){ return -p.reduce((a,b)=> a + (b>0? b*Math.log(b):0),0); }

            // Pre-defined mock token streams for each prompt (sequence of candidate sets)
            const MOCK_STREAMS = {
                'Generate a short JSON object describing a book.': [
                    ['{','{','{'],
                    ['"title"','"title"','"name"'], [':',':'], ['"Story"','"Tale"','"Book"'], [',',','],
                    ['"author"','"writer"'], [':',':'], ['"Alice"','"Bob"'], [','],
                    ['"year"','"published"'], [':',':'], ['2028','2027','2025'], [','],
                    ['"genre"','"category"'], [':',':'], ['"Fiction"','"Novel"'],
                    ['}','}','}']
                ],
                'Explain in two sentences what beam search does.': [
                    ['Beam','Beam','Beam'], ['search','search','search'], [' ',' '], ['expands','extends','explores'], [' ',' '], ['multiple','several','parallel'], [' ',' '], ['candidate','partial','token'], [' ',' '], ['sequences','paths','branches'], [' ',' '], ['at','at'], [' ',' '], ['each','every'], [' ',' '], ['step','.','.'], [' ',' '], ['It','It','It'], [' ',' '], ['keeps','retains','scores'], [' ',' '], ['the','the'], [' ',' '], ['highest','best','top'], ['-'], ['scoring','probability','ranked'], [' ',' '], ['hypotheses','candidates','paths'], ['.']
                ],
                'Write a haiku about entropy.': [
                    ['Soft','Slow','Still'], [' ',' '], ['order','patterns','structure'], [' ',' '], ['melts','fades','drifts'], ['\n'], ['Hidden','Quiet','Silent'], [' '], ['measure','whisper','count'], [' '], ['of','of'], [' '], ['change','chaos','time'], ['\n'], ['Stars','Heat','Time'], [' '], ['cool','expand','dissipate'], ['.']
                ],
                'Return a JSON array of three fruits.': [
                    ['[','['], ['"','"'], ['apple','apple','pear'], ['"'], [','], ['"'], ['banana','banana','melon'], ['"'], [','], ['"'], ['orange','orange','grape'], ['"'], [']']
                ],
                'List three bullet points about overfitting.': [
                    ['-','-','-'], [' ',' '], ['Overfitting','Overfitting','Overfitting'], [' ',' '], ['means','means','means'], [' ',' '], ['memorizing','memorizing','remembering'], [' ',' '], ['noise','noise','details'], ['\n'],
                    ['-'], [' '], ['Poor','Poor','Weak'], [' ',' '], ['generalization','generalization','transfer'], [' ',' '], ['to','to'], [' ',' '], ['new','unseen','fresh'], [' ',' '], ['data','data','samples'], ['\n'],
                    ['-'], [' '], ['Use','Apply'], [' ',' '], ['regularization','regularization','reg'], [','], [' ',' '], ['early','early'], [' ',' '], ['stopping','stopping']
                ],
                'Generate a short JSON object describing a user.': [
                    ['{','{','{'], ['"id"','"id"'], [':',':'], ['"u123"','"u124"'], [','],
                    ['"role"','"role"','"type"'], [':',':'], ['"admin"','"user"','"member"'], [','],
                    ['"active"','"active"'], [':',':'], ['true','true','false'], [','],
                    ['"score"','"score"'], [':',':'], ['42','41','40'],
                    ['}','}','}']
                ],
                'Write a two-line rhyme about gradients.': [
                    ['Smooth','Steep','Gentle'], [' '], ['gradients','gradients','slopes'], [' '], ['guide','carry','drive'], [' '], ['the','the'], [' '], ['descent','updates','search'], ['\n'],
                    ['Tiny','Small','Sparse'], [' '], ['steps','nudges','moves'], [' '], ['help','let','make'], [' '], ['our','a'], [' '], ['net','model','system'], [' '], ['converge','settle','align'], ['.']
                ]
            };

            function pickToken(candidates){ // deterministic weighted pick using synthetic logits
                const logits = candidates.map((_,i)=> 1.2 - i*0.4 + (rnd()-0.5)*0.2); // decreasing
                const probs = softmax(logits);
                // choose argmax for determinism but record probability
                let idx = probs.indexOf(Math.max(...probs));
                return { token: candidates[idx], p: probs[idx], entropy: entropy(probs)};
            }

            function ngramRepeats(tokens, n){ if(tokens.length < n*2) return 0; const last = tokens.slice(-n).join(' '); let count=0; for(let i=0;i<=tokens.length-n;i++){ if(tokens.slice(i,i+n).join(' ')===last) count++; } return count; }
            function balancedJSON(text){ let depth=0; for(const c of text){ if(c==='{' ) depth++; else if(c==='}') depth--; if(depth<0) return false; } return depth===0; }
            function anyStopSequence(text, stops){ for(const s of stops){ if(!s) continue; if(text.endsWith(s)) return s; } return null; }

            function formatStatus(map){ statusEl.innerHTML = Object.entries(map).map(([k,v])=> `<div class=\"p-2 rounded border text-[10px] ${v.active? 'bg-green-50 border-green-300':'bg-gray-50 border-gray-200'}\">
                <div class=\"font-semibold mb-0.5\">${k}</div>
                <div class=\"font-mono\">${v.msg}</div>
            </div>`).join(''); }

            function simulate(){
                tableBody.innerHTML=''; outcomeEl.textContent=''; explanationEl.textContent='';
                const prompt = promptSel.value;
                const plan = MOCK_STREAMS[prompt];
                const maxTokens = parseInt(maxRange.value,10);
                let rawStops;
                if(stopsSelect.value === 'none') {
                    rawStops = [];
                } else {
                    rawStops = stopsSelect.value.split(',');
                }
                const stops = rawStops.map(s=>s.replace(/\\n/g,'\n').trim()).filter(Boolean).sort((a,b)=> b.length - a.length);
                const n = parseInt(ngramSel.value,10);
                const maxRepeats = parseInt(repeatSel.value,10);
                const entLimit = parseFloat(entropyTh.value)||0;
                const requireJSON = jsonGuard.checked && /json|array|object|book/i.test(prompt);

                let tokens=[]; let fullText=''; let stopReason=null; let firedCriterion=null;
                const statusMap = {
                    'EOS / Natural End': {active:false,msg:'pending'},
                    'Max Tokens': {active:true,msg:`limit ${maxTokens}`},
                    'Stop Sequence': {active:stops.length>0,msg: stops.length? stops.join('|'):'(none)'},
                    'Repetition': {active:true,msg:`${n}-gram ≤ ${maxRepeats}`},
                    'Entropy Floor': {active: entLimit>0,msg: entLimit>0?`≥ ${entLimit.toFixed(1)}`:'disabled'},
                    'JSON Balance': {active: requireJSON,msg: requireJSON? 'must balance':'disabled'}
                };
                formatStatus(statusMap);

                for(let step=0; step < plan.length && step < maxTokens; step++){
                    const picked = pickToken(plan[step]);
                    tokens.push(picked.token);
                    fullText += picked.token;

                    // Derive natural end (heuristic): punctuation + length
                    if(/\.$/.test(fullText) && step>4 && !stopReason){ stopReason='Sentence end'; firedCriterion='EOS / Natural End'; }
                    // Stop sequence match
                    const seq = anyStopSequence(fullText,stops);
                    if(seq && !stopReason){ stopReason=`Stop sequence '${seq}'`; firedCriterion='Stop Sequence'; }
                    // Repetition detection
                    if(!stopReason){ const reps = ngramRepeats(tokens,n); if(reps>maxRepeats){ stopReason=`${n}-gram repetition`; firedCriterion='Repetition'; } }
                    // Entropy threshold
                    if(!stopReason && entLimit>0 && picked.entropy < entLimit){ stopReason=`Entropy ${picked.entropy.toFixed(2)} < ${entLimit}`; firedCriterion='Entropy Floor'; }
                    // JSON balance (only allow stop if balanced & already emitted at least one brace)
                    if(!stopReason && requireJSON){ if(balancedJSON(fullText) && fullText.includes('{')){ stopReason='Balanced JSON'; firedCriterion='JSON Balance'; } }
                    // Max tokens (applied after other checks)
                    if(step===maxTokens-1 && !stopReason){ stopReason='Token budget hit'; firedCriterion='Max Tokens'; }

                    const tr=document.createElement('tr');
                    tr.innerHTML = `<td class=\"px-2 py-1 text-gray-600\">${step+1}</td>
                        <td class=\"px-2 py-1 font-mono\">${picked.token.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'↵')}</td>
                        <td class=\"px-2 py-1 text-gray-700\">${picked.p.toFixed(2)}</td>
                        <td class=\"px-2 py-1 text-gray-700\">${picked.entropy.toFixed(2)}</td>
                        <td class=\"px-2 py-1 ${stopReason && firedCriterion!=='Max Tokens' ? 'text-indigo-700 font-medium':''}\">${stopReason? stopReason:''}</td>`;
                    if(stopReason) tr.classList.add('bg-indigo-50');
                    tableBody.appendChild(tr);

                    if(stopReason) break;
                }
                tokenCountEl.textContent = `${tokens.length} token(s)`;
                // Update status map with result
                Object.entries(statusMap).forEach(([k,obj])=>{ if(k===firedCriterion){ obj.msg = `✅ ${stopReason}`; obj.active=true; } else if(obj.msg==='pending') { obj.msg='not used'; } });
                formatStatus(statusMap);
                outcomeEl.innerHTML = firedCriterion ? `<span class=\"text-indigo-700\">Stopped by: <strong>${firedCriterion}</strong></span>` : '<span class=\"text-gray-600\">No criterion fired (stream exhausted)</span>';
                explanationEl.innerHTML = `<strong>Interpretation:</strong> This run emitted <code>${tokens.length}</code> tokens. Primary stop: <code>${firedCriterion||'none'}</code>. Adjust parameters and re‑run to observe different termination points.`;
                if(/book/i.test(prompt) && requireJSON && firedCriterion !== 'JSON Balance' && !/}\s*$/.test(fullText)){
                    explanationEl.innerHTML += ` <span class=\"text-red-700 font-medium\">Note:</span> JSON not closed because an earlier criterion (e.g. entropy or repetition) fired before the closing brace. Lower entropy bound or increase max tokens to allow structural completion.`;
                }
            }

            maxRange.addEventListener('input', ()=>{ maxVal.textContent=maxRange.value; });
            entropyTh.addEventListener('input', ()=>{ entropyVal.textContent = parseFloat(entropyTh.value).toFixed(1); });
            // initialize entropy display
            entropyVal.textContent = parseFloat(entropyTh.value).toFixed(1);

            function updateHints(){
                if(jsonGuard.checked){
                    const ent=parseFloat(entropyTh.value)||0;
                    if(ent>0){
                        jsonHint.textContent = 'Note: entropy check runs before JSON balance – a high threshold may stop earlier (lower entropy = more certainty).';
                    } else {
                        jsonHint.textContent = 'JSON balance will trigger once braces are balanced (if no earlier criterion fires).';
                    }
                } else {
                    jsonHint.textContent='';
                }
            }
            jsonGuard.addEventListener('change', updateHints);
            entropyTh.addEventListener('input', updateHints);
            updateHints();
            // Custom stop sequence input removed (simplified)
            runBtn.addEventListener('click', simulate);
            // initial run
            simulate();
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
} else if (typeof window !== 'undefined') {
    window.question55 = question;
}
