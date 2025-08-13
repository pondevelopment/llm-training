// Question 44: What is few-shot learning, and what are its benefits?
// Created: August 13, 2025
// Focus: In-context few-shot prompting vs zero-shot and fine-tuning trade-offs

const question = {
  title: "44. What is few-shot learning, and what are its benefits?",
  answer: `
    <div class="space-y-6">
      <!-- Main Concept -->
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">🧠 Core idea</h4>
        <p class="text-sm text-blue-800">Few-shot learning lets an LLM <b>adapt at inference</b> by including a handful of <b>labeled examples</b> in the prompt. The model infers the pattern and applies it to the new query—no parameter updates required.</p>
        <div class="text-xs mt-3 text-blue-800">
          A simple saturating benefit model (intuition):
          <div class="math-display mt-1">$$
          p(K) \\approx 1 - (1 - p_0)\, e^{-\\lambda \, s \, c \, K}
          $$</div>
          where \(p_0\) is zero-shot accuracy, \(K\) the number of shots, \(s\) the example similarity, \(c\) an optional chain-of-thought boost, and \(\\lambda\) controls diminishing returns.
        </div>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h5 class="font-semibold text-green-900">🟢 Zero-shot</h5>
          <ul class="text-sm text-green-800 mt-2 space-y-1">
            <li>• No examples, lowest token cost</li>
            <li>• Works well for broadly aligned tasks</li>
          </ul>
        </div>
        <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h5 class="font-semibold text-purple-900">🟣 Few-shot (in-context)</h5>
          <ul class="text-sm text-purple-800 mt-2 space-y-1">
            <li>• Add task-specific examples at inference</li>
            <li>• Rapid adaptation, no training needed</li>
          </ul>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h5 class="font-semibold text-orange-900">🟠 Fine-tuning</h5>
          <ul class="text-sm text-orange-800 mt-2 space-y-1">
            <li>• Highest upfront work, lowest per-call cost</li>
            <li>• Best for persistent, high-volume tasks</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
      <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• <b>Rapid iteration</b>: improve behavior without retraining</li>
          <li>• <b>Data efficiency</b>: only a handful of examples needed</li>
          <li>• <b>Cost control</b>: trade token cost for quality per call</li>
          <li>• <b>Edge cases</b>: adapt to niche domains/tasks quickly</li>
        </ul>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 In‑Context Few‑Shot Explorer (benefit vs token cost)",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200\">
          <div class=\"grid md:grid-cols-5 gap-4 text-xs\">
            <div>
              <label class=\"font-semibold text-gray-700\">Shots K</label>
              <input id=\"q44-k\" type=\"range\" min=\"0\" max=\"16\" step=\"1\" value=\"4\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q44-k-val\" class=\"font-mono\">4</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Similarity s</label>
              <input id=\"q44-s\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.7\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q44-s-val\" class=\"font-mono\">0.70</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Zero‑shot p₀</label>
              <input id=\"q44-p0\" type=\"range\" min=\"0.20\" max=\"0.90\" step=\"0.01\" value=\"0.45\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q44-p0-val\" class=\"font-mono\">0.45</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">CoT</label>
              <select id=\"q44-cot\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"off\" selected>Off</option>
                <option value=\"on\">On (↑ quality, ↑ tokens)</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Budget / shot size</label>
              <div class=\"flex gap-1\">
                <select id=\"q44-budget\" class=\"w-1/2 border rounded p-1 text-xs\">
                  <option value=\"256\">256 tok</option>
                  <option value=\"512\" selected>512 tok</option>
                  <option value=\"1024\">1024 tok</option>
                </select>
                <select id=\"q44-len\" class=\"w-1/2 border rounded p-1 text-xs\">
                  <option value=\"32\">32/shot</option>
                  <option value=\"64\" selected>64/shot</option>
                  <option value=\"128\">128/shot</option>
                </select>
              </div>
            </div>
          </div>
          <p class=\"text-[11px] text-gray-600 mt-2\">We model accuracy with diminishing returns and account for token budget. CoT increases both quality gain and token cost per shot.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📈 Accuracy vs baseline</h5>
            <div id=\"q44-bars\" class=\"text-xs text-gray-700 space-y-1\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q44-metrics\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧠 Explanation</h5>
            <div id=\"q44-explain\" class=\"text-xs text-gray-700\"></div>
          </div>
        </div>
      </div>
    `,
    script: () => {
      const KEl = document.getElementById('q44-k');
      const SEl = document.getElementById('q44-s');
      const PEl = document.getElementById('q44-p0');
      const CEl = document.getElementById('q44-cot');
      const BEl = document.getElementById('q44-budget');
      const LEl = document.getElementById('q44-len');
      const KVal = document.getElementById('q44-k-val');
      const SVal = document.getElementById('q44-s-val');
      const PVal = document.getElementById('q44-p0-val');

      const barsEl = document.getElementById('q44-bars');
      const metricsEl = document.getElementById('q44-metrics');
      const explainEl = document.getElementById('q44-explain');
      if (!KEl) return;

      function accuracy(p0, K, s, cotOn){
        const lambda = 0.55; // diminishing returns strength
        const c = cotOn ? 1.3 : 1.0; // CoT quality multiplier
        const p = 1 - (1 - p0) * Math.exp(-lambda * s * c * K);
        return Math.min(0.999, Math.max(0, p));
      }

      function budget(K, perShot, budget, cotOn){
        const overhead = 64; // instructions + question
        const per = perShot * (cotOn ? 2 : 1);
        const maxK = Math.max(0, Math.floor((budget - overhead) / Math.max(1, per)));
        const used = overhead + Math.min(K, maxK) * per;
        return { maxK, used, per, overhead };
      }

      function bar(label, val, color){
        const pct = Math.round(val * 100);
        return `<div>
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${(val*100).toFixed(1)}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 rounded\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function fmt(n){
        if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (n >= 1e3) return (n/1e3).toFixed(2)+'k';
        return n.toString();
      }

      function render(){
        const K = parseInt(KEl.value,10);
        const s = parseFloat(SEl.value);
        const p0 = parseFloat(PEl.value);
        const cotOn = CEl.value === 'on';
        const budgetTok = parseInt(BEl.value,10);
        const lenShot = parseInt(LEl.value,10);

        KVal.textContent = K;
        SVal.textContent = s.toFixed(2);
        PVal.textContent = p0.toFixed(2);

        const bud = budget(K, lenShot, budgetTok, cotOn);
        const effectiveK = Math.min(K, bud.maxK);
        const pEff = accuracy(p0, effectiveK, s, cotOn);
        const pBase = p0;

        barsEl.innerHTML = bar('Zero-shot', pBase, 'rose') +
                           '<div class="h-1"></div>' +
                           bar(`Few-shot (effective K=${effectiveK})`, pEff, 'emerald');

        const delta = (pEff - pBase) * 100;
        const shotsCost = effectiveK * bud.per;
        const costPerPct = delta > 0 ? (shotsCost / delta).toFixed(1) : '—';
        const warn = K > bud.maxK ? `<div class=\"text-[11px] text-amber-700\">Requested K exceeds budget; truncated to ${bud.maxK}.</div>` : '';
        metricsEl.innerHTML = `
          <div>Tokens used: <span class=\"font-mono\">${bud.used}</span> / <span class=\"font-mono\">${budgetTok}</span> (${cotOn?'CoT on':'CoT off'}, per-shot <span class=\"font-mono\">${bud.per}</span>)</div>
          <div>Improvement: <span class=\"font-mono\">${delta.toFixed(1)}%</span> over zero-shot</div>
          <div>Token cost per +1%: <span class=\"font-mono\">${costPerPct}</span></div>
          ${warn}
        `;

        explainEl.innerHTML = `
          <div class=\"space-y-2\">
            <div><b>Diminishing returns.</b> Each extra shot helps less. Model: <span class=\"font-mono\">p(K) = 1 - (1-p0) · e^{-λ·s·c·K}</span>.</div>
            <div><b>Similarity matters.</b> Higher <span class=\"font-mono\">s</span> → bigger jumps for the same K.</div>
            <div><b>Chain-of-thought.</b> CoT can boost quality (c>1) but doubles per-shot tokens.</div>
            <div class=\"text-[11px] text-gray-600\">Heuristic simulator for intuition; real performance depends on model, prompt style, and retrieval quality.</div>
          </div>
        `;

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [KEl,SEl,PEl,CEl,BEl,LEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
