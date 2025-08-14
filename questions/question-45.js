// Question 45: How would you fix an LLM generating biased or incorrect outputs?
// Created: August 13, 2025
// Focus: Practical bias/error mitigation strategies and trade-offs

const question = {
  title: "45. How would you fix an LLM generating biased or incorrect outputs?",
  answer: `
    <div class="space-y-6">
      <!-- Main Concept -->
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">🧠 Core idea</h4>
        <p class="text-sm text-blue-800">Mitigating bias and errors is a <b>layered process</b>: analyze failure modes, improve inputs and data, and apply training- or inference-time controls. Combining <b>prompt guardrails</b>, <b>data improvements</b>, and <b>fine-tuning/RLHF</b> gives the most reliable gains.</p>
        <div class="text-xs mt-3 text-blue-800">
          Intuition model for residual risk after applying strategies:
          <div class="math-display mt-1">$$
          r_{after} \approx r_0\,\prod_{i} (1 - e_i),\quad e_i\in[0,1]
          $$</div>
          where \(r_0\) is base risk, and \(e_i\) are strategy-specific effectiveness terms (diminishing when tasks are severe or data is weak).
        </div>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h5 class="font-semibold text-green-900">🟢 Prompting & Guardrails</h5>
          <ul class="text-sm text-green-800 mt-2 space-y-1">
            <li>• Clear instructions and refusal policies</li>
            <li>• Output format checks and self-critique</li>
            <li>• Moderation filters and safety policies</li>
          </ul>
        </div>
        <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h5 class="font-semibold text-purple-900">🟣 Data & Retrieval</h5>
          <ul class="text-sm text-purple-800 mt-2 space-y-1">
            <li>• Balanced data and counterfactual augmentation</li>
            <li>• RAG for up-to-date factual grounding</li>
            <li>• Reweighting and debiasing during sampling</li>
          </ul>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h5 class="font-semibold text-orange-900">🟠 Fine-tuning & RLHF</h5>
          <ul class="text-sm text-orange-800 mt-2 space-y-1">
            <li>• SFT with curated examples and policies</li>
            <li>• DPO/RLHF to optimize preferences</li>
            <li>• Adversarial training to harden edge cases</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
      <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• <b>Fairness</b>: reduce demographic biases and harms</li>
          <li>• <b>Reliability</b>: more correct, consistent outputs</li>
          <li>• <b>Compliance</b>: meet safety and regulatory needs</li>
          <li>• <b>Trust</b>: transparent, auditable mitigation plan</li>
        </ul>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Bias & Error Mitigation Planner",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-amber-200\">
          <div class=\"grid md:grid-cols-6 gap-4 text-xs\">
            <div class=\"md:col-span-2\">
              <label class=\"font-semibold text-gray-700\">Failure type</label>
              <select id=\"q45-type\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"bias\" selected>Bias (stereotypes, unfair treatment)</option>
              <div class="math-display mt-1">$$
              r_\\text{after} \\approx r_0\\,\\prod_i \\bigl(1 - e_i\\bigr),\\quad e_i\\in[0,1]
              $$</div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Severity</label>
              <input id=\"q45-sev\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.6\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q45-sev-val\" class=\"font-mono\">0.60</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Data quality</label>
              <input id=\"q45-data\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.5\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q45-data-val\" class=\"font-mono\">0.50</span></div>
            </div>
            <div class=\"md:col-span-3\">
              <label class=\"font-semibold text-gray-700\">Strategies</label>
              <div class=\"grid grid-cols-3 gap-2 mt-1\">
                <label class=\"flex items-center gap-1\"><input id=\"q45-s-prompt\" type=\"checkbox\" checked /> <span>Prompt guardrails</span></label>
                <label class=\"flex items-center gap-1\"><input id=\"q45-s-rag\" type=\"checkbox\" /> <span>RAG grounding</span></label>
                <label class=\"flex items-center gap-1\"><input id=\"q45-s-augment\" type=\"checkbox\" checked /> <span>Data rebal/augment</span></label>
                <label class=\"flex items-center gap-1\"><input id=\"q45-s-filter\" type=\"checkbox\" checked /> <span>Safety filter</span></label>
                <label class=\"flex items-center gap-1\"><input id=\"q45-s-sft\" type=\"checkbox\" /> <span>SFT fine-tune</span></label>
                <label class=\"flex items-center gap-1\"><input id=\"q45-s-rlhf\" type=\"checkbox\" /> <span>RLHF/DPO</span></label>
              </div>
            </div>
          </div>
          <p class=\"text-[11px] text-gray-600 mt-2\">Residual risk uses a multiplicative reduction model with diminishing returns at high severity and low data quality.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📉 Risk impact</h5>
            <div id=\"q45-bars\" class=\"text-xs text-gray-700 space-y-1\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q45-metrics\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧠 Recommendation</h5>
            <div id=\"q45-explain\" class=\"text-xs text-gray-700\"></div>
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
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${pct}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 rounded\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function badge(text, color){
        return `<span class=\"inline-block px-2 py-0.5 rounded text-white text-[11px] bg-${color}-600\">${text}</span>`;
      }

      function recommend(type, rAfter, costs){
        if (rAfter <= 0.25) return `${badge('Good', 'emerald')} Layered plan meets quality: keep monitoring.`;
        if (type === 'factual') return `${badge('Add RAG', 'indigo')} Ground with retrieval and add SFT if volume warrants.`;
        if (type === 'bias') return `${badge('Data + SFT', 'purple')} Expand counterfactuals, rebalance data, then fine-tune.`;
        return `${badge('Safety + RLHF', 'rose')} Strengthen filters and preference optimize for safe completions.`;
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
          <div>Type: <span class=\"font-mono\">${type}</span> | Severity: <span class=\"font-mono\">${severity.toFixed(2)}</span> | Data: <span class=\"font-mono\">${dataQ.toFixed(2)}</span></div>
          <div>Risk reduction: <span class=\"font-mono\">${((r0 - rAfter)*100).toFixed(1)}%</span></div>
          <div>Costs — token: <span class=\"font-mono\">${costs.token.toFixed(2)}</span>, train: <span class=\"font-mono\">${costs.train.toFixed(2)}</span>, time: <span class=\"font-mono\">${costs.time.toFixed(2)}</span></div>
        `;

        explainEl.innerHTML = `
          <div class=\"space-y-2\">
            <div><b>Layered controls.</b> Prompt guardrails and filters reduce unsafe completions immediately; RAG and data fixes address evidence quality; SFT/RLHF harden long-term behavior.</div>
            <div>Residual risk model: <span class=\"font-mono\">r_after = r0 · ∏(1 - e_i)</span>, with <span class=\"font-mono\">e_i</span> scaled by severity and data quality.</div>
            <div class=\"mt-1\">${recommend(type, rAfter, costs)}</div>
            <div class=\"text-[11px] text-gray-600\">Heuristic planner for intuition, not a guarantee. Measure with audits and red-teaming.</div>
          </div>
        `;

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [typeEl, sevEl, dataEl, sPrompt, sRAG, sAug, sFilter, sSFT, sRLHF].forEach(el => {
        el.addEventListener('input', render);
        el.addEventListener('change', render);
      });
      render();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
