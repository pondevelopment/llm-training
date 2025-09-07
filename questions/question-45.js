// Question 45: How would you fix an LLM generating biased or incorrect outputs?
// Created: August 13, 2025
// Focus: Practical bias/error mitigation strategies and trade-offs

const question = {
  title: "45. How would you fix an LLM generating biased or incorrect outputs?",
  answer: `
    <div class="space-y-4">
      <!-- Recommended Reading (canonical) -->
      <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
        <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
        <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-13">Question 13: Prompt engineering techniques</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-40">Question 40: Retrieval grounding & knowledge integration</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-41">Question 41: Few-/zero-shot baselines & evaluation</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-17">Question 17: RLHF & preference optimization</a></li>
        </ul>
        <p class="mt-2 text-xs text-indigo-700">Guardrails, retrieval, evaluation baselines, and alignment tuning context.</p>
      </div>
      <!-- Key Idea (accent) -->
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <h4 class="font-semibold text-blue-900 mb-2">🧠 Core Idea</h4>
        <p class="text-sm text-blue-800">Bias/error mitigation is <b>layered</b>: surface controls (prompts / filters), data remediation & retrieval, then model-level alignment (SFT + RLHF/DPO). Combined layers yield durable reduction.</p>
        <div class="text-xs mt-2 text-blue-800">
          Residual risk intuition:
          <div class="math-display mt-1">$$
          r_{after} = r_0 \cdot \prod_{i} (1 - e_i),\quad 0 \le e_i \le 1
          $$</div>
          <ul class="mt-2 list-disc ml-5 space-y-1">
            <li><code class="font-mono">r_0</code>: base (pre‑mitigation) risk</li>
            <li><code class="font-mono">e_i</code>: effectiveness of strategy i</li>
            <li><code class="font-mono">r_{after}</code>: residual post-layering</li>
            <li>Higher severity ↓ marginal returns</li>
          </ul>
        </div>
      </div>
      <!-- Comparison Cards (accentified) -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
          <h5 class="font-medium text-green-900">🟢 Prompting & Guardrails</h5>
          <ul class="text-sm text-green-700 mt-1 space-y-1">
            <li>• Clear refusals & structure</li>
            <li>• Self-check / critique passes</li>
            <li>• Safety & moderation filters</li>
          </ul>
        </div>
        <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
          <h5 class="font-medium text-purple-900">🟣 Data & Retrieval</h5>
          <ul class="text-sm text-purple-700 mt-1 space-y-1">
            <li>• Balanced & counterfactual data</li>
            <li>• RAG factual grounding</li>
            <li>• Debias sampling / reweighting</li>
          </ul>
        </div>
        <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
          <h5 class="font-medium text-orange-900">🟠 Fine-tuning & RLHF</h5>
          <ul class="text-sm text-orange-700 mt-1 space-y-1">
            <li>• SFT curated policy data</li>
            <li>• DPO / RLHF preference shaping</li>
            <li>• Adversarial robustness training</li>
          </ul>
        </div>
      </div>
      <!-- Why This Matters (canonical) -->
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• <b>Fairness</b> & harm reduction</li>
          <li>• <b>Reliability</b> & factual integrity</li>
          <li>• <b>Compliance</b> & audit readiness</li>
          <li>• <b>Trust</b> via transparent controls</li>
        </ul>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Bias & Error Mitigation Planner",
  html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-amber-200\">
      <div class=\"flex flex-wrap items-center gap-2 mb-3 text-xs\">
            <span class=\"font-semibold text-gray-700 mr-1\">Presets:</span>
            <button data-q45-preset=\"guardrails\" class=\"px-2 py-0.5 rounded border border-amber-300 bg-white hover:bg-amber-100\" title=\"Prompt + filter only (fast)\">Quick guardrails</button>
            <button data-q45-preset=\"remediation\" class=\"px-2 py-0.5 rounded border border-amber-300 bg-white hover:bg-amber-100\" title=\"Data remediation focus\">Data remediation</button>
            <button data-q45-preset=\"factual\" class=\"px-2 py-0.5 rounded border border-amber-300 bg-white hover:bg-amber-100\" title=\"High-risk factual mitigation\">High‑risk factual</button>
            <button data-q45-preset=\"toxicity\" class=\"px-2 py-0.5 rounded border border-amber-300 bg-white hover:bg-amber-100\" title=\"Toxicity hardening\">Toxicity hardening</button>
            <button data-q45-preset=\"full\" class=\"px-2 py-0.5 rounded border border-amber-300 bg-white hover:bg-amber-100\" title=\"All strategies layered\">Full stack</button>
            <button id=\"q45-copy\" class=\"px-2 py-0.5 rounded border border-amber-400 bg-white hover:bg-amber-100 text-amber-700\">Copy link</button>
            <button id=\"q45-export\" class=\"px-2 py-0.5 rounded border border-amber-400 bg-white hover:bg-amber-100 text-amber-700\">Export</button>
          </div>
          <div class=\"grid md:grid-cols-12 gap-4 text-xs\">
            <div class=\"md:col-span-3\">
              <label class=\"font-semibold text-gray-700\">Failure type</label>
              <select id=\"q45-type\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"bias\" selected>Bias (stereotypes, unfair treatment)</option>
                <option value=\"factual\">Incorrect facts/hallucinations</option>
                <option value=\"toxicity\">Toxic/unsafe content</option>
              </select>
            </div>
            <div class=\"md:col-span-2\">
              <label class=\"font-semibold text-gray-700\">Severity</label>
              <input id=\"q45-sev\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.6\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q45-sev-val\" class=\"font-mono\">0.60</span></div>
            </div>
            <div class=\"md:col-span-2\">
              <label class=\"font-semibold text-gray-700\">Data quality</label>
              <input id=\"q45-data\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.5\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q45-data-val\" class=\"font-mono\">0.50</span></div>
            </div>
            <div class=\"md:col-span-5\">
              <label class=\"font-semibold text-gray-700\" title=\"Layer multiple complementary methods\">Strategies</label>
              <div class=\"grid grid-cols-3 gap-2 mt-1\" role=\"group\" aria-label=\"Mitigation strategies\">
                <label class=\"flex items-center gap-1\" title=\"Structured prompts, refusals, self-checks\"><input id=\"q45-s-prompt\" type=\"checkbox\" checked /> <span>Prompt guardrails</span></label>
                <label class=\"flex items-center gap-1\" title=\"Retrieve external evidence for factual grounding\"><input id=\"q45-s-rag\" type=\"checkbox\" /> <span>RAG grounding</span></label>
                <label class=\"flex items-center gap-1\" title=\"Augment / rebalance data to counter skew\"><input id=\"q45-s-augment\" type=\"checkbox\" checked /> <span>Data rebal/augment</span></label>
                <label class=\"flex items-center gap-1\" title=\"Toxicity & safety classifiers / regex filters\"><input id=\"q45-s-filter\" type=\"checkbox\" checked /> <span>Safety filter</span></label>
                <label class=\"flex items-center gap-1\" title=\"Supervised finetune on curated policy examples\"><input id=\"q45-s-sft\" type=\"checkbox\" /> <span>SFT fine-tune</span></label>
                <label class=\"flex items-center gap-1\" title=\"Align outputs to preferences / safety via feedback\"><input id=\"q45-s-rlhf\" type=\"checkbox\" /> <span>RLHF/DPO</span></label>
              </div>
            </div>
          </div>
          <p class=\"text-xs text-gray-600 mt-2\">Residual risk uses a multiplicative reduction model with diminishing returns at high severity and low data quality.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📉 Risk impact</h5>
            <div id=\"q45-bars\" class=\"text-xs text-gray-700 space-y-1\" aria-live=\"polite\"></div>
            <div class=\"text-xs text-gray-500 mt-1\">Top bar = base risk; second = residual after selected strategies.</div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q45-metrics\" class=\"text-xs text-gray-700 space-y-2\" aria-live=\"polite\"></div>
            <div id=\"q45-guidance\" class=\"mt-1 text-xs text-indigo-700 border-t pt-2\" aria-live=\"polite\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧠 Recommendation</h5>
            <div id=\"q45-explain\" class=\"text-xs text-gray-700\" aria-live=\"polite\"></div>
          </div>
        </div>
      </div>
    `,
    script: () => {
      const typeEl = document.getElementById('q45-type');
      const sevEl = document.getElementById('q45-sev');
      const dataEl = document.getElementById('q45-data');
      const sevVal = document.getElementById('q45-sev-val');
      const dataVal = document.getElementById('q45-data-val');

      const sPrompt = document.getElementById('q45-s-prompt');
      const sRAG = document.getElementById('q45-s-rag');
      const sAug = document.getElementById('q45-s-augment');
      const sFilter = document.getElementById('q45-s-filter');
      const sSFT = document.getElementById('q45-s-sft');
      const sRLHF = document.getElementById('q45-s-rlhf');

  const barsEl = document.getElementById('q45-bars');
  const metricsEl = document.getElementById('q45-metrics');
  const explainEl = document.getElementById('q45-explain');
  const guidanceEl = document.getElementById('q45-guidance');
  const copyBtn = document.getElementById('q45-copy');
  const exportBtn = document.getElementById('q45-export');
  const presetButtons = Array.from(document.querySelectorAll('[data-q45-preset]'));
      if (!typeEl) return;

      function clamp01(x){ return Math.min(1, Math.max(0, x)); }

      // Effectiveness priors per strategy and failure type
      function baseEffectiveness(strategy, type){
        const table = {
          bias:   { prompt:0.25, rag:0.10, augment:0.35, filter:0.20, sft:0.40, rlhf:0.45 },
          factual:{ prompt:0.20, rag:0.45, augment:0.10, filter:0.05, sft:0.30, rlhf:0.25 },
          toxicity:{ prompt:0.30, rag:0.05, augment:0.10, filter:0.55, sft:0.35, rlhf:0.40 }
        };
        return table[type][strategy] ?? 0.0;
      }

      function effectivenessAdjust(eff, severity, dataQuality){
        // Higher severity reduces marginal gains; better data amplifies data-dependent methods
        const sevPenalty = 1 - 0.5*severity; // up to -50%
        const dataBoost = 0.5 + 0.5*dataQuality; // 0.5..1.0 multiplier
        return clamp01(eff * sevPenalty * dataBoost);
      }

      function residualRisk(base, chosen, type, severity, dataQuality){
        let r = base;
        for (const [name, on] of Object.entries(chosen)){
          if (!on) continue;
          const eff0 = baseEffectiveness(name, type);
          const eff = effectivenessAdjust(eff0, severity, dataQuality);
          r *= (1 - eff);
        }
        return clamp01(r);
      }

      function costEstimate(chosen){
        // Rough cost/time scores (0..1)
        // tokenCost ~ inference overhead; trainCost ~ dataset+compute
        const weights = {
          prompt:{ token:0.1, train:0.0, time:0.1 },
          rag:{ token:0.3, train:0.1, time:0.3 },
          augment:{ token:0.0, train:0.3, time:0.4 },
          filter:{ token:0.05, train:0.05, time:0.2 },
          sft:{ token:0.0, train:0.6, time:0.6 },
          rlhf:{ token:0.0, train:0.8, time:0.8 }
        };
        let token=0, train=0, time=0;
        for (const [k,on] of Object.entries(chosen)){
          if (!on) continue;
          token += weights[k].token; train += weights[k].train; time += weights[k].time;
        }
        return { token, train, time };
      }

      function bar(label, val, color){
        const pct = Math.round(val*100);
        return `<div>
          <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${pct}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 rounded\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function badge(text, color){
        return `<span class=\"inline-block px-2 py-0.5 rounded text-white text-xs bg-${color}-600\">${text}</span>`;
      }

      function riskBadge(r){
        if (r <= 0.25) return badge('Low', 'emerald');
        if (r <= 0.5) return badge('Moderate', 'amber');
        return badge('High', 'rose');
      }

      function recommend(type, rAfter, costs, chosen){
        if (rAfter <= 0.25) return `${badge('Stable', 'emerald')} Layered plan acceptable; continue audits.`;
        const tips = [];
        if (type === 'factual' && !chosen.rag) tips.push('Add RAG for grounding.');
        if (type === 'bias' && !chosen.augment) tips.push('Augment / rebalance data.');
        if (type === 'toxicity' && !chosen.filter) tips.push('Strengthen safety filtering.');
        if (rAfter > 0.5 && !chosen.sft) tips.push('Add SFT with curated policy set.');
        if (rAfter > 0.5 && !chosen.rlhf) tips.push('Introduce RLHF/DPO for preference alignment.');
        if (!tips.length) tips.push('Refine prompts & targeted evals for remaining edge cases.');
        return tips.join(' ');
      }

      function render(){
        const type = typeEl.value; 
        const severity = parseFloat(sevEl.value); 
        const dataQ = parseFloat(dataEl.value);
        sevVal.textContent = severity.toFixed(2);
        dataVal.textContent = dataQ.toFixed(2);

        const chosen = {
          prompt: sPrompt.checked,
          rag: sRAG.checked,
          augment: sAug.checked,
          filter: sFilter.checked,
          sft: sSFT.checked,
          rlhf: sRLHF.checked
        };

        const r0 = 0.7 * (0.5 + 0.5*severity); // higher severity => higher base risk
        const rAfter = residualRisk(r0, chosen, type, severity, dataQ);
        const costs = costEstimate(chosen);

        barsEl.innerHTML = bar('Base risk', r0, 'rose') +
                           '<div class="h-1"></div>' +
                           bar('Residual risk', rAfter, 'emerald');

        metricsEl.innerHTML = `
          <div class=\"flex items-center gap-2\"><span>Residual risk:</span> ${riskBadge(rAfter)} <span class=\"font-mono\">${(rAfter*100).toFixed(1)}%</span></div>
          <div>Type: <span class=\"font-mono\">${type}</span> | Severity: <span class=\"font-mono\">${severity.toFixed(2)}</span> | Data: <span class=\"font-mono\">${dataQ.toFixed(2)}</span></div>
          <div>Risk reduction: <span class=\"font-mono\">${((r0 - rAfter)*100).toFixed(1)}%</span></div>
          <div>Costs — token: <span class=\"font-mono\">${costs.token.toFixed(2)}</span>, train: <span class=\"font-mono\">${costs.train.toFixed(2)}</span>, time: <span class=\"font-mono\">${costs.time.toFixed(2)}</span></div>
        `;

        explainEl.innerHTML = `
          <div class=\"space-y-2\">
            <div><b>Layered controls.</b> Prompt guardrails + filters = immediate surface reduction; RAG & data remediation improve factual / representational base; SFT/RLHF consolidate durable policy.</div>
            <div>Model: <span class=\"font-mono\">r_after = r0 · ∏ (1 - e_i)</span>; each <span class=\"font-mono\">e_i</span> shrinks under high severity or weak data.</div>
            <div class=\"text-xs text-gray-600\">Heuristic only — validate with audits, bias metrics, & red-teaming.</div>
          </div>
        `;
        if (guidanceEl) guidanceEl.textContent = recommend(type, rAfter, costs, chosen);

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [typeEl, sevEl, dataEl, sPrompt, sRAG, sAug, sFilter, sSFT, sRLHF].forEach(el => {
        el.addEventListener('input', render);
        el.addEventListener('change', render);
      });
      // Presets
      function applyPreset(name){
        // Reset all first
        function setStrategies(obj){
          sPrompt.checked = !!obj.prompt; sRAG.checked = !!obj.rag; sAug.checked = !!obj.augment; sFilter.checked = !!obj.filter; sSFT.checked = !!obj.sft; sRLHF.checked = !!obj.rlhf;
        }
        if(name==='guardrails'){
          typeEl.value='bias'; sevEl.value='0.5'; dataEl.value='0.6'; setStrategies({prompt:1, filter:1});
        } else if(name==='remediation'){
          typeEl.value='bias'; sevEl.value='0.6'; dataEl.value='0.3'; setStrategies({prompt:1, augment:1, filter:1});
        } else if(name==='factual'){
          typeEl.value='factual'; sevEl.value='0.8'; dataEl.value='0.5'; setStrategies({prompt:1, rag:1, filter:1, sft:1});
        } else if(name==='toxicity'){
          typeEl.value='toxicity'; sevEl.value='0.7'; dataEl.value='0.6'; setStrategies({prompt:1, filter:1, rlhf:1});
        } else if(name==='full'){
          typeEl.value='bias'; sevEl.value='0.6'; dataEl.value='0.5'; setStrategies({prompt:1, rag:1, augment:1, filter:1, sft:1, rlhf:1});
        }
        render();
      }
      presetButtons.forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.getAttribute('data-q45-preset'))));

      // Permalink copy (#question-45?type=..&sev=..&data=..&prompt=1&...)
      copyBtn?.addEventListener('click', ()=>{
        const params = new URLSearchParams({
          type: typeEl.value,
          sev: sevEl.value,
          data: dataEl.value,
          prompt: sPrompt.checked?1:0,
          rag: sRAG.checked?1:0,
          augment: sAug.checked?1:0,
            filter: sFilter.checked?1:0,
          sft: sSFT.checked?1:0,
          rlhf: sRLHF.checked?1:0
        });
        const url = `${location.origin}${location.pathname}#question-45?${params.toString()}`;
        navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
      });

      // Export JSON snapshot
      exportBtn?.addEventListener('click', ()=>{
        // replicate calculations
        const severity = parseFloat(sevEl.value); const dataQ = parseFloat(dataEl.value);
        const chosen = {prompt:sPrompt.checked, rag:sRAG.checked, augment:sAug.checked, filter:sFilter.checked, sft:sSFT.checked, rlhf:sRLHF.checked};
        const r0 = 0.7 * (0.5 + 0.5*severity);
        const rAfter = residualRisk(r0, chosen, typeEl.value, severity, dataQ);
        const costs = costEstimate(chosen);
        const payload = {
          generated: new Date().toISOString(),
          config: { type:typeEl.value, severity:severity, dataQuality:dataQ, strategies: chosen },
          metrics: { baseRisk:r0, residualRisk:rAfter, reduction: r0 - rAfter, costs }
        };
        const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'mitigation-scenario.json';
        document.body.appendChild(link); link.click();
        setTimeout(()=>{ URL.revokeObjectURL(link.href); link.remove(); }, 100);
      });

      // Hash parse
      (function initFromHash(){
        if(!location.hash) return; const m = location.hash.match(/question-45\?(.*)$/); if(!m) return; const p = new URLSearchParams(m[1]);
        if(p.get('type')) typeEl.value=p.get('type');
        if(p.get('sev')) sevEl.value=p.get('sev');
        if(p.get('data')) dataEl.value=p.get('data');
        ['prompt','rag','augment','filter','sft','rlhf'].forEach(k=>{ const v=p.get(k); if(v!==null){ const el = {prompt:sPrompt, rag:sRAG, augment:sAug, filter:sFilter, sft:sSFT, rlhf:sRLHF}[k]; el.checked = v==='1'; }});
      })();
      render();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
