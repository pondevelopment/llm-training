const interactiveScript = () => {
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

            function formatStatus(map){
                statusEl.innerHTML = Object.entries(map).map(([key,value])=> {
                    const fired = typeof value.msg === 'string' && value.msg.includes('✅');
                    let blockClass = 'panel panel-neutral-soft p-2 space-y-1';
                    if(fired){
                        blockClass = 'panel panel-success panel-emphasis p-2 space-y-1';
                    } else if(value.active){
                        blockClass = 'panel panel-neutral p-2 space-y-1';
                    }
                    const valueClass = fired ? 'font-mono text-heading' : value.active ? 'font-mono text-body' : 'font-mono text-muted';
                    return `<div class=\"${blockClass}\">
                <div class=\"font-semibold text-heading\">${key}</div>
                <div class=\"${valueClass}\">${value.msg}</div>
            </div>`;
                }).join('');
            }

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
                    const reasonClass = stopReason && firedCriterion!=='Max Tokens' ? 'text-info font-medium' : 'text-muted';
                    tr.innerHTML = `<td class=\"px-2 py-1 font-mono text-muted\">${step+1}</td>
                        <td class=\"px-2 py-1 font-mono text-heading\">${picked.token.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'↵')}</td>
                        <td class=\"px-2 py-1 text-secondary\">${picked.p.toFixed(2)}</td>
                        <td class=\"px-2 py-1 text-secondary\">${picked.entropy.toFixed(2)}</td>
                        <td class=\"px-2 py-1 ${reasonClass}\">${stopReason? stopReason:''}</td>`;
                    if(stopReason) tr.classList.add('bg-subtle');
                    tableBody.appendChild(tr);

                    if(stopReason) break;
                }
                tokenCountEl.textContent = `${tokens.length} token(s)`;
                // Update status map with result
                Object.entries(statusMap).forEach(([k,obj])=>{ if(k===firedCriterion){ obj.msg = `✅ ${stopReason}`; obj.active=true; } else if(obj.msg==='pending') { obj.msg='not used'; } });
                formatStatus(statusMap);
                outcomeEl.innerHTML = firedCriterion ? `<span class=\"text-info\">Stopped by: <strong>${firedCriterion}</strong></span>` : '<span class=\"text-muted\">No criterion fired (stream exhausted)</span>';
                explanationEl.innerHTML = `<strong>Interpretation:</strong> This run emitted <code>${tokens.length}</code> tokens. Primary stop: <code>${firedCriterion||'none'}</code>. Adjust parameters and re‑run to observe different termination points.`;
                if(/book/i.test(prompt) && requireJSON && firedCriterion !== 'JSON Balance' && !/}\s*$/.test(fullText)){
                    explanationEl.innerHTML += ` <span class=\"text-danger font-medium\">Note:</span> JSON not closed because an earlier criterion (e.g. entropy or repetition) fired before the closing brace. Lower entropy bound or increase max tokens to allow structural completion.`;
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question55Interactive = interactiveScript;
}
