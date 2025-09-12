// Question 56: When should I use Fine-tuning instead of RAG?
const question = {
  title: "56. When should I use Fine-tuning instead of RAG?",
  answer: `<div class="space-y-4">
    <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
      <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
      <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
  <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-04">Question 4: LoRA vs QLoRA</a></li>
  <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-13">Question 13: Prompt engineering</a></li>
  <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-14">Question 14: Catastrophic forgetting</a></li>
  <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-34">Question 34: Foundation model adaptation modes</a></li>
  <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-36">Question 36: Retrieval-Augmented Generation (RAG)</a></li>
  <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-49">Question 49: What defines an LLM?</a></li>
      </ul>
    </div>
    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 space-y-2">
      <h4 class="font-semibold text-blue-900">🔍 Core Question</h4>
      <p class="text-sm text-blue-800 leading-relaxed"><strong>You should NOT fine-tune by default.</strong> Move upward through adaptation steps: better prompting → retrieval (RAG) → lightweight parameter adaptation (adapters / LoRA) → **full or targeted fine-tuning** only if persistent, structural, or distributional gaps remain and retrieval cannot bridge them efficiently.</p>
    </div>
    <div class="grid md:grid-cols-4 gap-4 text-sm">
      <div class="bg-white p-3 rounded border-l-4 border-emerald-400">
        <h5 class="font-medium text-emerald-800 mb-1">Prompting</h5>
        <p class="text-xs text-emerald-700 leading-snug">Fast iteration. Great for style & task framing. Weak on private / large corpora.</p>
      </div>
      <div class="bg-white p-3 rounded border-l-4 border-indigo-400">
        <h5 class="font-medium text-indigo-800 mb-1">RAG</h5>
        <p class="text-xs text-indigo-700 leading-snug">Fresh facts & proprietary knowledge via retrieval. Needs high hit rate + grounding.</p>
      </div>
      <div class="bg-white p-3 rounded border-l-4 border-purple-400">
        <h5 class="font-medium text-purple-800 mb-1">Adapters</h5>
        <p class="text-xs text-purple-700 leading-snug">Parameter‑efficient shaping: style, format, compliance layers.</p>
      </div>
      <div class="bg-white p-3 rounded border-l-4 border-rose-400">
        <h5 class="font-medium text-rose-800 mb-1">Full Fine-tune</h5>
        <p class="text-xs text-rose-700 leading-snug">Expensive & sticky. Use when distribution shift + stable domain + scale justify.</p>
      </div>
    </div>
    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <h4 class="font-semibold text-yellow-900 mb-2">🧭 Escalation Ladder</h4>
      <ol class="list-decimal ml-5 space-y-1 text-yellow-800 text-sm">
        <li>Prompt engineering + response format exemplars</li>
        <li>Introduce retrieval (chunking, rerank, grounding)</li>
        <li>Add adapters (LoRA) for consistent style / schema</li>
        <li>Targeted fine-tune (narrow layers or SFT set)</li>
        <li>Hybrid: RAG + adapters + selective fine-tune</li>
      </ol>
    </div>
    <div class="bg-white border rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 mb-3">📊 Decision Signals (quick scan)</h4>
      <div class="grid md:grid-cols-2 gap-3 text-[12px]">
        <div class="p-3 rounded border bg-gray-50">
          <div class="flex items-center justify-between mb-1"><span class="font-medium text-gray-800">Fresh / rapidly changing facts</span><span class="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">RAG</span></div>
          <p class="text-gray-600 leading-snug">Prefer <strong>RAG</strong>. Fine-tuning lags updates; hybrid only if formatting/style also critical.</p>
        </div>
        <div class="p-3 rounded border bg-gray-50">
          <div class="flex items-center justify-between mb-1"><span class="font-medium text-gray-800">Stable proprietary corpus</span><span class="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700">Fine-tune</span></div>
          <p class="text-gray-600 leading-snug">If updates are infrequent & scale high, a targeted fine-tune (or hybrid) amortizes lookup cost.</p>
        </div>
        <div class="p-3 rounded border bg-gray-50">
          <div class="flex items-center justify-between mb-1"><span class="font-medium text-gray-800">Strict output schema / JSON</span><span class="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700">Adapter</span></div>
          <p class="text-gray-600 leading-snug">Start with <strong>adapter / constrained decoding</strong>; full fine-tune only if persistent structural errors remain.</p>
        </div>
        <div class="p-3 rounded border bg-gray-50">
          <div class="flex items-center justify-between mb-1"><span class="font-medium text-gray-800">Ultra low latency (&lt;300ms)</span><span class="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Prompt</span></div>
          <p class="text-gray-600 leading-snug">Avoid extra retrieval hops. Cache + distilled / adapter variants; hybrid only if facts must stay fresh.</p>
        </div>
        <div class="p-3 rounded border bg-gray-50">
          <div class="flex items-center justify-between mb-1"><span class="font-medium text-gray-800">Per‑user personalization</span><span class="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700">Fine-tune / Hybrid</span></div>
          <p class="text-gray-600 leading-snug">High granularity personalization often needs <strong>adapter stacks or selective fine-tune</strong>.</p>
        </div>
        <div class="p-3 rounded border bg-gray-50">
          <div class="flex items-center justify-between mb-1"><span class="font-medium text-gray-800">Massive query volume</span><span class="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700">Fine-tune</span></div>
          <p class="text-gray-600 leading-snug">Per‑query retrieval cost dominates at scale; <strong>model-internalization</strong> can lower marginal latency.</p>
        </div>
        <div class="p-3 rounded border bg-gray-50 md:col-span-2">
          <div class="flex items-center justify-between mb-1"><span class="font-medium text-gray-800">Mitigate hallucinations</span><span class="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">RAG / Hybrid</span></div>
          <p class="text-gray-600 leading-snug">Ground facts with retrieval first. Fine-tune helps style & refusal patterns but <strong>does not replace grounding</strong>.</p>
        </div>
      </div>
      <p class="text-[11px] text-gray-500 mt-3">Heuristic cues; validate with quantitative evals before investing in training runs.</p>
    </div>
    <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
      <h4 class="font-semibold text-emerald-900 mb-2">✅ Metrics Before Fine-tuning</h4>
      <ul class="text-sm text-emerald-800 space-y-1">
        <li><strong>Retrieval hit rate</strong> ≥ 75%? If not, fix retrieval first.</li>
        <li><strong>Grounded answer rate</strong> ≥ 80%? If low with good hit rate → synthesis layer issue.</li>
        <li><strong>Domain perplexity ratio</strong> > 1.3 vs base → indicates distribution gap.</li>
        <li><strong>Format error rate</strong> > 10% → consider adapter / constrained decoding.</li>
        <li><strong>Personalization value</strong>: measurable uplift (≥15%) from user/cohort context?</li>
      </ul>
    </div>
    <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
      <h4 class="font-semibold text-red-900 mb-2">⚠️ Pitfalls</h4>
      <ul class="text-sm text-red-800 space-y-1">
        <li>Premature fine-tune for volatile knowledge (better: RAG updates).</li>
        <li>Ignoring retrieval diagnostics before blaming the model.</li>
        <li>Adapter stacking without marginal gain measurement.</li>
        <li>Full fine-tune causing narrow over-specialization.</li>
        <li>No holdout eval harness → silent regression risk.</li>
      </ul>
    </div>
  </div>`,
  interactive: {
    title: "🧪 Adaptation Strategy Recommender",
    html: `<div class=\"space-y-6\">
      <div class=\"bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200\">
        <p class=\"text-xs text-indigo-800 mb-2\">Adjust scenario parameters; heuristic engine proposes an adaptation strategy and next steps.</p>
        <div class=\"grid md:grid-cols-2 gap-4 text-xs\">
          <div class=\"space-y-3\">
            <label class=\"block\">Domain shift severity <span id=\"q56-domain-val\" class=\"font-mono\">0%</span><input id=\"q56-domain\" type=\"range\" min=\"0\" max=\"100\" value=\"30\" class=\"w-full\" /><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>Low</strong>: base model already speaks domain. <strong>High</strong>: vocabulary / style / concepts differ → adapters or FT once retrieval is solid.</span></label>
            <label class=\"block\">Proprietary knowledge share <span id=\"q56-prop-val\" class=\"font-mono\">0%</span><input id=\"q56-prop\" type=\"range\" min=\"0\" max=\"100\" value=\"50\" class=\"w-full\" /><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>Low</strong>: public knowledge suffices. <strong>High</strong>: answers rely on internal corpus → internalization (selective FT) gains if corpus stable.</span></label>
            <label class=\"block\">Retrieval hit rate <span id=\"q56-hit-val\" class=\"font-mono\">0%</span><input id=\"q56-hit\" type=\"range\" min=\"0\" max=\"100\" value=\"65\" class=\"w-full\" /><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>&lt;60%</strong>: retrieval pipeline weak → fix before tuning model. <strong>&gt;80%</strong>: retrieval quality likely not bottleneck.</span></label>
            <label class=\"block\">Grounded answer rate <span id=\"q56-ground-val\" class=\"font-mono\">0%</span><input id=\"q56-ground\" type=\"range\" min=\"0\" max=\"100\" value=\"70\" class=\"w-full\" /><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>Low vs high hit</strong>: synthesis / prompt issue. <strong>Both low</strong>: retrieval pipeline issue. <strong>High</strong>: stable base for considering adapters / FT.</span></label>
            <label class=\"block\">Latency target<select id=\"q56-latency\" class=\"w-full border rounded px-2 py-1 mt-1\"><option value=\"fast\"><300ms</option><option value=\"moderate\" selected><800ms</option><option value=\"flex\">Flexible</option></select><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong><300ms</strong>: near real-time UX (chat assist, inline editor) leaves little budget for retrieval chain. <strong><800ms</strong>: moderate—RAG + light rerank okay. <strong>Flexible</strong>: latency less critical → can afford multi-hop / complex retrieval.</span></label>
          </div>
          <div class=\"space-y-3\">
            <label class=\"block\">Update frequency<select id=\"q56-update\" class=\"w-full border rounded px-2 py-1 mt-1\"><option value=\"hourly\">Hourly</option><option value=\"daily\">Daily</option><option value=\"weekly\" selected>Weekly</option><option value=\"monthly\">Monthly</option><option value=\"quarterly\">Quarterly+</option></select><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>Hourly/Daily</strong>: RAG essential; fine-tune stale fast. <strong>Weekly</strong>: hybrid possible. <strong>Monthly+</strong>: knowledge stable enough to justify selective fine-tune.</span></label>
            <label class=\"block\">Personalization<select id=\"q56-personal\" class=\"w-full border rounded px-2 py-1 mt-1\"><option value=\"none\">None</option><option value=\"cohort\" selected>Cohort</option><option value=\"user\">Per-user</option></select><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>None</strong>: identical output for everyone. <strong>Cohort</strong>: a few segment prompts (e.g. region, plan tier). <strong>Per‑user</strong>: unique preferences / histories → usually needs adapter layering; full FT only if patterns are stable & high value.</span></label>
            <label class=\"block\">Format rigidity<select id=\"q56-format\" class=\"w-full border rounded px-2 py-1 mt-1\"><option value=\"loose\">Loose prose</option><option value=\"semi\" selected>Semi-structured</option><option value=\"strict\">Strict schema</option></select><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>Loose</strong>: narrative output; prompting usually enough. <strong>Semi</strong>: lists / light JSON—add exemplars + validator. <strong>Strict</strong>: machine-consumable schema → adapters / constrained decoding → maybe FT if persistent errors.</span></label>
            <label class=\"block\">Query volume<select id=\"q56-volume\" class=\"w-full border rounded px-2 py-1 mt-1\"><option value=\"low\">Low</option><option value=\"med\" selected>Medium</option><option value=\"high\">High</option></select><span class=\"block text-[10px] text-gray-500 mt-0.5\"><strong>Low</strong>: optimize manually first; training unlikely ROI. <strong>Medium</strong>: watch latency & retrieval cost curves. <strong>High</strong>: marginal cost dominates → internalization / distillation gains matter.</span></label>
            <div class=\"text-[10px] text-gray-500 mt-2 text-center\">Auto-updates on change</div>
          </div>
        </div>
      </div>
      <div class=\"grid md:grid-cols-3 gap-4\">
        <div class=\"bg-white border rounded p-3 space-y-2\">
          <h5 class=\"font-semibold text-gray-800 text-sm\">📈 Pressure Profile</h5>
          <div id=\"q56-pressures\" class=\"space-y-1 text-[11px]\"></div>
        </div>
        <div class=\"bg-white border rounded p-3 space-y-2\">
          <h5 class=\"font-semibold text-gray-800 text-sm\">🎯 Recommendation</h5>
          <div id=\"q56-reco\" class=\"text-xs text-gray-700 space-y-1\"></div>
        </div>
        <div class=\"bg-yellow-50 border border-yellow-200 rounded p-3 space-y-2\">
          <h5 class=\"font-semibold text-yellow-900 text-sm\">🛠 Next Experiments</h5>
          <ul id=\"q56-next\" class=\"text-[11px] text-yellow-800 space-y-1 list-disc ml-4\"></ul>
        </div>
      </div>
      <div id=\"q56-rationale\" class=\"bg-gray-50 border border-gray-200 rounded p-3 text-[11px] text-gray-700\"></div>
    </div>`,
    script: () => {
      const $ = id => document.getElementById(id);
      const inputs = {
        domain: $('q56-domain'), domainVal: $('q56-domain-val'),
        prop: $('q56-prop'), propVal: $('q56-prop-val'),
        hit: $('q56-hit'), hitVal: $('q56-hit-val'),
        ground: $('q56-ground'), groundVal: $('q56-ground-val'),
        latency: $('q56-latency'), update: $('q56-update'),
  personal: $('q56-personal'), format: $('q56-format'), volume: $('q56-volume')
      };
      const pressuresEl = $('q56-pressures');
      const recoEl = $('q56-reco');
      const nextEl = $('q56-next');
      const rationaleEl = $('q56-rationale');
  // copy button removed for simplicity

      function mapLatency(v){ return v==='fast'?0.8: v==='moderate'?0.5:0.2; }
      function mapFormat(v){ return v==='strict'?0.8: v==='semi'?0.5:0.2; }
      function mapPersonal(v){ return v==='user'?0.8: v==='cohort'?0.5:0.1; }
      function mapVolume(v){ return v==='high'?0.7: v==='med'?0.5:0.3; }
      function mapUpdate(v){ return v==='hourly'?0.1: v==='daily'?0.25: v==='weekly'?0.4: v==='monthly'?0.55:0.7; }

      function computePressures(){
        const domainGap = parseInt(inputs.domain.value,10)/100;
        const proprietary = parseInt(inputs.prop.value,10)/100;
        const hit = parseInt(inputs.hit.value,10)/100;
        const ground = parseInt(inputs.ground.value,10)/100;
        const retrievalAdequacy = (hit*0.6 + ground*0.4); // quality of current RAG
        return {
          domainGap,
          proprietary,
          structure: mapFormat(inputs.format.value),
          latency: mapLatency(inputs.latency.value),
            personalization: mapPersonal(inputs.personal.value),
          volume: mapVolume(inputs.volume.value),
          updateStability: mapUpdate(inputs.update.value), // higher = less frequent updates
          retrievalAdequacy
        };
      }

      function bar(label,val){ const pct=Math.round(val*100); const color = val>0.66?'bg-indigo-600': val>0.4?'bg-indigo-400':'bg-indigo-200'; return `<div><div class=\"flex justify-between\"><span>${label}</span><span class=\"font-mono\">${pct}%</span></div><div class=\"h-2 bg-gray-200 rounded overflow-hidden\"><div class=\"h-full ${color}\" style=\"width:${pct}%\"></div></div></div>`; }

      function recommend(p){
        const reasons=[]; let primary='RAG Optimization'; let secondary='Prompt + Retrieval'; const next=[]; const trace=[];
        // Threshold booleans
        const retrievalWeak = p.retrievalAdequacy < 0.6; trace.push({id:'retrievalWeak', fired: retrievalWeak, detail:`retrievalAdequacy ${pct(p.retrievalAdequacy)} < 60%`});
        const highStructure = p.structure > 0.7; trace.push({id:'highStructure', fired: highStructure, detail:`structure ${pct(p.structure)} > 70%`});
        const highProprietary = p.proprietary > 0.7; trace.push({id:'highProprietary', fired: highProprietary, detail:`proprietary ${pct(p.proprietary)} > 70%`});
        const highDomain = p.domainGap > 0.6; trace.push({id:'highDomain', fired: highDomain, detail:`domainGap ${pct(p.domainGap)} > 60%`});
        const highPersonal = p.personalization > 0.6; trace.push({id:'highPersonal', fired: highPersonal, detail:`personalization ${pct(p.personalization)} > 60%`});
        const lowUpdate = p.updateStability > 0.55; trace.push({id:'lowUpdate', fired: lowUpdate, detail:`updateStability ${pct(p.updateStability)} > 55% (infrequent updates)`});
        const latencyHigh = p.latency>0.7; trace.push({id:'latencyHigh', fired: latencyHigh, detail:`latency pressure ${pct(p.latency)} > 70%`});

        if(retrievalWeak){ reasons.push('Retrieval adequacy low → improve RAG first (chunking, rerank, filters).'); next.push('Tune retriever embeddings','Improve chunk segmentation','Add reranker','Instrument hit rate'); }
        if(highStructure && !retrievalWeak){ primary='Adapter (LoRA) + RAG'; reasons.push('High format rigidity → structured adapters helpful.'); next.push('Add output schema validator','Train format LoRA'); }
        if(highProprietary && highDomain && lowUpdate && !retrievalWeak){ primary='Targeted Fine-tune'; secondary='Hybrid (RAG + Adapter)'; reasons.push('Stable, high proprietary + domain gap → fine-tune justified.'); next.push('Assemble high-quality SFT set','Add eval harness pre/post'); }
        else if(highProprietary && lowUpdate && !retrievalWeak){
          // Proprietary alone (stable) still a driver for internalization when retrieval already decent
          if(primary==='RAG Optimization') primary='Selective Fine-tune (Focus Proprietary Segments)';
          reasons.push('High stable proprietary share → internalization can reduce per-query retrieval overhead.');
          next.push('Quantify cost vs latency benefit of internalization','Sample proprietary examples for SFT set curation');
        }
        if(highProprietary && retrievalWeak){
          reasons.push('High proprietary share but retrieval weak → postpone fine-tune until retrieval adequacy improves.');
        }
        if(highPersonal){ if(primary==='RAG Optimization') primary='Hybrid (Personalized Adapter + RAG)'; reasons.push('High personalization need → lightweight per-cohort adapters.'); next.push('Segment users into cohorts','Collect preference signals'); }
        if(highDomain && !highProprietary && !retrievalWeak){ if(primary==='RAG Optimization') primary='Hybrid (RAG + Adapter)'; reasons.push('Domain language shift but not proprietary heavy → style adapter + RAG.'); }
        if(latencyHigh && primary.startsWith('RAG')){ reasons.push('Latency pressure → consider caching / partial fine-tune for hot paths.'); next.push('Cache frequent answers','Distill latency-critical path'); }

        // Multi high pressure combination
        const highCount = [p.structure,p.proprietary,p.domainGap,p.personalization].filter(v=>v>0.6).length;
        if(highCount>=3 && !retrievalWeak){ primary='Hybrid (RAG + Adapter + Selective FT)'; secondary='Phased fine-tune roadmap'; reasons.push('Multiple high-intensity drivers → layered hybrid strategy.'); trace.push({id:'comboHigh', fired:true, detail:`${highCount} high-pressure drivers ≥3`}); }
        else { trace.push({id:'comboHigh', fired:false, detail:`${highCount} high-pressure drivers <3`}); }

        if(reasons.length===0){ reasons.push('Inputs do not cross escalation thresholds → stay with prompt + RAG tuning.'); next.push('Refine system prompt','Add few-shot exemplars'); }

        // Deduplicate next steps
        const uniqNext=[...new Set(next)].slice(0,6);

        return { primary, secondary, reasons, next: uniqNext, trace };
      }

      function pct(v){ return Math.round(v*100)+'%'; }
      function classify(v){ return v>0.66?{label:'High',color:'bg-rose-100 text-rose-700 border-rose-200'}: v>0.4?{label:'Med',color:'bg-amber-100 text-amber-700 border-amber-200'}:{label:'Low',color:'bg-gray-100 text-gray-600 border-gray-200'}; }
      const pressureLabels = {domainGap:'Domain Gap', proprietary:'Proprietary', structure:'Structure', latency:'Latency', personalization:'Personalization', volume:'Volume', updateStability:'Update Stability', retrievalAdequacy:'Retrieval Adequacy'};

      function refresh(){
        // sync value labels
        inputs.domainVal.textContent = inputs.domain.value+"%";
        inputs.propVal.textContent = inputs.prop.value+"%";
        inputs.hitVal.textContent = inputs.hit.value+"%";
        inputs.groundVal.textContent = inputs.ground.value+"%";
        const p = computePressures();
        pressuresEl.innerHTML = [
          bar('Domain Gap',p.domainGap),
          bar('Proprietary',p.proprietary),
          bar('Structure',p.structure),
          bar('Latency',p.latency),
          bar('Personalization',p.personalization),
          bar('Volume',p.volume),
          bar('Update Stability',p.updateStability),
          bar('Retrieval Adequacy',p.retrievalAdequacy)
        ].join('');
        const rec = recommend(p);
        recoEl.innerHTML = `<div class=\"text-indigo-700 font-semibold\">${rec.primary}</div>` + (rec.secondary? `<div class=\"text-[11px] text-gray-600\">Secondary: ${rec.secondary}</div>`:'') +
          `<div class=\"mt-2 text-[11px] leading-snug text-gray-700\"><strong>Why:</strong> ${rec.reasons.map(r=>`<span class=\"block\">• ${r}</span>`).join('')}</div>`;
        nextEl.innerHTML = rec.next.map(n=>`<li>${n}</li>`).join('');
        // Build reasoning trace table
        const chips = Object.keys(p).map(key=>{
          if(!(key in pressureLabels)) return ''; const cls=classify(p[key]);
          return `<div class=\"flex items-center justify-between text-[10px] px-2 py-1 border rounded ${cls.color}\"><span>${pressureLabels[key]}</span><span>${cls.label}</span></div>`;
        }).join('');
        const fired = rec.trace.filter(t=>t.fired).map(t=>`<li class=\"mb-0.5\"><code class=\"bg-gray-100 px-1 rounded\">${t.id}</code> → ${t.detail}</li>`).join('') || '<li>No escalation rules fired.</li>';
        const notFired = rec.trace.filter(t=>!t.fired).map(t=>`<li class=\"opacity-60\"><code class=\"bg-gray-50 px-1 rounded\">${t.id}</code> (${t.detail})</li>`).join('');
        rationaleEl.innerHTML = `<div class=\"font-semibold text-gray-800 mb-1\">Reasoning Trace</div><div class=\"grid md:grid-cols-4 gap-1 mb-3\">${chips}</div><div class=\"mb-2\"><span class=\"font-medium text-gray-700\">Triggered Rules</span><ul class=\"list-disc ml-5 mt-1\">${fired}</ul></div><details class=\"mt-2\"><summary class=\"cursor-pointer text-gray-600 text-[11px]\">Show non-triggered rules</summary><ul class=\"list-disc ml-5 mt-1 text-[11px] text-gray-500\">${notFired}</ul></details>`;
        latest = { inputs: collectRaw(), pressures: p, recommendation: { primary: rec.primary, secondary: rec.secondary }, rationale: rec.reasons, trace: rec.trace, next_steps: rec.next };
      }

      function collectRaw(){ return {
        domain_shift: parseInt(inputs.domain.value,10),
        proprietary_pct: parseInt(inputs.prop.value,10),
        retrieval_hit_rate: parseInt(inputs.hit.value,10),
        grounded_rate: parseInt(inputs.ground.value,10),
        latency: inputs.latency.value,
        update_frequency: inputs.update.value,
        personalization: inputs.personal.value,
        format: inputs.format.value,
        query_volume: inputs.volume.value
      }; }

      let latest=null;
  Object.values(inputs).forEach(el=>{ if(el && el.tagName){ el.addEventListener('input',refresh); el.addEventListener('change',refresh);} });
  // (copy removed)
      refresh();
    }
  }
};

if(typeof module !== 'undefined' && module.exports){ module.exports = question; } else if(typeof window !== 'undefined'){ window.question56 = question; }
